import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { getVehiclesInPolygon } from "@/api/module/dcts/spatialData.ts";
import { GetVehiclesInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import * as Cesium from "cesium";
import { CESIUM_DEFAULT, ID_PREFIX_VEHICLE_REAL_TIME } from "@/views/dashboard/functionModules/constant.ts";
import busTopImage from '@/assets/images2/公交车-车顶.png'

/**
 * 车辆模块
 */
export class VehicleModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: () => { lon: number, lat: number }[] | null) {
    this.getViewCornerCoordinates = func
  }


  private datas: GetVehiclesInPolygonVo[] = []

  public addTask(results: GetVehiclesInPolygonVo[]) {
    if (!this.viewer) {
      return
    }
    for (const result of results) {
      const find = this.datas.find(item => item.vehicleId === result.vehicleId);
      if (find) {
        find.points.push(...result.points)
      } else {
        this.datas.push(result)
      }
    }
  }

  private lastTickTime: number | null = null
  private _tick_deviation_time = 50

  public tick() {
    if (!this.viewer) {
      return
    }
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    if (!this.lastTickTime || (now % 500 <= this._tick_deviation_time && Math.abs(now - this.lastTickTime) >= (500 - this._tick_deviation_time))) {
      this.lastTickTime = now
      for (const datum of this.datas) {
        datum.points.sort((a, b) => Math.abs(new Date(a.createTime).getTime() - now) - Math.abs(new Date(b.createTime).getTime() - now))
        const point = datum.points[0].point.replace('POINT(', '').replace(')', '').split(' ').map(Number);
        if (!this.hasDrawedVehicleIds.includes(datum.vehicleId)) {
          this.hasDrawedVehicleIds.push(datum.vehicleId)
          this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point[0], point[1], CESIUM_DEFAULT.HEIGHT_VEHICLE),
            billboard: {
              image: busTopImage,
              width: 40,
              height: 40,
              rotation: Cesium.Math.toRadians(datum.points[0].heading),
              alignedAxis: Cesium.Cartesian3.UNIT_Z
            },
            id: `${ID_PREFIX_VEHICLE_REAL_TIME}${datum.vehicleId}`
          })
        } else {
          const entity = this.viewer.entities.getById(`${ID_PREFIX_VEHICLE_REAL_TIME}${datum.vehicleId}`);
          if (entity && entity.billboard) {
            entity.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(point[0], point[1], CESIUM_DEFAULT.HEIGHT_VEHICLE))
            entity.billboard.rotation = new Cesium.ConstantProperty(Cesium.Math.toRadians(datum.points[0].heading))
          }
        }
      }
    }
  }

  public refreshVehicleRealTime() {
    if (!this.viewer) {
      return;
    }
    if (!this.meModule) {
      return;
    }
    if (!this.meModule.getIfShowVehicleRealTime()) {
      return;
    }
    if (!this.getViewCornerCoordinates) {
      return
    }
    const coordinates = this.getViewCornerCoordinates();
    if (!coordinates || coordinates.length < 3) {
      return
    }
    coordinates.push(coordinates[0])
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    getVehiclesInPolygon({
      lastActiveInterval: this.meModule.getLastActiveInterval(),
      points: coordinates,
      timeRange: [
        now - 1000 * 60 * 5,
        now + 1000 * 60 * 1.5,
      ]
    })
  }

  public hasDrawedVehicleIds: number[] = []
}
