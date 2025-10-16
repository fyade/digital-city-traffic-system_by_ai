import { UseCesium } from "@/views/dashboard/core/useCesium.ts";
import { WsClient } from "@/services/wsClient.ts";
import { ClockModule } from "@/views/dashboard/functionModules/clockModule.ts";
import { ContextMenuModule } from "@/views/dashboard/functionModules/contextMenuModule.ts";
import { DebugModule } from "@/views/dashboard/functionModules/debugModule.ts";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { PermissionModule } from "@/views/dashboard/functionModules/permissionModule.ts";
import { SignalLightModule } from "@/views/dashboard/functionModules/signalLightModule.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { VehicleModule } from "@/views/dashboard/functionModules/vehicleModule.ts";
import { watch } from "vue";
import * as Cesium from "cesium";
import { useSysStore } from "@/store/module/sys.ts";
import { adminConfig } from "@dcts/config";
import { CalculateLightsInPolygonVo, GetVehiclesInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import { final } from "@/utils/base.ts";
import {
  ContextMenuOptionType,
  EDIT_TYPE_ENUM,
  ID_PREFIX_VEHICLE_REAL_TIME
} from "@/views/dashboard/functionModules/constant.ts";
import { DrawedVehicleTrajectoryClass } from "@/views/dashboard/utils/class.ts";
import { AircraftModule } from "@/views/dashboard/functionModules/aircraftModule.ts";
import { AirspaceModule } from "@/views/dashboard/functionModules/airspaceModule.ts";

const currentConfig = adminConfig.currentConfig()

const sysStore = useSysStore()

const visibleButtons = sysStore.getVisibleButtons();

/**
 * 大屏页面的 Cesium 类
 */
class UseDashboardCesium extends UseCesium {
  constructor(
      private readonly wsClient: WsClient,
      private readonly acModule: AircraftModule,
      private readonly asModule: AirspaceModule,
      private readonly cModule: ClockModule,
      private readonly cmModule: ContextMenuModule,
      private readonly debugModule: DebugModule,
      private readonly lnModule: LayerNotificationModule,
      private readonly meModule: MapEntityModule,
      private readonly miModule: MapInteractionModule,
      private readonly pModule: PermissionModule,
      private readonly slModule: SignalLightModule,
      private readonly vdModule: VersionDataModule,
      private readonly veModule: VehicleModule,
  ) {
    super();
  }

  public init2() {
    this.wsClient.init({ifInit: true, pageContext: 'dashboard'})
    this.wsClient.addEventListener('dcts:spatialData:calculateLightsInPolygon', data => {
      const result = JSON.parse(data.msg) as CalculateLightsInPolygonVo[];
      this.slModule.addTask(result)
      this.lnModule.closeSignalLightLoading()
    })
    this.wsClient.addEventListener('dcts:spatialData:refreshLightWhenDatabaseChange', () => {
      this.refreshScreenEntities({module: ['slModule']})
    })
    this.wsClient.addEventListener('dcts:spatialData:getVehiclesInPolygon', data => {
      const result = JSON.parse(data.msg) as GetVehiclesInPolygonVo;
      this.veModule.addTask(result)
    })
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // ===== Module =====
  private setTrackedEntityIdCB: ((data: string | null) => void) | null = null

  public setSetTrackedEntityIdCB(func: (data: string | null) => void) {
    this.setTrackedEntityIdCB = func
  }

  // ===== cModule =====
  private setCurrentTimeCB: ((data: number) => void) | null = null

  public setSetCurrentTimeCB(func: (data: number) => void) {
    this.setCurrentTimeCB = func
  }

  // ===== cmModule =====
  private setContextMenuShowCB: ((data: boolean) => void) | null = null

  public setSetContextMenuShowCB(func: (data: boolean) => void) {
    this.setContextMenuShowCB = func
  }

  private setContextMenuXYCB: ((data: [number, number]) => void) | null = null

  public setSetContextMenuXYCB(func: (data: [number, number]) => void) {
    this.setContextMenuXYCB = func
  }

  private setContextMenuOptionCB: ((data: ContextMenuOptionType) => void) | null = null

  public setSetContextMenuOptionCB(func: (data: ContextMenuOptionType) => void) {
    this.setContextMenuOptionCB = func
  }

  // ===== lnModule =====
  private setAllLabelsCB: ((data: string[][]) => void) | null = null

  public setSetAllLabelsCB(func: (data: string[][]) => void) {
    this.setAllLabelsCB = func
  }

  // ===== miModule =====
  private setIfEditingCB: ((data: boolean) => void) | null = null

  public setSetIfEditingCB(func: (data: boolean) => void) {
    this.setIfEditingCB = func
  }

  private setEditTypeCB: ((data: EDIT_TYPE_ENUM) => void) | null = null

  public setSetEditTypeCB(func: (data: EDIT_TYPE_ENUM) => void) {
    this.setEditTypeCB = func
  }

  // ===== veModule =====
  private setDrawedVehicleTrajectoryIdsCB: ((data: DrawedVehicleTrajectoryClass[]) => void) | null = null

  public setSetDrawedVehicleTrajectoryIdsCB(func: (data: DrawedVehicleTrajectoryClass[]) => void) {
    this.setDrawedVehicleTrajectoryIdsCB = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 外部访问 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  public readonly endInsFlightRestrictionZone = this.asModule.endInsFlightRestrictionZone.bind(this.asModule)

  public readonly refreshContextMenuOption = this.cmModule.refreshContextMenuOption.bind(this.cmModule)
  public readonly contextMenuSelect = this.cmModule.contextMenuSelect.bind(this.cmModule)
  public formPanelTitle = this.cmModule.formPanelTitle

  public readonly debugModuleSf1 = this.debugModule.sf1.bind(this.debugModule)
  public readonly debugModuleSf2 = this.debugModule.sf2.bind(this.debugModule)
  public readonly debugModuleCesiumModelPathAnimation = this.debugModule.cesiumModelPathAnimation.bind(this.debugModule)

  public allLayers = this.lnModule.allLayers
  public readonly setLayer = this.lnModule.setLayer.bind(this.lnModule)

  public readonly getIfShowSignalLight = this.meModule.getIfShowSignalLight.bind(this.meModule)
  public readonly setIfShowSignalLight = this.meModule.setIfShowSignalLight.bind(this.meModule)
  public readonly getIfShowVehicleRealTime = this.meModule.getIfShowVehicleRealTime.bind(this.meModule)
  public readonly setIfShowVehicleRealTime = this.meModule.setIfShowVehicleRealTime.bind(this.meModule)
  public readonly getLastActiveInterval = this.meModule.getLastActiveInterval.bind(this.meModule)
  public readonly setLastActiveInterval = this.meModule.setLastActiveInterval.bind(this.meModule)

  public readonly setEditType = this.miModule.setEditType.bind(this.miModule)

  public readonly drawVehicleTrajectory = this.veModule.drawVehicleTrajectory.bind(this.veModule)
  public readonly setVehicleTrajectoryOpacity = this.veModule.setVehicleTrajectoryOpacity.bind(this.veModule)
  public readonly closeVehicleTrajectory = this.veModule.closeVehicleTrajectory.bind(this.veModule)

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件覆盖及初始化 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  protected init() {
    super.init();

    if (!this.viewer) {
      return
    }

    this.asModule.setMeModule(this.meModule)
    this.asModule.setMiModule(this.miModule)
    this.asModule.setVdModule(this.vdModule)
    this.asModule.setViewer(this.viewer)
    this.asModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))

    this.cModule.setViewer(this.viewer)
    this.cModule.setSetCurrentTimeCB((data) => {
      if (this.setCurrentTimeCB) {
        this.setCurrentTimeCB(data)
      }
    })

    this.cmModule.setMeModule(this.meModule);
    this.cmModule.setMiModule(this.miModule);
    this.cmModule.setPModule(this.pModule);
    this.cmModule.setSlModule(this.slModule);
    this.cmModule.setSetContextMenuShowCB((data) => {
      if (this.setContextMenuShowCB) {
        this.setContextMenuShowCB(data)
      }
    })
    this.cmModule.setSetContextMenuXYCB((data) => {
      if (this.setContextMenuXYCB) {
        this.setContextMenuXYCB(data)
      }
    })
    this.cmModule.setSetContextMenuOptionCB((data) => {
      if (this.setContextMenuOptionCB) {
        this.setContextMenuOptionCB(data)
      }
    })
    this.cmModule.setSetFormPanelTitleCB(() => {
      this.formPanelTitle = this.cmModule.formPanelTitle
    })
    this.cmModule.setTrackEntity(this.trackEntity.bind(this))

    this.debugModule.setViewer(this.viewer)
    this.debugModule.setAddLine(this.addLine.bind(this))
    this.debugModule.setAddPoint(this.addPoint.bind(this))
    this.debugModule.setSetViewTo(this.setViewTo.bind(this))

    this.lnModule.setViewer(this.viewer)
    this.lnModule.setSetAllLabelsCB((data) => {
      if (this.setAllLabelsCB) {
        this.setAllLabelsCB(data)
      }
    })
    this.lnModule.setLayerLoadingEndCB(this.LnModuleCloseCB.bind(this))

    this.meModule.setLnModule(this.lnModule)
    this.meModule.setSlModule(this.slModule)
    this.meModule.setVdModule(this.vdModule)
    this.meModule.setVeModule(this.veModule)
    this.meModule.setViewer(this.viewer)
    this.meModule.setRefreshContextMenuOption(this.refreshContextMenuOption.bind(this))
    this.meModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))

    this.miModule.setAsModule(this.asModule)
    this.miModule.setMeModule(this.meModule)
    this.miModule.setVdModule(this.vdModule)
    this.miModule.setViewer(this.viewer)
    this.miModule.setGetMouseMovePosition(() => structuredClone(this.mouseMovePosition))
    this.miModule.setSetIfEditingCB(data => {
      if (this.setIfEditingCB) {
        this.setIfEditingCB(data)
      }
    })
    this.miModule.setSetEditTypeCB(data => {
      if (this.setEditTypeCB) {
        this.setEditTypeCB(data)
      }
    })

    this.pModule.setMeModule(this.meModule)

    this.slModule.setCModule(this.cModule)
    this.slModule.setLnModule(this.lnModule)
    this.slModule.setMeModule(this.meModule)
    this.slModule.setVdModule(this.vdModule)
    this.slModule.setViewer(this.viewer)
    this.slModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))

    this.veModule.setMeModule(this.meModule)
    this.veModule.setViewer(this.viewer)
    this.veModule.setAddLine(this.addLine.bind(this))
    this.veModule.setUpdLine(this.updLine.bind(this))
    this.veModule.setDelLine(this.delLine.bind(this))
    this.veModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))
    this.veModule.setSetDrawedVehicleTrajectoryIdsCB((data) => {
      if (this.setDrawedVehicleTrajectoryIdsCB) {
        this.setDrawedVehicleTrajectoryIdsCB(data)
      }
    })

    this.cModule.init()
    this.lnModule.init()
    this.meModule.init()
    this.miModule.init()
  }

  destroy() {
    super.destroy();
    this.cModule.destroy()
    this.lnModule.closeLayerLoading()
    useDashboardCesium = createDashboardCesium()
    this.wsClient.destroy()
  }

  protected documentVisibilitychangeCB() {
    super.documentVisibilitychangeCB();
    if (!document.hidden) {
      this.cModule.refreshServerTime()
    }
  }

  protected cesiumViewerTimelineContainerMousedownCB(e: MouseEvent) {
    super.cesiumViewerTimelineContainerMousedownCB(e);
  }

  protected cesiumViewerTimelineContainerMouseupCB(e: MouseEvent) {
    super.cesiumViewerTimelineContainerMouseupCB(e);
    this.timelineChangeManually()
  }

  protected cameraMoveEndCB() {
    super.cameraMoveEndCB();
    this.refreshScreenEntities({module: ['slModule', 'asModule']})
  }

  protected clockOnStopCB() {
    super.clockOnStopCB();
  }

  protected clockOnTickCB() {
    super.clockOnTickCB();
    if (this.slModule) {
      this.slModule.tick()
    }
    if (this.veModule) {
      this.veModule.tick()
    }
  }

  protected globeTileLoadProgressEventCB(queuedTileCount: number) {
    super.globeTileLoadProgressEventCB(queuedTileCount);
    // 加载中
    if (queuedTileCount > 0) {
      this.lnModule.openLayerLoading()
    }
    // 加载完成
    if (queuedTileCount === 0) {
      this.lnModule.closeLayerLoading(true)
    }
  }

  protected ScreenSpaceEventTypeLeftDownCB() {
    super.ScreenSpaceEventTypeLeftDownCB();
  }

  protected ScreenSpaceEventTypeLeftUpCB() {
    super.ScreenSpaceEventTypeLeftUpCB();
  }

  protected ScreenSpaceEventTypeRightDownCB() {
    super.ScreenSpaceEventTypeRightDownCB();
  }

  protected ScreenSpaceEventTypeRightUpCB() {
    super.ScreenSpaceEventTypeRightUpCB();
  }

  protected ScreenSpaceEventTypeLeftClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    super.ScreenSpaceEventTypeLeftClickCB(m);
    this.cmModule.contextMenuShow = false
    if (this.miModule.ifEditing) {
      this.miModule.doEditHandles()
    }
  }

  protected ScreenSpaceEventTypeRightClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    super.ScreenSpaceEventTypeRightClickCB(m);
    this.cmModule.contextMenuXY = [m.position.x, m.position.y];
    this.cmModule.contextMenuShow = true
  }

  protected ScreenSpaceEventTypeLeftDoubleClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    super.ScreenSpaceEventTypeLeftDoubleClickCB(m);
    if (!this.viewer) {
      return
    }
    if (!this.meModule) {
      return
    }
    const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
    this.viewer.trackedEntity = void 0
    if (seidsByGroup.vehicleRealTimeCount > 0) {
      const id = `${ID_PREFIX_VEHICLE_REAL_TIME}${seidsByGroup.vehicleRealTime[0]}`
      this.trackEntity(id)
    }
  }

  protected ScreenSpaceEventTypeMouseMoveCB(m: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    super.ScreenSpaceEventTypeMouseMoveCB(m);
    if (this.miModule.ifEditing) {
      this.miModule.setMovingPointPosition()
    }
  }

  protected ScreenSpaceEventTypeWheelCB(m: number) {
    super.ScreenSpaceEventTypeWheelCB(m);
  }

  protected ScreenSpaceEventTypeClickCB() {
    super.ScreenSpaceEventTypeClickCB();
    if (currentConfig.VITE_MODE === final.DEV) {
      console.info(`mouseClickPosition-${this.mouseClickPosition.join('-')}`)
    }
    // 拾取该位置的物体
    if (!this.viewer) {
      return
    }
    if (this.miModule.ifEditing) {
      return;
    }
    let ifHasObj = false
    const cartesian2 = new Cesium.Cartesian2(this.mouseClickPositionXY[0], this.mouseClickPositionXY[1]);
    const pickedObject = this.viewer.scene.pick(cartesian2);
    // 情况1：如果点击的是 Entity（如点、线、面）
    if (pickedObject && pickedObject.id instanceof Cesium.Entity) {
      ifHasObj = true
      const entity = pickedObject.id as Cesium.Entity;
      this.meModule.selectedEntityIds = [entity.id];
    }
    // 情况2：如果点击的是 Primitive（如3D模型、自定义图元）
    else if (pickedObject && pickedObject.primitive instanceof Cesium.Primitive) {
      ifHasObj = true
      const primitive = pickedObject.primitive;
    }
    // 情况3：如果点击的是3D Tiles（如倾斜摄影、BIM模型）
    else if (pickedObject && pickedObject.tileset instanceof Cesium.Cesium3DTileset) {
      ifHasObj = true
      const tileset = pickedObject.tileset;
    }
    if (!ifHasObj) {
      this.meModule.selectedEntityIds = []
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  get trackedEntityId(): string | null {
    return super.trackedEntityId;
  }

  set trackedEntityId(value: string | null) {
    super.trackedEntityId = value;
    if (this.setTrackedEntityIdCB) {
      this.setTrackedEntityIdCB(this.trackedEntityId)
    }
  }

  private LnModuleCloseCB(count: number) {
    if (count === 1) {
      this.refreshScreenEntities({module: ['slModule', 'asModule']})
    }
  }

  private timelineChangeManually() {
    if (this.viewer) {
      this.viewer.clock.shouldAnimate = true
    }
    this.refreshScreenEntities({ifReplay: true, module: ['slModule']})
  }

  public refreshServerTime() {
    this.cModule.refreshServerTime(() => {
      this.timelineChangeManually()
    })
  }

  public refreshScreenEntities({
                                 ifRefresh = false,
                                 ifReplay = false,
                                 module = [],
                               }: {
                                 ifRefresh?: boolean
                                 ifReplay?: boolean
                                 module?: ('slModule' | 'asModule')[]
                               } = {}
  ) {
    if (module.includes('slModule')) {
      this.slModule.drawSignalLightsWhenMapMove({ifRefresh, ifReplay})
    }
    if (module.includes('asModule')) {
      this.asModule.refreshScreenAirspace({ifRefresh})
    }
  }
}

export function createDashboardCesium() {
  const wsClient = new WsClient({ifInit: false, pageContext: 'dashboard'});
  const acModule = new AircraftModule();
  const asModule = new AirspaceModule();
  const cModule = new ClockModule();
  const cmModule = new ContextMenuModule();
  const debugModule = new DebugModule();
  const lmModule = new LayerNotificationModule();
  const meModule = new MapEntityModule();
  const miModule = new MapInteractionModule();
  const pModule = new PermissionModule();
  const slModule = new SignalLightModule();
  const vdModule = new VersionDataModule();
  const veModule = new VehicleModule();
  return new UseDashboardCesium(
      wsClient,
      acModule,
      asModule,
      cModule,
      cmModule,
      debugModule,
      lmModule,
      meModule,
      miModule,
      pModule,
      slModule,
      vdModule,
      veModule,
  );
}

export let useDashboardCesium = createDashboardCesium()

// 获取有权限的按钮
watch(visibleButtons, () => {
  useDashboardCesium.refreshContextMenuOption()
}, {
  immediate: true
})
