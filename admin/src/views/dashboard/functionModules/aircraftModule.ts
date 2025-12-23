import { useDashboardStore } from "@/store/module/dashboard.ts";
import { objectUtils } from "@dcts/common";
import { CronJob } from "cron";
import * as Cesium from "cesium";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { getAircraftsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { GetAircraftsInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import aircraftImage from "@/assets/images2/航空器.png";
import { ID_PREFIX_AIRCRAFT_REAL_TIME } from "@/views/dashboard/functionModules/constant.ts";
import { identityIfAdmin } from "@/identity/utils/identityUtils.ts";

const dashboardStore = useDashboardStore();

/**
 * 航空器模块
 */
export class AircraftModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: NonNullable<typeof this.meModule>) {
    this.meModule = meModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: NonNullable<typeof this.viewer>) {
    this.viewer = viewer;
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: NonNullable<typeof this.getViewCornerCoordinates>) {
    this.getViewCornerCoordinates = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  private datas: GetAircraftsInPolygonVo['data'] = []

  public addTask(results: GetAircraftsInPolygonVo) {
    if (!this.viewer) {
      return
    }
    if (!this.getIfShowAircraftRealTime()) {
      return;
    }
    const _datas = this.datas.map(item => item.aircraftId)
    const _results = results.data.map(item => item.aircraftId)
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    for (const result of results.data) {
      const find = this.datas.find(item => item.aircraftId === result.aircraftId)
      if (find) {
        find.points = result.points.sort((a, b) => Math.abs(new Date(a.createTime).getTime() - now) - Math.abs(new Date(b.createTime).getTime() - now))
      } else {
        this.datas.push(result)
      }
    }
    const needDelIds = _datas.filter(item => !_results.includes(item))
    for (const needDelId of needDelIds) {
      const index = this.datas.findIndex(item => item.aircraftId === needDelId)
      this.datas.splice(index, 1)
    }
  }

  private lastTickTime: number | null = null
  private _tick_deviation_time = 50

  public tick() {
    if (!this.viewer) {
      return
    }
    if (!this.getIfShowAircraftRealTime()) {
      return;
    }
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    if (!this.lastTickTime || (now % 500 <= this._tick_deviation_time && Math.abs(now - this.lastTickTime) >= (500 - this._tick_deviation_time))) {
      this.lastTickTime = now
      const aircraftIds: number[] = []
      for (const datum of this.datas) {
        const firstPoint1 = datum.points[0]
        if (Math.abs(new Date(firstPoint1.createTime).getTime() - now) >= 5000) {
          continue
        }
        aircraftIds.push(datum.aircraftId)
        const point = firstPoint1.point.replace('POINT(', '').replace(')', '').split(' ').map(Number)
        if (!this.hasDrawedAircraftIds.includes(datum.aircraftId)) {
          this.hasDrawedAircraftIds.push(datum.aircraftId)
          this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point[0], point[1], firstPoint1.height),
            billboard: {
              image: aircraftImage,
              width: 40,
              height: 40,
              rotation: Cesium.Math.toRadians(firstPoint1.heading),
              alignedAxis: Cesium.Cartesian3.UNIT_Z
            },
            id: `${ID_PREFIX_AIRCRAFT_REAL_TIME}${datum.aircraftId}`
          })
        } else {
          const entity = this.viewer.entities.getById(`${ID_PREFIX_AIRCRAFT_REAL_TIME}${datum.aircraftId}`)
          if (entity && entity.billboard) {
            entity.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(point[0], point[1], firstPoint1.height))
            entity.billboard.rotation = new Cesium.ConstantProperty(Cesium.Math.toRadians(firstPoint1.heading))
          }
        }
      }
      const needDelIds: number[] = this.hasDrawedAircraftIds.filter(item => !aircraftIds.includes(item))
      for (const needDelId of needDelIds) {
        this.hasDrawedAircraftIds.splice(this.hasDrawedAircraftIds.indexOf(needDelId), 1)
        this.viewer.entities.removeById(`${ID_PREFIX_AIRCRAFT_REAL_TIME}${needDelId}`)
      }
    }
  }

  public init() {
    this.cronJob = new CronJob(
        '* * * * * *',
        this.refreshAircraftRealTime.bind(this),
        null
    )
    const v = dashboardStore.getIfShowAircraftRealTime()
    if (objectUtils.ifValid(v)) {
      this._ifShowAircraftRealTime = v
      if (this._ifShowAircraftRealTime && this.cronJob) {
        this.cronJob.start()
      }
    }
    const v2 = dashboardStore.getLastActiveInterval2()
    if (objectUtils.ifValid(v2)) {
      this._lastActiveInterval2 = v2
    }
  }

  private cronJob: CronJob | null = null

  private ifFinished = true

  private refreshAircraftRealTime() {
    if (!identityIfAdmin()) {
      return
    }
    if (!this.viewer) {
      return;
    }
    if (!this.getViewCornerCoordinates) {
      return;
    }
    if (!this.meModule) {
      return;
    }
    const coordinates = this.getViewCornerCoordinates();
    if (!coordinates) {
      return
    }
    if (!this.ifFinished) {
      return;
    }
    this.ifFinished = false
    coordinates.push(coordinates[0])
    const now = Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime();
    getAircraftsInPolygonApi({
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

  public hasDrawedAircraftIds: number[] = []

  // 是否实时显示航空器
  private _ifShowAircraftRealTime = false

  public setIfShowAircraftRealTime(val: boolean) {
    this._ifShowAircraftRealTime = val
    dashboardStore.setIfShowAircraftRealTime(this._ifShowAircraftRealTime)
    if (this._ifShowAircraftRealTime) {
      if (this.cronJob) this.cronJob.start()
    } else {
      if (this.cronJob) this.cronJob.stop()
    }
  }

  public getIfShowAircraftRealTime() {
    return this._ifShowAircraftRealTime
  }

  // 最近活动时间
  private _lastActiveInterval2 = 10

  public setLastActiveInterval2(value: number) {
    this._lastActiveInterval2 = value
    dashboardStore.setLastActiveInterval2(this._lastActiveInterval2)
  }

  public getLastActiveInterval2() {
    return this._lastActiveInterval2
  }
}
