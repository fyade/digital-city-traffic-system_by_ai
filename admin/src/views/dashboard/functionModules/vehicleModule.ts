import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { getVehiclesInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { GetVehiclesInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import * as Cesium from "cesium";
import { CESIUM_DEFAULT, ID_PREFIX_VEHICLE_REAL_TIME } from "@/views/dashboard/functionModules/constant.ts";
import busTopImage from '@/assets/images2/公交车-车顶.png'
import { VehicleTrackPointDto } from "@/type/module/dcts/vehicle/vehicleTrackPoint.ts";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { DrawedVehicleTrajectoryClass } from "@/views/dashboard/utils/class.ts";
import { idUtils } from "@dcts/common";

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

  private setDrawedVehicleTrajectoryIdsCB: ((data: DrawedVehicleTrajectoryClass[]) => void) | null = null

  public setSetDrawedVehicleTrajectoryIdsCB(func: (data: DrawedVehicleTrajectoryClass[]) => void) {
    this.setDrawedVehicleTrajectoryIdsCB = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  private datas: GetVehiclesInPolygonVo['data'] = []

  public addTask(results: GetVehiclesInPolygonVo) {
    if (!this.viewer) {
      return
    }
    const _datas = this.datas.map(item => item.vehicleId);
    const _results = results.data.map(item => item.vehicleId);
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    for (const result of results.data) {
      const find = this.datas.find(item => item.vehicleId === result.vehicleId);
      if (find) {
        find.points = result.points.sort((a, b) => Math.abs(new Date(a.createTime).getTime() - now) - Math.abs(new Date(b.createTime).getTime() - now))
      } else {
        this.datas.push(result)
      }
    }
    const needDelIds = _datas.filter(item => !_results.includes(item));
    for (const needDelId of needDelIds) {
      const index = this.datas.findIndex(item => item.vehicleId === needDelId);
      this.datas.splice(index, 1);
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
      const vehicleIds = this.datas.map(item => item.vehicleId);
      const needDelIds: number[] = this.hasDrawedVehicleIds.filter(item => !vehicleIds.includes(item))
      for (const needDelId of needDelIds) {
        this.hasDrawedVehicleIds.splice(this.hasDrawedVehicleIds.indexOf(needDelId), 1)
        this.viewer.entities.removeById(`${ID_PREFIX_VEHICLE_REAL_TIME}${needDelId}`)
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
  private drawedVehicleTrajectoryIds_fushushiti_ids: Map<string, string[]> = new Map()

  get drawedVehicleTrajectoryIds(): DrawedVehicleTrajectoryClass[] {
    return this._drawedVehicleTrajectoryIds;
  }

  set drawedVehicleTrajectoryIds(value: DrawedVehicleTrajectoryClass[]) {
    this._drawedVehicleTrajectoryIds = value;
    if (this.setDrawedVehicleTrajectoryIdsCB) {
      this.setDrawedVehicleTrajectoryIdsCB(this.drawedVehicleTrajectoryIds)
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
    if (!this.viewer) {
      return;
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

    // 绘制起点和终点
    const id1 = idUtils.genId();
    const id2 = idUtils.genId();
    this.viewer.entities.add({
      id: id1,
      position: Cesium.Cartesian3.fromDegrees(cesiumPoints[0].lon, cesiumPoints[0].lat, CESIUM_DEFAULT.HEIGHT_VEHICLE_TRAJECTORY_MARK),
      label: {
        text: '终点',
        font: '14pt sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP
      }
    })
    this.viewer.entities.add({
      id: id2,
      position: Cesium.Cartesian3.fromDegrees(cesiumPoints[cesiumPoints.length - 1].lon, cesiumPoints[cesiumPoints.length - 1].lat, CESIUM_DEFAULT.HEIGHT_VEHICLE_TRAJECTORY_MARK),
      label: {
        text: '起点',
        font: '14pt sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP
      }
    })
    this.drawedVehicleTrajectoryIds_fushushiti_ids.set(cesiumLine.id, [id1, id2])
  }

  public setVehicleTrajectoryOpacity(cesiumLineId: string, opacity: 0 | 1) {
    if (!this.updLine) {
      return;
    }
    if (!this.viewer) {
      return;
    }
    const find = this.drawedVehicleTrajectoryIds.find(item => item.cesiumLineId === cesiumLineId);
    if (!find) {
      return
    }
    find.cesiumLineObj.opacity = opacity
    this.updLine(find.cesiumLineObj)

    // 显示/隐藏起点和终点
    const pppids = this.drawedVehicleTrajectoryIds_fushushiti_ids.get(cesiumLineId);
    if (pppids) {
      for (let pppid of pppids) {
        const entity = this.viewer.entities.getById(pppid);
        if (entity && entity.label && entity.label.fillColor) {
          const fillColor: Cesium.Color = entity.label.fillColor.getValue(Cesium.JulianDate.now());
          entity.label.fillColor = new Cesium.ConstantProperty(fillColor.withAlpha(opacity))
        }
      }
    }
  }

  public closeVehicleTrajectory(cesiumLineId: string) {
    if (!this.delLine) {
      return;
    }
    if (!this.viewer) {
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

    // 清除起点和终点
    const pppids = this.drawedVehicleTrajectoryIds_fushushiti_ids.get(cesiumLineId);
    if (pppids) {
      for (let pppid of pppids) {
        this.viewer.entities.removeById(pppid)
      }
    }
    this.drawedVehicleTrajectoryIds_fushushiti_ids.delete(cesiumLineId);
  }

  public clearVehicleTrajectory() {
    if (!this.delLine) {
      return
    }
    this.delLine(...this.drawedVehicleTrajectoryIds.map(obj => obj.cesiumLineId))
    this.drawedVehicleTrajectoryIds = []
  }
}
