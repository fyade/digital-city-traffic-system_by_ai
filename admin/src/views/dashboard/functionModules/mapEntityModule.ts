import * as Cesium from "cesium";
import { signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { ID_PREFIX_SIGNAL_LIGHT_GROUP } from "@/views/dashboard/functionModules/constant.ts";
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


  // 当前选中的实体
  private _selectedEntityIds: string[] = []

  get selectedEntityIds(): string[] {
    return this._selectedEntityIds;
  }

  set selectedEntityIds(value: string[]) {
    this._selectedEntityIds = value;
    if (this.refreshContextMenuOption) {
      this.refreshContextMenuOption()
    }
  }

  // 已渲染的信号灯组的id列表
  private renderedSignalLightGroupIds: string[] = []

  /**
   * 刷新可视区域内的实体
   * @param ifRefresh
   */
  public refreshScreenEntities(ifRefresh = false) {
    this.drawSignalLightGroupsWhenMapMove(ifRefresh)
  }

  /**
   * 查询可视区域内的信号灯组
   * @param ifRefresh
   */
  private drawSignalLightGroupsWhenMapMove(ifRefresh = false) {
    if (!this.getViewCornerCoordinates) {
      return
    }
    const viewCornerCoordinates = this.getViewCornerCoordinates();
    if (viewCornerCoordinates && viewCornerCoordinates.length >= 3) {
      viewCornerCoordinates.push(viewCornerCoordinates[0])
      signalLightGroupsInPolygonApi({
        version: '1.0',
        points: viewCornerCoordinates
      }).then(res => {
        if (!this.viewer) {
          return
        }
        if (ifRefresh) {
          const ids = [
            ...res.map(item => item.id),
            ...this.selectedEntityIds.map(item => item.replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, ''))
          ]
          for (const id of ids) {
            const d = `${ID_PREFIX_SIGNAL_LIGHT_GROUP}${id}`;
            const index = this.renderedSignalLightGroupIds.indexOf(d);
            if (index > -1) {
              this.viewer.entities.removeById(d)
              this.renderedSignalLightGroupIds.splice(index, 1)
            }
          }
        }
        for (const re of res) {
          const d = `${ID_PREFIX_SIGNAL_LIGHT_GROUP}${re.id}`;
          if (this.renderedSignalLightGroupIds.includes(d)) {
            continue;
          }
          this.renderedSignalLightGroupIds.push(d)
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
      })
    }
  }
}
