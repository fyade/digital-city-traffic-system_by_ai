import * as Cesium from "cesium";
import { calculateLightsInPolygonApi, signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { ID_PREFIX_SIGNAL_LIGHT, ID_PREFIX_SIGNAL_LIGHT_GROUP } from "@/views/dashboard/functionModules/constant.ts";
import signalLight1Svg from "@/assets/images2/signal-light-1.png";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";

const canvasWidth = 60
const canvasHeight = 16
const canvasCircleDiameter = 10
const canvasPadding = (canvasHeight - canvasCircleDiameter) / 2

const lightCanvasMap = new Map<string, HTMLCanvasElement>();

/**
 * 获取使用Canvas动态生成信号灯图像的缓存
 * @param color
 * @param time
 */
function getLightCanvas(color: 'red' | 'green' | 'yellow' | '', time: number) {
  const t0 = Math.min(time, 99);
  const canvas0 = lightCanvasMap.get(`${color}.${t0}`);
  if (canvas0) {
    return canvas0
  }
  const trafficLightCanvas = createTrafficLightCanvas(color, t0);
  if (trafficLightCanvas) {
    lightCanvasMap.set(`${color}.${t0}`, trafficLightCanvas);
    return trafficLightCanvas
  }
  return null
}

/**
 * 使用Canvas动态生成信号灯图像
 * @param activeColor
 * @param time
 */
function createTrafficLightCanvas(activeColor = '', time = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null
  }

  // 绘制灯框
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 绘制红灯
  ctx.beginPath();
  ctx.arc((canvasPadding + canvasCircleDiameter) - canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'red' ? 'red' : '#400';
  ctx.fill();

  // 绘制黄灯
  ctx.beginPath();
  ctx.arc((canvasPadding + canvasCircleDiameter) * 2 - canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'yellow' ? 'yellow' : '#440';
  ctx.fill();

  // 绘制绿灯
  ctx.beginPath();
  ctx.arc((canvasPadding + canvasCircleDiameter) * 3 - canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
  ctx.fillStyle = activeColor === 'green' ? '#0f0' : '#004';
  ctx.fill();

  // 绘制倒数
  ctx.font = `${canvasCircleDiameter * 1.2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${time}`, ((canvasPadding + canvasCircleDiameter) * 3 + canvasWidth) / 2, canvasHeight / 2)

  return canvas;
}

/**
 * 地图实体
 */
export class MapEntityModule {
  private lnModule: LayerNotificationModule | null = null

  public setLnModule(lnModule: LayerNotificationModule) {
    this.lnModule = lnModule;
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: VersionDataModule) {
    this.vdModule = vdModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private refreshContextMenuOption: (() => void) | null = null

  public setRefreshContextMenuOption(func: () => void) {
    this.refreshContextMenuOption = func
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: () => { lon: number, lat: number }[] | null) {
    this.getViewCornerCoordinates = func
  }


  // 当前选中的实体，注意，添加数据时，禁止使用数组方法
  private _selectedEntityIds: string[] = []

  // 当前选中的实体，注意，添加数据时，禁止使用数组方法
  get selectedEntityIds(): string[] {
    return this._selectedEntityIds;
  }

  // 当前选中的实体，注意，添加数据时，禁止使用数组方法
  public set selectedEntityIds(value: string[]) {
    this._selectedEntityIds = value;
    if (this.vdModule) {
      this.vdModule.setHistorySelectedEntityIds(value);
    }
    if (this.refreshContextMenuOption) {
      this.refreshContextMenuOption()
    }
  }

  public getSelectedEntityIdsByGroup() {
    const obj = {
      signalLightGroupInfo: [] as string[],
      get signalLightGroupInfoCount() {
        return this.signalLightGroupInfo.length
      },
      signalLightInfo: [] as string[],
      get signalLightInfoCount() {
        return this.signalLightInfo.length
      },
      get allIds() {
        return [
          ...this.signalLightGroupInfo,
          ...this.signalLightInfo
        ]
      },
      get count() {
        return this.allIds.length
      }
    }
    for (const selectedEntityId of this.selectedEntityIds) {
      if (selectedEntityId.startsWith(ID_PREFIX_SIGNAL_LIGHT_GROUP)) {
        obj.signalLightGroupInfo.push(selectedEntityId.replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, ''))
      }
      if (selectedEntityId.startsWith(ID_PREFIX_SIGNAL_LIGHT)) {
        obj.signalLightInfo.push(selectedEntityId.replace(ID_PREFIX_SIGNAL_LIGHT, ''))
      }
    }
    return obj
  }

  // 已渲染的信号灯组、子信号灯的id列表
  private renderedItemIds: string[] = []

  /**
   * 刷新可视区域内的实体
   * @param ifRefresh
   */
  public async refreshScreenEntities(ifRefresh = false) {
    if (this.lnModule) {
      this.lnModule.openSignalLightLoading()
    }
    await this.drawSignalLightsWhenMapMove(ifRefresh)
  }

  /**
   * 查询可视区域内的信号灯组及子信号灯
   * @param ifRefresh
   */
  private async drawSignalLightsWhenMapMove(ifRefresh = false) {
    if (!this.viewer) {
      return
    }
    if (!this.getViewCornerCoordinates) {
      return
    }
    const viewCornerCoordinates = this.getViewCornerCoordinates();
    if (!viewCornerCoordinates || viewCornerCoordinates.length < 3) {
      return
    }
    viewCornerCoordinates.push(viewCornerCoordinates[0])
    const res = await signalLightGroupsInPolygonApi({
      version: '1.0',
      ifChild: true,
      points: viewCornerCoordinates
    })
    if (this.vdModule) {
      this.vdModule.setHistorySignalLightGroupsInPolygonVo(res)
    }
    const seidsByGroup = this.getSelectedEntityIdsByGroup();
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
        position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1]),
        billboard: {
          image: signalLight1Svg,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          width: 32,
          height: 32
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
        position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1]),
        billboard: {
          image: signalLight1Svg,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          width: 24,
          height: 24
        },
        id: d,
      });
    }

    await calculateLightsInPolygonApi({
      version: '1.0',
      points: viewCornerCoordinates
    })
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

  public setSignalLightColor(id: number, color: string, ifHalfSecond: boolean, leftTime: number) {
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(`${ID_PREFIX_SIGNAL_LIGHT}${id}`);
    if (!entity || !entity.billboard) {
      return;
    }
    // 修改为对应颜色的信号灯
    entity.billboard.width = new Cesium.ConstantProperty(canvasWidth)
    entity.billboard.height = new Cesium.ConstantProperty(canvasHeight)
    if (color === 'red') {
      entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('red', leftTime))
    } else if (color === 'green') {
      entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('green', leftTime))
    } else if (color === 'yellow') {
      if (ifHalfSecond) {
        entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('yellow', leftTime))
      } else {
        entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('', leftTime))
      }
    } else {
      entity.billboard.image = new Cesium.ConstantProperty(getLightCanvas('', leftTime))
    }
  }
}
