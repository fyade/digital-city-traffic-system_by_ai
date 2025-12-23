import * as Cesium from "cesium";
import {
  ID_PREFIX_AIRCRAFT_REAL_TIME,
  ID_PREFIX_FLIGHT_AIRSPACE_USER_APPLY,
  ID_PREFIX_FLIGHT_RESTRICTION_ZONE, ID_PREFIX_FLIGHT_ROUTE, ID_PREFIX_FLIGHT_ROUTE_USER_APPLY,
  ID_PREFIX_SIGNAL_LIGHT,
  ID_PREFIX_SIGNAL_LIGHT_GROUP,
  ID_PREFIX_VEHICLE_REAL_TIME
} from "@/views/dashboard/functionModules/constant.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";
import { objectUtils } from "@dcts/common";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { CronJob } from "cron";
import { SignalLightModule } from "@/views/dashboard/functionModules/signalLightModule.ts";
import { VehicleModule } from "@/views/dashboard/functionModules/vehicleModule.ts";

const dashboardStore = useDashboardStore();

/**
 * 地图实体模块
 */
export class MapEntityModule {
  private lnModule: LayerNotificationModule | null = null

  public setLnModule(lnModule: NonNullable<typeof this.lnModule>) {
    this.lnModule = lnModule;
  }

  private slModule: SignalLightModule | null = null

  public setSlModule(slModule: NonNullable<typeof this.slModule>) {
    this.slModule = slModule
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: NonNullable<typeof this.vdModule>) {
    this.vdModule = vdModule;
  }

  private veModule: VehicleModule | null = null

  public setVeModule(veModule: NonNullable<typeof this.veModule>) {
    this.veModule = veModule
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: NonNullable<typeof this.viewer>) {
    this.viewer = viewer;
  }

  private refreshContextMenuOption: (() => void) | null = null

  public setRefreshContextMenuOption(func: NonNullable<typeof this.refreshContextMenuOption>) {
    this.refreshContextMenuOption = func
  }

  private getViewCornerCoordinates: (() => { lon: number, lat: number }[] | null) | null = null

  public setGetViewCornerCoordinates(func: NonNullable<typeof this.getViewCornerCoordinates>) {
    this.getViewCornerCoordinates = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  private cronJob: CronJob | null = null

  public init() {
    if (this.veModule) {
      this.cronJob = new CronJob(
          '* * * * * *',
          this.veModule.refreshVehicleRealTime.bind(this.veModule),
          null
      );
    }
    const b1 = dashboardStore.getIfShowSignalLight();
    if (objectUtils.ifValid(b1)) {
      this._ifShowSignalLight = b1
    }
    const b2 = dashboardStore.getIfShowVehicleRealTime()
    if (objectUtils.ifValid(b2)) {
      this._ifShowVehicleRealTime = b2
      if (this._ifShowVehicleRealTime && this.cronJob) {
        this.cronJob.start()
      }
    }
    const b3 = dashboardStore.getLastActiveInterval()
    if (objectUtils.ifValid(b3)) {
      this._lastActiveInterval = b3
    }
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
      vehicleRealTime: [] as string[],
      get vehicleRealTimeCount() {
        return this.vehicleRealTime.length
      },
      aircraftRealTime: [] as string[],
      get aircraftRealTimeCount() {
        return this.aircraftRealTime.length
      },
      flightRestrictionZone: [] as string[],
      get flightRestrictionZoneCount() {
        return this.flightRestrictionZone.length
      },
      flightRoute: [] as string[],
      get flightRouteCount() {
        return this.flightRoute.length
      },
      flightAirspaceUserApply: [] as string[],
      get flightAirspaceUserApplyCount() {
        return this.flightAirspaceUserApply.length
      },
      flightRouteUserApply: [] as string[],
      get flightRouteUserApplyCount() {
        return this.flightRouteUserApply.length
      },
      get allIds() {
        return [
          ...this.signalLightGroupInfo,
          ...this.signalLightInfo,
          ...this.vehicleRealTime,
          ...this.aircraftRealTime,
          ...this.flightRestrictionZone,
          ...this.flightRoute,
          ...this.flightAirspaceUserApply,
          ...this.flightRouteUserApply,
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
      if (selectedEntityId.startsWith(ID_PREFIX_VEHICLE_REAL_TIME)) {
        obj.vehicleRealTime.push(selectedEntityId.replace(ID_PREFIX_VEHICLE_REAL_TIME, ''))
      }
      if (selectedEntityId.startsWith(ID_PREFIX_AIRCRAFT_REAL_TIME)) {
        obj.aircraftRealTime.push(selectedEntityId.replace(ID_PREFIX_AIRCRAFT_REAL_TIME, ''))
      }
      if (selectedEntityId.startsWith(ID_PREFIX_FLIGHT_RESTRICTION_ZONE)) {
        obj.flightRestrictionZone.push(selectedEntityId.replace(ID_PREFIX_FLIGHT_RESTRICTION_ZONE, ''))
      }
      if (selectedEntityId.startsWith(ID_PREFIX_FLIGHT_ROUTE)) {
        obj.flightRoute.push(selectedEntityId.replace(ID_PREFIX_FLIGHT_ROUTE, ''))
      }
      if (selectedEntityId.startsWith(ID_PREFIX_FLIGHT_AIRSPACE_USER_APPLY)) {
        obj.flightAirspaceUserApply.push(selectedEntityId.replace(ID_PREFIX_FLIGHT_AIRSPACE_USER_APPLY, ''))
      }
      if (selectedEntityId.startsWith(ID_PREFIX_FLIGHT_ROUTE_USER_APPLY)) {
        obj.flightRouteUserApply.push(selectedEntityId.replace(ID_PREFIX_FLIGHT_ROUTE_USER_APPLY, ''))
      }
    }
    return obj
  }

  // 信号灯是否显示
  private _ifShowSignalLight = false

  public setIfShowSignalLight(value: boolean) {
    this._ifShowSignalLight = value
    dashboardStore.setIfShowSignalLight(this._ifShowSignalLight)
    if (this._ifShowSignalLight) {
      if (this.slModule) {
        this.slModule.drawSignalLightsWhenMapMove()
      }
    } else {
      if (this.slModule) {
        this.slModule.clearSignalLights()
      }
    }
  }

  public getIfShowSignalLight() {
    return this._ifShowSignalLight
  }

  // 车辆信息实时显示
  private _ifShowVehicleRealTime = false

  public setIfShowVehicleRealTime(value: boolean) {
    this._ifShowVehicleRealTime = value
    dashboardStore.setIfShowVehicleRealTime(this._ifShowVehicleRealTime)
    if (this._ifShowVehicleRealTime) {
      if (this.cronJob) this.cronJob.start()
    } else {
      if (this.cronJob) this.cronJob.stop()
      if (!this.viewer) {
        return
      }
      if (!this.veModule) {
        return;
      }
      for (const id of this.veModule.hasDrawedVehicleIds) {
        this.viewer.entities.removeById(`${ID_PREFIX_VEHICLE_REAL_TIME}${id}`)
      }
      this.veModule.hasDrawedVehicleIds.splice(0, this.veModule.hasDrawedVehicleIds.length)
    }
  }

  public getIfShowVehicleRealTime() {
    return this._ifShowVehicleRealTime
  }

  // 最近活动时间
  private _lastActiveInterval = 10

  public setLastActiveInterval(value: number) {
    this._lastActiveInterval = value
    dashboardStore.setLastActiveInterval(this._lastActiveInterval)
  }

  public getLastActiveInterval() {
    return this._lastActiveInterval
  }
}
