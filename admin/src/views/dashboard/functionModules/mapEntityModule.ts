import * as Cesium from "cesium";
import { signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { ID_PREFIX_SIGNAL_LIGHT, ID_PREFIX_SIGNAL_LIGHT_GROUP } from "@/views/dashboard/functionModules/constant.ts";
import signalLight1Svg from "@/assets/images2/signal-light-1.png";

/**
 * 地图实体
 */
export class MapEntityModule {
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


  // 曾经选择的实体
  private _history_selectedEntityIds: { index: number, timestamp: number, data: string[] }[] = []
  get history_selectedEntityIds() {
    return this._history_selectedEntityIds
  }

  private setHistorySelectedEntityIds(value: string[]) {
    const index = this._history_selectedEntityIds.length === 0 ? 0 : (this._history_selectedEntityIds[this._history_selectedEntityIds.length - 1].index + 1);
    const oldd = JSON.parse(JSON.stringify(this._history_selectedEntityIds));
    this._history_selectedEntityIds = [
      ...oldd,
      {
        index: index,
        timestamp: new Date().getTime(),
        data: value
      }
    ]
    if (this._history_selectedEntityIds.length > 100) {
      this._history_selectedEntityIds.splice(0, 1)
    }
  }

  // 获取上一个选中的实体
  public getHistorySelectedEntityIds() {
    if (this.history_selectedEntityIds.length < 2) {
      return null
    }
    return this.history_selectedEntityIds[this.history_selectedEntityIds.length - 1 - 1]
  }

  // 当前选中的实体，注意，添加数据时，禁止使用数组方法
  private _selectedEntityIds: string[] = []

  // 当前选中的实体，注意，添加数据时，禁止使用数组方法
  get selectedEntityIds(): string[] {
    return this._selectedEntityIds;
  }

  // 当前选中的实体，注意，添加数据时，禁止使用数组方法
  set selectedEntityIds(value: string[]) {
    this._selectedEntityIds = value;
    this.setHistorySelectedEntityIds(value);
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
    const seidsByGroup = this.getSelectedEntityIdsByGroup();
    // 信号灯组
    if (ifRefresh) {
      const ids = [
        ...res.signalLightGroupInfos.map(item => item.id),
        ...seidsByGroup.signalLightGroupInfo
      ]
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
  }
}
