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
import { ID_PREFIX_VEHICLE_REAL_TIME } from "@/views/dashboard/functionModules/constant.ts";

const currentConfig = adminConfig.currentConfig()

const sysStore = useSysStore()

const visibleButtons = sysStore.getVisibleButtons();

/**
 * 大屏页面的 Cesium 类
 */
class UseDashboardCesium extends UseCesium {
  constructor(
      private readonly wsClient: WsClient,
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
      this.refreshScreenEntities()
    })
    this.wsClient.addEventListener('dcts:spatialData:getVehiclesInPolygon', data => {
      const result = JSON.parse(data.msg) as GetVehiclesInPolygonVo[];
      this.veModule.addTask(result)
    })
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 外部访问 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  public currentTime = this.cModule.currentTime

  public readonly refreshContextMenuOption = this.cmModule.refreshContextMenuOption.bind(this.cmModule)
  public contextMenuShow = this.cmModule.contextMenuShow
  public contextMenuXY = this.cmModule.contextMenuXY
  public contextMenuOption = this.cmModule.contextMenuOption
  public readonly contextMenuSelect = this.cmModule.contextMenuSelect.bind(this.cmModule)
  public formPanelTitle = this.cmModule.formPanelTitle

  public readonly debugModuleSf1 = this.debugModule.sf1.bind(this.debugModule)
  public readonly debugModuleSf2 = this.debugModule.sf2.bind(this.debugModule)
  public readonly debugModuleCesiumModelPathAnimation = this.debugModule.cesiumModelPathAnimation.bind(this.debugModule)

  public allLabels = this.lnModule.allLabels
  public allLayers = this.lnModule.allLayers
  public readonly setLayer = this.lnModule.setLayer.bind(this.lnModule)

  public readonly getIfShowSignalLight = this.meModule.getIfShowSignalLight.bind(this.meModule)
  public readonly setIfShowSignalLight = this.meModule.setIfShowSignalLight.bind(this.meModule)
  public readonly getIfShowVehicleRealTime = this.meModule.getIfShowVehicleRealTime.bind(this.meModule)
  public readonly setIfShowVehicleRealTime = this.meModule.setIfShowVehicleRealTime.bind(this.meModule)
  public readonly getLastActiveInterval = this.meModule.getLastActiveInterval.bind(this.meModule)
  public readonly setLastActiveInterval = this.meModule.setLastActiveInterval.bind(this.meModule)
  public readonly refreshScreenEntities = this.meModule.refreshScreenEntities.bind(this.meModule)

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件覆盖及初始化 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  protected init() {
    super.init();

    if (!this.viewer) {
      return
    }

    this.cModule.setViewer(this.viewer)
    this.cModule.setSetCurrentTimeCB(() => {
      this.currentTime = this.cModule.currentTime
    })

    this.cmModule.setMeModule(this.meModule);
    this.cmModule.setMiModule(this.miModule);
    this.cmModule.setPModule(this.pModule);
    this.cmModule.setSetContextMenuShowCB(() => {
      this.contextMenuShow = this.cmModule.contextMenuShow
    })
    this.cmModule.setSetContextMenuXYCB(() => {
      this.contextMenuXY = this.cmModule.contextMenuXY
    })
    this.cmModule.setSetContextMenuOptionCB(() => {
      this.contextMenuOption = this.cmModule.contextMenuOption
    })
    this.cmModule.setSetFormPanelTitleCB(() => {
      this.formPanelTitle = this.cmModule.formPanelTitle
    })
    this.cmModule.setTrackEntity(this.trackEntity.bind(this))

    this.debugModule.setViewer(this.viewer)
    this.debugModule.setAddLines(this.addLines.bind(this))
    this.debugModule.setAddPoint(this.addPoint.bind(this))
    this.debugModule.setSetViewTo(this.setViewTo.bind(this))

    this.lnModule.setViewer(this.viewer)
    this.lnModule.setSetAllLabelsCB(() => {
      this.allLabels = this.lnModule.allLabels
    })
    this.lnModule.setLayerLoadingEndCB(this.LnModuleCloseCB.bind(this))

    this.meModule.setLnModule(this.lnModule)
    this.meModule.setSlModule(this.slModule)
    this.meModule.setVdModule(this.vdModule)
    this.meModule.setVeModule(this.veModule)
    this.meModule.setViewer(this.viewer)
    this.meModule.setRefreshContextMenuOption(this.refreshContextMenuOption.bind(this))
    this.meModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))

    this.miModule.setMeModule(this.meModule)
    this.miModule.setVdModule(this.vdModule)
    this.miModule.setViewer(this.viewer)
    this.miModule.setGetMouseMovePosition(() => this.mouseMovePosition)

    this.pModule.setMeModule(this.meModule)

    this.slModule.setCModule(this.cModule)
    this.slModule.setLnModule(this.lnModule)
    this.slModule.setMeModule(this.meModule)
    this.slModule.setVdModule(this.vdModule)
    this.slModule.setViewer(this.viewer)
    this.slModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))

    this.veModule.setMeModule(this.meModule)
    this.veModule.setViewer(this.viewer)
    this.veModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates.bind(this))

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

  protected cameraMoveEndCB() {
    super.cameraMoveEndCB();
    this.refreshScreenEntities()
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
      console.log(this.mouseClickPosition)
    }
    // 拾取该位置的物体
    if (!this.viewer) {
      return
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
  private LnModuleCloseCB(count: number) {
    if (count === 1) {
      this.refreshScreenEntities()
    }
  }
}

export function createDashboardCesium() {
  const wsClient = new WsClient({ifInit: false, pageContext: 'dashboard'});
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
