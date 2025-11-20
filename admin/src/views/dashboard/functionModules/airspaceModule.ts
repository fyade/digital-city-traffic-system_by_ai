import { routerPushByName } from "@/utils/RouterUtils.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { getAirspaceInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import * as Cesium from "cesium";
import {
  CESIUM_DEFAULT,
  EDIT_TYPE_ENUM,
  ID_PREFIX_FLIGHT_AIRSPACE_USER_APPLY,
  ID_PREFIX_FLIGHT_RESTRICTION_ZONE,
  ID_PREFIX_FLIGHT_ROUTE,
  ID_PREFIX_FLIGHT_ROUTE_USER_APPLY,
  ID_SPECIAL_preview_MouseMovingGeometry,
  ID_SPECIAL_preview_MouseMovingPolyline
} from "@/views/dashboard/functionModules/constant.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { base, objectUtils, timeUtils } from "@dcts/common";
import { computePolygonCenter } from "@/views/dashboard/utils/funcsOfCesium.ts";
import { flightRouteUserApplyDict } from "@/dict/module/dcts/airspace/flightRouteUserApply.ts";
import { flightRestrictionZoneUserApplyDict } from "@/dict/module/dcts/airspace/flightRestrictionZoneUserApply.ts";

const dashboardStore = useDashboardStore();

/**
 * 空域模块
 */
export class AirspaceModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: NonNullable<typeof this.meModule>) {
    this.meModule = meModule;
  }

  private miModule: MapInteractionModule | null = null

  public setMiModule(miModule: NonNullable<typeof this.miModule>) {
    this.miModule = miModule;
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: NonNullable<typeof this.vdModule>) {
    this.vdModule = vdModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: NonNullable<typeof this.viewer>) {
    this.viewer = viewer;
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: NonNullable<typeof this.getViewCornerCoordinates>) {
    this.getViewCornerCoordinates = func
  }

  private setViewTo: ((lon: number, lat: number, obj?: { height?: number, ifFly?: boolean }) => void) | null = null

  public setSetViewTo(func: NonNullable<typeof this.setViewTo>) {
    this.setViewTo = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  public init() {
    const v = dashboardStore.getIfShowAirspace();
    if (objectUtils.ifValid(v)) {
      this._ifShowAirspace = v
    }
    const ddddd1 = dashboardStore.getShowAroundDate1()
    if (objectUtils.ifValid(ddddd1)) {
      this._showAroundDate1 = ddddd1
    }
    const ddddd2 = dashboardStore.getShowAroundDate2()
    if (objectUtils.ifValid(ddddd2)) {
      this._showAroundDate2 = ddddd2
    }
  }

  // 新增限飞区及航线时的临时点
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
    }
    if (editType === EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE) {
      let id = ''
      const hseids = this.vdModule.getHistorySelectedEntityIds(0);
      if (hseids) {
        id = hseids.data[0].replace(ID_PREFIX_FLIGHT_RESTRICTION_ZONE, '')
      }
      routerPushByName('~fp~:airspace:flightRestrictionZone:upd', {id: id, geometry: pointStr})
    }
    if (editType === EDIT_TYPE_ENUM.INS_FLIGHT_ROUTE) {
      routerPushByName('~fp~:airspace:flightRoute:ins', {path: pointStr2})
    }
    if (editType === EDIT_TYPE_ENUM.UPD_FLIGHT_ROUTE) {
      let id = ''
      const hseids = this.vdModule.getHistorySelectedEntityIds(0);
      if (hseids) {
        id = hseids.data[0].replace(ID_PREFIX_FLIGHT_ROUTE, '')
      }
      routerPushByName('~fp~:airspace:flightRoute:upd', {id: id, path: pointStr2})
    }
    if (editType === EDIT_TYPE_ENUM.INS_APPLY_AIRSPACE) {
      routerPushByName('~fp~:applyAirspace', {geometry: pointStr})
    }
    if (editType === EDIT_TYPE_ENUM.INS_APPLY_FLIGHT_ROUTE) {
      routerPushByName('~fp~:applyFlightRoute', {path: pointStr2})
    }
  }

  // 限飞区预览（新增/修改时的预览）
  public previewFlightRestrictionZone(points: [number, number][], ifDelete = false) {
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_preview_MouseMovingGeometry)
    if (ifDelete) {
      if (entity) {
        this.viewer.entities.removeById(ID_SPECIAL_preview_MouseMovingGeometry)
      }
    } else {
      const positions = points.map(poArr => Cesium.Cartesian3.fromDegrees(poArr[0], poArr[1], CESIUM_DEFAULT.HEIGHT_FLIGHT_RESTRICTION_ZONE))
      if (entity) {
        if (entity.polygon) {
          entity.polygon.hierarchy = new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(positions))
        }
      } else {
        this.viewer.entities.add({
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(positions),
            material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_RESTRICTION_ZONE,
            outline: true,
            outlineColor: CESIUM_DEFAULT.COLOR_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
            outlineWidth: CESIUM_DEFAULT.WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
          },
          id: ID_SPECIAL_preview_MouseMovingGeometry
        })
      }
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

  // 限飞区预览（管理员审核用户的申请 时的预览）及空域申请详情
  public previewFlightRestrictionZone2({
                                         points = [],
                                         label = '',
                                         ifDelete = false
                                       }: {
                                         points?: [number, number][]
                                         label?: string
                                         ifDelete?: boolean
                                       }
  ) {
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_preview_MouseMovingGeometry)
    if (ifDelete) {
      this.viewer.entities.removeById(ID_SPECIAL_preview_MouseMovingGeometry)
      return;
    }
    const positions = points.map(poArr => Cesium.Cartesian3.fromDegrees(poArr[0], poArr[1], CESIUM_DEFAULT.HEIGHT_FLIGHT_RESTRICTION_ZONE))
    const positionCenter = computePolygonCenter(positions);
    const lonlat_ = Cesium.Cartographic.fromCartesian(positionCenter);
    const lonlat = {
      lon: Cesium.Math.toDegrees(lonlat_.longitude),
      lat: Cesium.Math.toDegrees(lonlat_.latitude),
    }
    if (this.setViewTo) {
      this.setViewTo(lonlat.lon, lonlat.lat, {height: 5000, ifFly: true})
    }
    if (entity) {
      entity.polygon!.hierarchy = new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(positions))
      entity.position = new Cesium.ConstantPositionProperty(positionCenter)
      entity.label!.text = new Cesium.ConstantProperty(label)
      return;
    }
    this.viewer.entities.add({
      position: positionCenter,
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(positions),
        material: new Cesium.StripeMaterialProperty({
          orientation: Cesium.StripeOrientation.VERTICAL,
          evenColor: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_RESTRICTION_ZONE.withAlpha(0.7),
          oddColor: Cesium.Color.TRANSPARENT,
          repeat: 100,
          offset: 0.0
        }),
        outline: true,
        outlineColor: CESIUM_DEFAULT.COLOR_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
        outlineWidth: CESIUM_DEFAULT.WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
      },
      // label: {
      //   text: label,
      //   fillColor: Cesium.Color.WHITE,
      //   backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
      //   backgroundPadding: new Cesium.Cartesian2(10, 10),
      //   pixelOffset: new Cesium.Cartesian2(0, 0),
      //   eyeOffset: new Cesium.Cartesian3(0, 0, 0),
      //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
      //   showBackground: true,
      //   scale: 0.5,
      //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //   outlineWidth: 2,
      //   outlineColor: Cesium.Color.BLACK
      // },
      id: ID_SPECIAL_preview_MouseMovingGeometry
    })
  }

  // 航线预览（管理员审核用户的申请 时的预览）及航线申请详情
  public previewFlightRoute2({
                               points = [],
                               label = '',
                               ifDelete = false
                             }: {
                               points?: [number, number, number][]
                               label?: string
                               ifDelete?: boolean
                             }
  ) {
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_preview_MouseMovingPolyline)
    if (ifDelete) {
      this.viewer.entities.removeById(ID_SPECIAL_preview_MouseMovingPolyline)
      return;
    }
    const positions = points.map(poArr => Cesium.Cartesian3.fromDegrees(poArr[0], poArr[1], poArr[2]))
    const positionCenter = computePolygonCenter(positions)
    const lonlat_ = Cesium.Cartographic.fromCartesian(positionCenter)
    const lonlat = {
      lon: Cesium.Math.toDegrees(lonlat_.longitude),
      lat: Cesium.Math.toDegrees(lonlat_.latitude),
    }
    if (this.setViewTo) {
      this.setViewTo(lonlat.lon, lonlat.lat, {height: 5000, ifFly: true})
    }
    const coordinates = points.flat().length >= 3 ? points.flat() : [0, 0, 0];
    if (entity) {
      entity.polyline!.positions = new Cesium.ConstantProperty(Cesium.Cartesian3.fromDegreesArrayHeights(coordinates))
      entity.position = new Cesium.ConstantPositionProperty(positionCenter)
      entity.label!.text = new Cesium.ConstantProperty(label)
      return;
    }
    this.viewer.entities.add({
      position: positionCenter,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(coordinates),
        width: 3,
        material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_ROUTE,
        arcType: Cesium.ArcType.NONE
      },
      // label: {
      //   text: label,
      //   fillColor: Cesium.Color.WHITE,
      //   backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
      //   backgroundPadding: new Cesium.Cartesian2(10, 10),
      //   pixelOffset: new Cesium.Cartesian2(0, 0),
      //   eyeOffset: new Cesium.Cartesian3(0, 0, 0),
      //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      //   verticalOrigin: Cesium.VerticalOrigin.CENTER,
      //   showBackground: true,
      //   scale: 0.5,
      //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //   outlineWidth: 2,
      //   outlineColor: Cesium.Color.BLACK
      // },
      id: ID_SPECIAL_preview_MouseMovingPolyline
    });
  }

  // 已渲染的空域
  private renderedItemIds: string[] = []

  public refreshScreenAirspace({
                                 ifRefresh = false,
                               }: {
                                 ifRefresh?: boolean
                               } = {}
  ) {
    if (!this.getIfShowAirspace()) {
      return;
    }
    if (!this.getViewCornerCoordinates) {
      return
    }
    const coordinates = this.getViewCornerCoordinates();
    if (!coordinates) {
      return;
    }
    coordinates.push(coordinates[0])
    getAirspaceInPolygonApi({
      points: coordinates,
      d1: this.getShowAroundDate1(),
      d2: this.getShowAroundDate2(),
    }).then(res => {
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
          position: computePolygonCenter(positions),
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(positions),
            material: material,
            outline: true,
            outlineColor: outlineColor,
            outlineWidth: CESIUM_DEFAULT.WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
          },
          label: {
            text: re.name,
            font: '14px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, 0),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
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
          position: Cesium.Cartesian3.fromDegrees(ps[0], ps[1], ps[2]),
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(ps),
            width: 3,
            material: Cesium.Color.fromCssColorString(re.color),
            arcType: Cesium.ArcType.NONE
          },
          label: {
            text: re.name,
            font: '14px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, 0),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
          id: d
        })
      }
      // 申请的限飞区
      if (ifRefresh) {
        const ids = [
          ...res.selfFlightRestrictionZones.map(item => item.id),
          ...seidsByGroup.flightAirspaceUserApply
        ]
        if (this.vdModule) {
          const haip = this.vdModule.getHistoryAirspaceInPolygonVo(-1);
          if (haip) {
            const _ids = haip.data.selfFlightRestrictionZones.map(item => item.id)
            ids.push(..._ids)
          }
        }
        for (const id of ids) {
          const d = `${ID_PREFIX_FLIGHT_AIRSPACE_USER_APPLY}${id}`
          const index = this.renderedItemIds.indexOf(d)
          if (index > -1) {
            this.viewer.entities.removeById(d)
            this.renderedItemIds.splice(index, 1)
          }
        }
      }
      for (const re of res.selfFlightRestrictionZones) {
        const d = `${ID_PREFIX_FLIGHT_AIRSPACE_USER_APPLY}${re.id}`;
        if (this.renderedItemIds.includes(d)) {
          continue
        }
        this.renderedItemIds.push(d)
        const strings = re.geometry.split(', ')
        const positions = strings.slice(0, strings.length - 1)
            .map(str => str.split(' '))
            .map(poArr => poArr.map(Number))
            .map(poArr => Cesium.Cartesian3.fromDegrees(poArr[0], poArr[1], CESIUM_DEFAULT.HEIGHT_FLIGHT_RESTRICTION_ZONE))
        const text = `我申请的空域` + `\n${flightRestrictionZoneUserApplyDict.taskName}：${re.taskName}` + `\n${flightRestrictionZoneUserApplyDict.startTime}：${timeUtils.formatDate(new Date(re.startTime))}` + `\n${flightRestrictionZoneUserApplyDict.endTime}：${timeUtils.formatDate(new Date(re.endTime))}` + `\n${flightRestrictionZoneUserApplyDict.applyStatus}：${base.aFRASTypeDict[re.applyStatus as base.AFRASTypeEnum]}`;
        this.viewer.entities.add({
          position: computePolygonCenter(positions),
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(positions),
            material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_RESTRICTION_ZONE,
            outline: true,
            outlineColor: CESIUM_DEFAULT.COLOR_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
            outlineWidth: CESIUM_DEFAULT.WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE
          },
          // label: {
          //   text: text,
          //   font: '14px sans-serif',
          //   fillColor: Cesium.Color.WHITE,
          //   outlineColor: Cesium.Color.BLACK,
          //   outlineWidth: 1,
          //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          //   pixelOffset: new Cesium.Cartesian2(0, 0),
          //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          // },
          id: d
        })
      }
      // 申请的航线
      if (ifRefresh) {
        const ids = [
          ...res.selfFlightRoutes.map(item => item.id),
          ...seidsByGroup.flightRouteUserApply
        ]
        if (this.vdModule) {
          const haip = this.vdModule.getHistoryAirspaceInPolygonVo(-1)
          if (haip) {
            const _ids = haip.data.selfFlightRoutes.map(item => item.id)
            ids.push(..._ids)
          }
        }
        for (const id of ids) {
          const d = `${ID_PREFIX_FLIGHT_ROUTE_USER_APPLY}${id}`
          const index = this.renderedItemIds.indexOf(d)
          if (index > -1) {
            this.viewer.entities.removeById(d)
            this.renderedItemIds.splice(index, 1)
          }
        }
      }
      for (const re of res.selfFlightRoutes) {
        const d = `${ID_PREFIX_FLIGHT_ROUTE_USER_APPLY}${re.id}`
        if (this.renderedItemIds.includes(d)) {
          continue
        }
        this.renderedItemIds.push(d)
        const ps = re.path.split(', ').map(str => str.split(' ')).flat().map(Number)
        const text = `我申请的航线` + `\n${flightRouteUserApplyDict.taskName}：${re.taskName}` + `\n${flightRouteUserApplyDict.startTime}：${timeUtils.formatDate(new Date(re.startTime))}` + `\n${flightRouteUserApplyDict.endTime}：${timeUtils.formatDate(new Date(re.endTime))}` + `\n${flightRouteUserApplyDict.applyStatus}：${base.aFRASTypeDict[re.applyStatus as base.AFRASTypeEnum]}`;
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(ps[0], ps[1], ps[2]),
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(ps),
            width: 3,
            material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_ROUTE,
            arcType: Cesium.ArcType.NONE
          },
          // label: {
          //   text: text,
          //   font: '14px sans-serif',
          //   fillColor: Cesium.Color.WHITE,
          //   outlineColor: Cesium.Color.BLACK,
          //   outlineWidth: 1,
          //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          //   pixelOffset: new Cesium.Cartesian2(0, 0),
          //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          // },
          id: d
        })
      }
    })
  }

  // 空域显示
  private _ifShowAirspace = false

  public setIfShowAirspace(value: boolean) {
    this._ifShowAirspace = value
    dashboardStore.setIfShowAirspace(this._ifShowAirspace)
    if (this._ifShowAirspace) {
      this.refreshScreenAirspace()
    } else {
      if (!this.viewer) {
        return
      }
      for (const id of this.renderedItemIds) {
        this.viewer.entities.removeById(id)
      }
      this.renderedItemIds.splice(0, this.renderedItemIds.length)
    }
  }

  public getIfShowAirspace() {
    return this._ifShowAirspace
  }

  // 显示前后几天申请的空域/航线
  private _showAroundDate1 = 3
  private _showAroundDate2 = 3

  public setShowAroundDate1(value: number) {
    this._showAroundDate1 = value
    dashboardStore.setShowAroundDate1(this._showAroundDate1)
    this.refreshScreenAirspace({ifRefresh: true})
  }

  public getShowAroundDate1() {
    return this._showAroundDate1
  }

  public setShowAroundDate2(value: number) {
    this._showAroundDate2 = value
    dashboardStore.setShowAroundDate2(this._showAroundDate2)
    this.refreshScreenAirspace({ifRefresh: true})
  }

  public getShowAroundDate2() {
    return this._showAroundDate2
  }
}
