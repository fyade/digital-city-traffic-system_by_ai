import * as Cesium from "cesium";
import {
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

  public setLnModule(lnModule: LayerNotificationModule) {
    this.lnModule = lnModule;
  }

  private slModule: SignalLightModule | null = null

  public setSlModule(slModule: SignalLightModule) {
    this.slModule = slModule
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: VersionDataModule) {
    this.vdModule = vdModule;
  }

  private veModule: VehicleModule | null = null

  public setVeModule(veModule: VehicleModule) {
    this.veModule = veModule
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
      get allIds() {
        return [
          ...this.signalLightGroupInfo,
          ...this.signalLightInfo,
          ...this.vehicleRealTime,
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
    }
    return obj
  }

  /**
   * 刷新可视区域内的实体
   * @param ifRefresh
   */
  public refreshScreenEntities(ifRefresh = false) {
    if (this.slModule) {
      this.slModule.drawSignalLightsWhenMapMove(ifRefresh)
    }
  }

  /**
   * 清除地图上的所有实体
   */
  public deleteScreenEntities() {
    if (!this.viewer) {
      return
    }
    const delids: string[] = []
    for (const value of this.viewer.entities.values) {
      if (
          value.id.startsWith(ID_PREFIX_SIGNAL_LIGHT)
          || value.id.startsWith(ID_PREFIX_SIGNAL_LIGHT_GROUP)
      ) {
        delids.push(value.id)
      }
    }
    for (const id of delids) {
      this.viewer.entities.removeById(id)
    }
  }

  // 信号灯是否显示
  private _ifShowSignalLight = true

  public setIfShowSignalLight(value: boolean) {
    this._ifShowSignalLight = value
    dashboardStore.setIfShowSignalLight(this._ifShowSignalLight)
    if (this._ifShowSignalLight) {
      this.refreshScreenEntities()
    } else {
      this.deleteScreenEntities()
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
