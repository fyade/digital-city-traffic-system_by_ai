import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { getVehiclesInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { GetVehiclesInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import * as Cesium from "cesium";
import { CESIUM_DEFAULT, ID_PREFIX_VEHICLE_REAL_TIME } from "@/views/dashboard/functionModules/constant.ts";
import busTopImage from '@/assets/images2/公交车-车顶.png'
import { VehicleTrackPointDto } from "@/type/module/dcts/vehicle/vehicleTrackPoint.ts";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { DrawedVehicleTrajectoryClass } from "@/views/dashboard/utils/class.ts";

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

  private addLine: ((obj: CesiumLine) => CesiumLine | null) | null = null

  public setAddLine(func: (obj: CesiumLine) => CesiumLine | null) {
    this.addLine = func
  }

  private updLine: ((obj: CesiumLine) => CesiumLine | null) | null = null

  public setUpdLine(func: (obj: CesiumLine) => CesiumLine | null) {
    this.updLine = func
  }

  private delLine: ((...ids: string[]) => void) | null = null

  public setDelLine(func: (...ids: string[]) => void) {
    this.delLine = func
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: () => { lon: number, lat: number }[] | null) {
    this.getViewCornerCoordinates = func
  }

  private setDrawedVehicleTrajectoryIdsCB: (() => void) | null = null

  public setSetDrawedVehicleTrajectoryIdsCB(func: () => void) {
    this.setDrawedVehicleTrajectoryIdsCB = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  private datas: GetVehiclesInPolygonVo['data'] = []

  public addTask(results: GetVehiclesInPolygonVo) {
    if (!this.viewer) {
      return
    }
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    for (const result of results.data) {
      const find = this.datas.find(item => item.vehicleId === result.vehicleId);
      if (find) {
        find.points = result.points.sort((a, b) => Math.abs(new Date(a.createTime).getTime() - now) - Math.abs(new Date(b.createTime).getTime() - now))
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

  private ifFinished = true

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
    if (!this.ifFinished) {
      return;
    }
    this.ifFinished = false
    coordinates.push(coordinates[0])
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    getVehiclesInPolygonApi({
      lastActiveInterval: this.meModule.getLastActiveInterval(),
      points: coordinates,
      timeRange: [
        now - 1000 * 60 * 5,
        now + 1000 * 60 * 1.5,
      ]
    }).finally(() => {
      this.ifFinished = true
    })
  }

  public hasDrawedVehicleIds: number[] = []

  private _drawedVehicleTrajectoryIds: DrawedVehicleTrajectoryClass[] = []

  get drawedVehicleTrajectoryIds(): DrawedVehicleTrajectoryClass[] {
    return this._drawedVehicleTrajectoryIds;
  }

  set drawedVehicleTrajectoryIds(value: DrawedVehicleTrajectoryClass[]) {
    this._drawedVehicleTrajectoryIds = value;
    if (this.setDrawedVehicleTrajectoryIdsCB) {
      this.setDrawedVehicleTrajectoryIdsCB()
    }
  }

  /**
   * 绘制车辆轨迹
   * @param data
   * @param plateNumber
   */
  public drawVehicleTrajectory(data: VehicleTrackPointDto[], plateNumber: string) {
    if (!this.addLine) {
      return
    }
    const cesiumPoints = data
        .map(datum => datum.point
            .replace('POINT(', '')
            .replace(')', '')
            .split(' ')
            .map(Number)
        )
        .map(arr => new CesiumPoint({lon: arr[0], lat: arr[1]}));
    const cesiumLine = new CesiumLine({points: cesiumPoints, color: CESIUM_DEFAULT.COLOR_VEHICLE_TRAJECTORY});
    const obj: DrawedVehicleTrajectoryClass = {
      cesiumLineId: cesiumLine.id,
      cesiumLineObj: cesiumLine,
      plateNumber: plateNumber,
    }
    this.drawedVehicleTrajectoryIds = [...this.drawedVehicleTrajectoryIds, obj]
    this.addLine(cesiumLine)
  }

  public setVehicleTrajectoryOpacity(cesiumLineId: string, opacity: number) {
    if (!this.updLine) {
      return;
    }
    const find = this.drawedVehicleTrajectoryIds.find(item => item.cesiumLineId === cesiumLineId);
    if (!find) {
      return
    }
    find.cesiumLineObj.opacity = opacity
    this.updLine(find.cesiumLineObj)
  }

  public closeVehicleTrajectory(cesiumLineId: string) {
    if (!this.delLine) {
      return;
    }
    const index = this.drawedVehicleTrajectoryIds.findIndex(item => item.cesiumLineId === cesiumLineId);
    if (index === -1) {
      return
    }
    this.delLine(this.drawedVehicleTrajectoryIds[index].cesiumLineId)
    this.drawedVehicleTrajectoryIds = [
      ...this.drawedVehicleTrajectoryIds.slice(0, index),
      ...this.drawedVehicleTrajectoryIds.slice(index + 1, this.drawedVehicleTrajectoryIds.length)
    ]
  }

  public clearVehicleTrajectory() {
    if (!this.delLine) {
      return
    }
    this.delLine(...this.drawedVehicleTrajectoryIds.map(obj => obj.cesiumLineId))
    this.drawedVehicleTrajectoryIds = []
  }
}
