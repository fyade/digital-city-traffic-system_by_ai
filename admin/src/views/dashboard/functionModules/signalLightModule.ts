import * as Cesium from "cesium";
import { CalculateLightsInPolygonDto, CalculateLightsInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import { ClockModule } from "@/views/dashboard/functionModules/clockModule.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { base } from "@dcts/common";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";
import { calculateLightsInPolygonApi, signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import {
  CESIUM_DEFAULT,
  ID_PREFIX_SIGNAL_LIGHT,
  ID_PREFIX_SIGNAL_LIGHT_GROUP
} from "@/views/dashboard/functionModules/constant.ts";
import signalLight1Svg from "@/assets/images2/signal-light-1.png";
import { getLightCanvas } from "@/views/dashboard/utils/funcs.ts";

/**
 * 信号灯模块
 */
export class SignalLightModule {
  private cModule: ClockModule | null = null

  public setCModule(cModule: ClockModule) {
    this.cModule = cModule;
  }

  private lnModule: LayerNotificationModule | null = null

  public setLnModule(lnModule: LayerNotificationModule) {
    this.lnModule = lnModule;
  }

  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: VersionDataModule) {
    this.vdModule = vdModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: () => { lon: number, lat: number }[] | null) {
    this.getViewCornerCoordinates = func
  }


  private datas: CalculateLightsInPolygonVo[] = []
  private calculatedLightTimes: { childLightId: number, times: [number, number][] }[] = []

  public addTask(results: CalculateLightsInPolygonVo[]) {
    for (const result of results) {
      const find = this.datas.find(item => item.signalLightChildId === result.signalLightChildId);
      if (find) {
        find.runParam.push(...result.runParam)
      } else {
        this.datas.push(result)
      }
    }
    for (const data of this.datas) {
      if (data.runParam.length === 0) {
        continue
      }
      const find = this.calculatedLightTimes.find(item => item.childLightId === data.signalLightChildId);
      if (find) {
        find.times.push([data.runParam[0].start, data.runParam[data.runParam.length - 1].end])
      } else {
        this.calculatedLightTimes.push({
          childLightId: data.signalLightChildId,
          times: [[data.runParam[0].start, data.runParam[data.runParam.length - 1].end]]
        })
      }
    }
    if (!this.vdModule) {
      return
    }
    if (!this.meModule) {
      return;
    }
    if (!this.viewer) {
      return;
    }
    const slcIds = results.map(item => item.signalLightChildId);
    this.vdModule.setHistoryRunningSignalLightIds(slcIds)
    const last0 = this.vdModule.getHistoryRunningSignalLightIds(0)
    const last1 = this.vdModule.getHistoryRunningSignalLightIds(-1)
    if (!last0 || !last1) {
      return;
    }
    const filter = last1.data.filter(id => !last0.data.includes(id));
    for (const id of filter) {
      this.setSignalLightToPic(id)
    }
  }

  public setSignalLightToPic(id: number) {
    if (!this.viewer) {
      return;
    }
    const entity = this.viewer.entities.getById(`${ID_PREFIX_SIGNAL_LIGHT}${id}`);
    if (!entity || !entity.billboard) {
      return
    }
    entity.billboard.width = new Cesium.ConstantProperty(24)
    entity.billboard.height = new Cesium.ConstantProperty(24)
    entity.billboard.image = new Cesium.ConstantProperty(signalLight1Svg)
  }

  public setSignalLightColor(id: number, style: base.SignalLightUnitStyleEnum[] | null, lightTypes: base.SLSPLTTypeEnum[], color: base.SignalLightColorEnum, ifHalfSecond: boolean, leftTime: number) {
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(`${ID_PREFIX_SIGNAL_LIGHT}${id}`);
    if (!entity || !entity.billboard) {
      return;
    }
    // 根据信号灯样式、颜色、时长生成对应的canvas
    if (!this.vdModule) {
      return;
    }
    const color1 = (ifHalfSecond && color === base.SignalLightColorEnum.YELLOW) ? base.SignalLightColorEnum.NONE : color;
    const lightCanvas = getLightCanvas(style, lightTypes, color1, leftTime);
    if (!lightCanvas) {
      return;
    }
    // 修改为对应颜色的信号灯
    entity.billboard.width = new Cesium.ConstantProperty(lightCanvas.canvasWidth)
    entity.billboard.height = new Cesium.ConstantProperty(lightCanvas.canvasHeight)
    entity.billboard.image = new Cesium.ConstantProperty(lightCanvas.canvas)
  }

  private lastTickTime: number | null = null
  private _tick_deviation_time = 50

  public tick() {
    if (!this.viewer) {
      return
    }
    if (!this.vdModule) {
      return;
    }
    const sls = this.vdModule.getHistorySignalLightGroupsInPolygonVo();
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    if (!this.lastTickTime || (now % 500 <= this._tick_deviation_time && Math.abs(now - this.lastTickTime) >= (500 - this._tick_deviation_time))) {
      this.lastTickTime = now
      for (const data of this.datas) {
        const entity = this.viewer.entities.getById(`${ID_PREFIX_SIGNAL_LIGHT}${data.signalLightChildId}`);
        if (!entity) {
          continue
        }
        const rp = data.runParam.filter(item => item.start <= now && now <= item.end);
        if (rp.length === 0) {
          this.setSignalLightToPic(data.signalLightChildId)
          continue
        }
        const leftTime = Math.floor((rp[0].end - now) / 1000);
        let style: base.SignalLightUnitStyleEnum[] | null = null
        if (sls) {
          const find = sls.data.signalLightChildStyleMappings.find(item => item.childId === data.signalLightChildId);
          if (find) {
            const find1 = sls.data.signalLightStyles.find(item => item.id === find.styleId);
            if (find1) {
              style = find1.style.split('-').filter(_ => _) as base.SignalLightUnitStyleEnum[]
            }
          }
        }
        const ifHalfSecond = Math.abs(now % 1000 - 500) <= this._tick_deviation_time && rp[0].color === base.SignalLightColorEnum.YELLOW
        this.setSignalLightColor(data.signalLightChildId, style, rp[0].lightType, rp[0].color, ifHalfSecond, leftTime)
      }
    }
  }

  // 已渲染的信号灯组、子信号灯的id列表
  private renderedItemIds: string[] = []

  /**
   * 查询可视区域内的信号灯组及子信号灯
   * @param ifRefresh
   * @param ifReplay
   */
  public drawSignalLightsWhenMapMove({
                                       ifRefresh = false,
                                       ifReplay = false,
                                     }: {
                                       ifRefresh?: boolean
                                       ifReplay?: boolean
                                     }
  ) {
    if (!this.viewer) {
      return
    }
    if (!this.meModule) {
      return;
    }
    if (!this.meModule.getIfShowSignalLight()) {
      return
    }
    if (!this.getViewCornerCoordinates) {
      return
    }
    const viewCornerCoordinates = this.getViewCornerCoordinates();
    if (!viewCornerCoordinates || viewCornerCoordinates.length < 3) {
      return
    }
    if (this.lnModule) {
      this.lnModule.openSignalLightLoading()
    }
    viewCornerCoordinates.push(viewCornerCoordinates[0])
    signalLightGroupsInPolygonApi({points: viewCornerCoordinates}).then(res => {
      if (!this.viewer) {
        return
      }
      if (!this.meModule) {
        return;
      }
      if (this.vdModule) {
        this.vdModule.setHistorySignalLightGroupsInPolygonVo(res)
      }
      const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
      // 信号灯组
      if (ifRefresh) {
        const ids = [
          ...res.signalLightGroupInfos.map(item => item.id),
          ...seidsByGroup.signalLightGroupInfo
        ]
        if (this.vdModule) {
          const hslgip = this.vdModule.getHistorySignalLightGroupsInPolygonVo(-1);
          if (hslgip) {
            const _ids = hslgip.data.signalLightGroupInfos.map(item => item.id);
            ids.push(..._ids)
          }
        }
        for (const id of ids) {
          const d = `${ID_PREFIX_SIGNAL_LIGHT_GROUP}${id}`;
          const index = this.renderedItemIds.indexOf(d);
          if (index > -1) {
            this.viewer.entities.removeById(d)
            this.renderedItemIds.splice(index, 1)
          }
        }
      }
      for (const re of res.signalLightGroupInfos) {
        const d = `${ID_PREFIX_SIGNAL_LIGHT_GROUP}${re.id}`;
        if (this.renderedItemIds.includes(d)) {
          continue;
        }
        this.renderedItemIds.push(d)
        const strings = re.location.split(',').map(Number) as [number, number];
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1], CESIUM_DEFAULT.HEIGHT_SIGNAL_LIGHT_GROUP),
          billboard: {
            image: signalLight1Svg,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            width: CESIUM_DEFAULT.SIGNAL_LIGHT_GROUP_PIC_WIDTH,
            height: CESIUM_DEFAULT.SIGNAL_LIGHT_GROUP_PIC_HEIGHT
          },
          id: d,
        });
      }
      // 子信号灯
      if (ifRefresh) {
        const ids = [
          ...res.signalLightInfos.map(item => item.id),
          ...seidsByGroup.signalLightInfo
        ]
        if (this.vdModule) {
          const hslgip = this.vdModule.getHistorySignalLightGroupsInPolygonVo(-1);
          if (hslgip) {
            const _ids = hslgip.data.signalLightInfos.map(item => item.id);
            ids.push(..._ids)
          }
        }
        for (const id of ids) {
          const d = `${ID_PREFIX_SIGNAL_LIGHT}${id}`;
          const index = this.renderedItemIds.indexOf(d);
          if (index > -1) {
            this.viewer.entities.removeById(d)
            this.renderedItemIds.splice(index, 1)
          }
        }
      }
      for (const re of res.signalLightInfos) {
        const d = `${ID_PREFIX_SIGNAL_LIGHT}${re.id}`
        if (this.renderedItemIds.includes(d)) {
          continue;
        }
        this.renderedItemIds.push(d)
        const strings = re.location.split(',').map(Number) as [number, number];
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1], CESIUM_DEFAULT.HEIGHT_SIGNAL_LIGHT),
          billboard: {
            image: signalLight1Svg,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            width: CESIUM_DEFAULT.SIGNAL_LIGHT_PIC_WIDTH,
            height: CESIUM_DEFAULT.SIGNAL_LIGHT_PIC_HEIGHT
          },
          id: d
        });
      }
    })

    const reqparam = new CalculateLightsInPolygonDto()
    reqparam.points = viewCornerCoordinates
    if (ifReplay) {
      const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
      reqparam.timeRange = [
        now - 1000 * 60 * 5,
        now + 1000 * 60 * 25,
      ]
    }
    calculateLightsInPolygonApi(reqparam)
  }
}
