import * as Cesium from "cesium";
import { calculateLightsInPolygonApi, signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { ID_PREFIX_SIGNAL_LIGHT, ID_PREFIX_SIGNAL_LIGHT_GROUP } from "@/views/dashboard/functionModules/constant.ts";
import signalLight1Svg from "@/assets/images2/signal-light-1.png";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";
import { base, numberUtils } from "@dcts/common";

const lightCanvasMap = new Map<string, { canvasWidth: number, canvasHeight: number, canvas: HTMLCanvasElement }>();

/**
 * 获取使用Canvas动态生成信号灯图像的缓存
 * @param style 信号灯样式
 * @param currentLight 当前灯
 * @param color 当前灯的颜色
 * @param time 时长
 */
function getLightCanvas(style: base.SignalLightUnitStyleEnum[] | null, currentLight: base.SLSPLTTypeEnum[], color: base.SignalLightColorEnum, time: number) {
  const t0 = numberUtils.addZero(Math.min(time, 99));
  const style0 = style || [base.SignalLightUnitStyleEnum.LEFT, base.SignalLightUnitStyleEnum.ROUND, base.SignalLightUnitStyleEnum.NUMBER]
  const key = `${style0}.${currentLight}.${color}.${t0}`;
  const canvas0 = lightCanvasMap.get(key);
  if (canvas0) {
    return canvas0
  }
  const trafficLightCanvas = createTrafficLightCanvas(style0, currentLight, color, t0);
  if (trafficLightCanvas) {
    lightCanvasMap.set(key, trafficLightCanvas);
    return trafficLightCanvas
  }
  return null
}

/**
 * 使用Canvas动态生成信号灯图像
 * @param style 信号灯样式
 * @param currentLight 当前灯
 * @param color 当前灯的颜色
 * @param time 时长
 */
function createTrafficLightCanvas(style: base.SignalLightUnitStyleEnum[], currentLight: base.SLSPLTTypeEnum[], color: base.SignalLightColorEnum, time: string) {
  let canvasWidth = 3
  const canvasHeight = 16
  const canvasCircleDiameter = 10
  const canvasNumberWidth = 20
  const canvasPadding = 3

  for (const style1 of style) {
    if (style1 === base.SignalLightUnitStyleEnum.NUMBER) {
      canvasWidth += (canvasPadding + canvasNumberWidth)
    } else {
      canvasWidth += (canvasPadding + canvasCircleDiameter)
    }
  }

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

  const centerXY = {
    x: canvasPadding,
    y: canvasHeight / 2 - canvasCircleDiameter / 2
  }

  // 绘制灯
  for (let i = 0; i < style.length; i++) {
    const style1 = style[i]

    let _color: string = base.SignalLightColorEnum.RED
    if (currentLight.includes(base.SLSPLTTypeEnum.AROUND)) {
      if (style.includes(base.SignalLightUnitStyleEnum.AROUND) && style1 === base.SignalLightUnitStyleEnum.AROUND) {
        _color = color
      }
    }
    if (currentLight.includes(base.SLSPLTTypeEnum.LEFT)) {
      if (style.includes(base.SignalLightUnitStyleEnum.LEFT) && style1 === base.SignalLightUnitStyleEnum.LEFT) {
        _color = color
      }
      if (!style.includes(base.SignalLightUnitStyleEnum.LEFT) && i === style.indexOf(base.SignalLightUnitStyleEnum.ROUND)) {
        _color = color
      }
    }
    if (currentLight.includes(base.SLSPLTTypeEnum.STRAIGHT)) {
      if (style.includes(base.SignalLightUnitStyleEnum.STRAIGHT) && style1 === base.SignalLightUnitStyleEnum.STRAIGHT) {
        _color = color
      }
      if (!style.includes(base.SignalLightUnitStyleEnum.STRAIGHT) && style1 === base.SignalLightUnitStyleEnum.ROUND) {
        if (
            style.indexOf(base.SignalLightUnitStyleEnum.ROUND) <= (style.includes(base.SignalLightUnitStyleEnum.LEFT) ? i : i + 1)
            && (style.includes(base.SignalLightUnitStyleEnum.RIGHT) ? i : i - 1) <= style.lastIndexOf(base.SignalLightUnitStyleEnum.ROUND)
        ) {
          _color = color
        }
      }
    }
    if (currentLight.includes(base.SLSPLTTypeEnum.RIGHT)) {
      if (style.includes(base.SignalLightUnitStyleEnum.RIGHT) && style1 === base.SignalLightUnitStyleEnum.RIGHT) {
        _color = color
      }
      if (!style.includes(base.SignalLightUnitStyleEnum.RIGHT) && i === style.lastIndexOf(base.SignalLightUnitStyleEnum.ROUND)) {
        _color = color
      }
    }
    if (_color === base.SignalLightColorEnum.NONE) {
      _color = '#400'
    }

    switch (style1) {
      case base.SignalLightUnitStyleEnum.AROUND:
        ctx.beginPath();
        ctx.moveTo(centerXY.x + 3, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 6, centerXY.y + 7)
        ctx.lineTo(centerXY.x + 6, centerXY.y + 5)
        ctx.lineTo(centerXY.x + 4, centerXY.y + 7)
        ctx.lineTo(centerXY.x + 4, centerXY.y + 2)
        ctx.lineTo(centerXY.x + 7, centerXY.y + 2)
        ctx.lineTo(centerXY.x + 7, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 9, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 9, centerXY.y)
        ctx.lineTo(centerXY.x + 2, centerXY.y)
        ctx.lineTo(centerXY.x + 2, centerXY.y + 7)
        ctx.lineTo(centerXY.x, centerXY.y + 5)
        ctx.lineTo(centerXY.x, centerXY.y + 7)
        ctx.closePath();
        ctx.fillStyle = _color;
        ctx.fill();
        centerXY.x += canvasPadding + canvasCircleDiameter
        break
      case base.SignalLightUnitStyleEnum.LEFT:
        ctx.beginPath();
        ctx.moveTo(centerXY.x, centerXY.y + 5)
        ctx.lineTo(centerXY.x + 5, centerXY.y)
        ctx.lineTo(centerXY.x + 7, centerXY.y)
        ctx.lineTo(centerXY.x + 3, centerXY.y + 4)
        ctx.lineTo(centerXY.x + 10, centerXY.y + 4)
        ctx.lineTo(centerXY.x + 10, centerXY.y + 6)
        ctx.lineTo(centerXY.x + 3, centerXY.y + 6)
        ctx.lineTo(centerXY.x + 7, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 5, centerXY.y + 10)
        ctx.closePath();
        ctx.fillStyle = _color;
        ctx.fill();
        centerXY.x += canvasPadding + canvasCircleDiameter
        break
      case base.SignalLightUnitStyleEnum.STRAIGHT:
        ctx.beginPath();
        ctx.moveTo(centerXY.x + 5, centerXY.y)
        ctx.lineTo(centerXY.x + 10, centerXY.y + 5)
        ctx.lineTo(centerXY.x + 10, centerXY.y + 7)
        ctx.lineTo(centerXY.x + 6, centerXY.y + 3)
        ctx.lineTo(centerXY.x + 6, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 4, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 4, centerXY.y + 3)
        ctx.lineTo(centerXY.x, centerXY.y + 7)
        ctx.lineTo(centerXY.x, centerXY.y + 5)
        ctx.moveTo(centerXY.x, centerXY.y)
        ctx.lineTo(centerXY.x, centerXY.y)
        ctx.closePath();
        ctx.fillStyle = _color;
        ctx.fill();
        centerXY.x += canvasPadding + canvasCircleDiameter
        break
      case base.SignalLightUnitStyleEnum.RIGHT:
        ctx.beginPath();
        ctx.moveTo(centerXY.x + 10, centerXY.y + 5)
        ctx.lineTo(centerXY.x + 5, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 3, centerXY.y + 10)
        ctx.lineTo(centerXY.x + 7, centerXY.y + 6)
        ctx.lineTo(centerXY.x, centerXY.y + 6)
        ctx.lineTo(centerXY.x, centerXY.y + 4)
        ctx.lineTo(centerXY.x + 7, centerXY.y + 4)
        ctx.lineTo(centerXY.x + 3, centerXY.y)
        ctx.lineTo(centerXY.x + 5, centerXY.y)
        ctx.closePath();
        ctx.fillStyle = _color;
        ctx.fill();
        centerXY.x += canvasPadding + canvasCircleDiameter
        break
      case base.SignalLightUnitStyleEnum.ROUND:
        ctx.beginPath();
        ctx.arc(centerXY.x + canvasCircleDiameter / 2, canvasHeight / 2, canvasCircleDiameter / 2, 0, Math.PI * 2);
        ctx.fillStyle = _color;
        ctx.fill();
        centerXY.x += canvasPadding + canvasCircleDiameter
        break
      case base.SignalLightUnitStyleEnum.NUMBER:
        ctx.font = `${canvasCircleDiameter * 1.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(time, centerXY.x + canvasNumberWidth / 2, canvasHeight / 2)
        centerXY.x += canvasPadding + canvasNumberWidth
        break
    }
  }
  return {canvasWidth, canvasHeight, canvas};
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
    const res = await signalLightGroupsInPolygonApi({points: viewCornerCoordinates})
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
        position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1], 0),
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
        position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1], 0.01),
        billboard: {
          image: signalLight1Svg,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          width: 24,
          height: 24
        },
        id: d,
      });
    }

    await calculateLightsInPolygonApi({points: viewCornerCoordinates})
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
}
