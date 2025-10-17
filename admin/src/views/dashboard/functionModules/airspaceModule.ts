import { routerPushByName } from "@/utils/RouterUtils.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { getAirspaceInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import * as Cesium from "cesium";
import {
  CESIUM_DEFAULT,
  EDIT_TYPE_ENUM,
  ID_PREFIX_FLIGHT_RESTRICTION_ZONE, ID_PREFIX_FLIGHT_ROUTE, ID_SPECIAL_MouseMovingPolyline,
  ID_SPECIAL_preview_MouseMovingPolyline
} from "@/views/dashboard/functionModules/constant.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";

/**
 * 空域模块
 */
export class AirspaceModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }

  private miModule: MapInteractionModule | null = null

  public setMiModule(miModule: MapInteractionModule) {
    this.miModule = miModule;
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

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  // 新增限飞区时的临时点
  private tempPoints: [number, number][] = []

  public getTempPoints() {
    return this.tempPoints;
  }

  public addTempPoints(point: [number, number]) {
    this.tempPoints.push(point);
  }

  public endEditAirspace() {
    if (!this.miModule) {
      return
    }
    if (!this.vdModule) {
      return;
    }
    const editType = this.miModule.getEditType();
    this.miModule.setEditType(null)
    const tempPoints = this.tempPoints.length === 0 ? [] : [...this.tempPoints, this.tempPoints[0]];
    const tempPoints2 = this.tempPoints.length === 0 ? [] : this.tempPoints;
    const pointStr = tempPoints.map(points => points.join(' ')).join(', ');
    const pointStr2 = tempPoints2.map(pos => [...pos, CESIUM_DEFAULT.HEIGHT_DEFAULT_FLIGHT_ROUTE]).map(points => points.join(' ')).join(', ');
    this.tempPoints = []
    if (editType === EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE) {
      routerPushByName('~fp~:airspace:flightRestrictionZone:ins', {geometry: pointStr})
    } else if (editType === EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE) {
      let id = ''
      const hseids = this.vdModule.getHistorySelectedEntityIds(0);
      if (hseids) {
        id = hseids.data[0].replace(ID_PREFIX_FLIGHT_RESTRICTION_ZONE, '')
      }
      routerPushByName('~fp~:airspace:flightRestrictionZone:upd', {id: id, geometry: pointStr})
    } else if (editType === EDIT_TYPE_ENUM.INS_FLIGHT_ROUTE) {
      routerPushByName('~fp~:airspace:flightRoute:ins', {path: pointStr2})
    } else if (editType === EDIT_TYPE_ENUM.UPD_FLIGHT_ROUTE) {
      let id = ''
      const hseids = this.vdModule.getHistorySelectedEntityIds(0);
      if (hseids) {
        id = hseids.data[0].replace(ID_PREFIX_FLIGHT_ROUTE, '')
      }
      routerPushByName('~fp~:airspace:flightRoute:upd', {id: id, path: pointStr2})
    }
  }

  // 航线预览（新增/修改时的预览）
  public previewFlightRoute(points: [number, number, number][], ifDelete = false) {
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_preview_MouseMovingPolyline)
    if (ifDelete) {
      if (entity) {
        this.viewer.entities.removeById(ID_SPECIAL_preview_MouseMovingPolyline)
      }
    } else {
      const coordinates = points.flat().length >= 3 ? points.flat() : [0, 0, 0];
      if (entity) {
        if (entity.polyline) {
          entity.polyline.positions = new Cesium.ConstantProperty(Cesium.Cartesian3.fromDegreesArrayHeights(coordinates))
        }
      } else {
        this.viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinates),
            width: 3,
            material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_ROUTE,
            arcType: Cesium.ArcType.NONE
          },
          id: ID_SPECIAL_preview_MouseMovingPolyline
        });
      }
    }
  }

  // 已渲染的空域
  private renderedItemIds: string[] = []

  public refreshScreenAirspace({
                                 ifRefresh = false,
                               }: {
                                 ifRefresh?: boolean
                               } = {}
  ) {
    if (!this.getViewCornerCoordinates) {
      return
    }
    const coordinates = this.getViewCornerCoordinates();
    if (!coordinates) {
      return;
    }
    coordinates.push(coordinates[0])
    getAirspaceInPolygonApi({points: coordinates}).then(res => {
      if (!this.viewer) {
        return;
      }
      if (!this.meModule) {
        return;
      }
      if (!this.vdModule) {
        return;
      }
      this.vdModule.setHistoryAirspaceInPolygonVo(res)
      const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
      // 限飞区
      if (ifRefresh) {
        const ids = [
          ...res.flightRestrictionZones.map(item => item.id),
          ...seidsByGroup.flightRestrictionZone
        ]
        if (this.vdModule) {
          const haip = this.vdModule.getHistoryAirspaceInPolygonVo(-1);
          if (haip) {
            const _ids = haip.data.flightRestrictionZones.map(item => item.id)
            ids.push(..._ids)
          }
        }
        for (const id of ids) {
          const d = `${ID_PREFIX_FLIGHT_RESTRICTION_ZONE}${id}`
          const index = this.renderedItemIds.indexOf(d)
          if (index > -1) {
            this.viewer.entities.removeById(d)
            this.renderedItemIds.splice(index, 1)
          }
        }
      }
      for (const re of res.flightRestrictionZones) {
        const d = `${ID_PREFIX_FLIGHT_RESTRICTION_ZONE}${re.id}`;
        if (this.renderedItemIds.includes(d)) {
          continue
        }
        this.renderedItemIds.push(d)
        const strings = re.geometry.split(', ');
        const positions = strings.slice(0, strings.length - 1)
            .map(str => str.split(' '))
            .map(poArr => poArr.map(Number))
            .map(poArr => Cesium.Cartesian3.fromDegrees(poArr[0], poArr[1], CESIUM_DEFAULT.HEIGHT_FLIGHT_RESTRICTION_ZONE))
        let material = CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_RESTRICTION_ZONE;
        let outlineColor = CESIUM_DEFAULT.COLOR_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE;
        if (re.type === 'jfq') {
          material = CESIUM_DEFAULT.COLOR_JFQ_FLIGHT_RESTRICTION_ZONE
          outlineColor = CESIUM_DEFAULT.COLOR_OUTLINE_JFQ_FLIGHT_RESTRICTION_ZONE
        } else if (re.type === 'xgq') {
          material = CESIUM_DEFAULT.COLOR_XGQ_FLIGHT_RESTRICTION_ZONE
          outlineColor = CESIUM_DEFAULT.COLOR_OUTLINE_XGQ_FLIGHT_RESTRICTION_ZONE
        }
        this.viewer.entities.add({
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(positions),
            material: material,
            outline: true,
            outlineColor: outlineColor,
            outlineWidth: CESIUM_DEFAULT.WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
          },
          id: d
        })
      }
      // 航线
      if (ifRefresh) {
        const ids = [
          ...res.flightRoutes.map(item => item.id),
          ...seidsByGroup.flightRoute
        ]
        if (this.vdModule) {
          const haip = this.vdModule.getHistoryAirspaceInPolygonVo(-1);
          if (haip) {
            const _ids = haip.data.flightRoutes.map(item => item.id)
            ids.push(..._ids)
          }
        }
        for (const id of ids) {
          const d = `${ID_PREFIX_FLIGHT_ROUTE}${id}`
          const index = this.renderedItemIds.indexOf(d)
          if (index > -1) {
            this.viewer.entities.removeById(d)
            this.renderedItemIds.splice(index, 1)
          }
        }
      }
      for (const re of res.flightRoutes) {
        const d = `${ID_PREFIX_FLIGHT_ROUTE}${re.id}`
        if (this.renderedItemIds.includes(d)) {
          continue
        }
        this.renderedItemIds.push(d)
        const ps = re.path.split(', ').map(str => str.split(' ')).flat().map(Number);
        this.viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(ps),
            width: 3,
            material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_ROUTE,
            arcType: Cesium.ArcType.NONE
          },
          id: d
        })
      }
    })
  }
}
