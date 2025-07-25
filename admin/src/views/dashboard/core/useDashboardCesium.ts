import { UseCesium } from "@/views/dashboard/core/useCesium.ts";
import { watch } from "vue";
import * as Cesium from "cesium";
import { useSysStore } from "@/store/module/sys.ts";
import { WsClient } from "@/services/wsClient.ts";
import { ClockModule } from "@/views/dashboard/functionModules/clockModule.ts";
import { ContextMenuModule } from "@/views/dashboard/functionModules/contextMenuModule.ts";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { PermissionModule } from "@/views/dashboard/functionModules/permissionModule.ts";
import { SignalLightModule } from "@/views/dashboard/functionModules/signalLightModule.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { adminConfig } from "@dcts/config";
import { CalculateLightsInPolygonVo } from "@/type/module/dcts/spatialData.ts";

const currentConfig = adminConfig.currentConfig()

const sysStore = useSysStore()

const visibleButtons = sysStore.getVisibleButtons();

/**
 * 大屏页面的 Cesium
 */
class UseDashboardCesium extends UseCesium {
  constructor(
      private readonly wsClient: WsClient,
      private readonly cModule: ClockModule,
      private readonly cmModule: ContextMenuModule,
      private readonly lnModule: LayerNotificationModule,
      private readonly meModule: MapEntityModule,
      private readonly miModule: MapInteractionModule,
      private readonly pModule: PermissionModule,
      private readonly slModule: SignalLightModule,
      private readonly vdModule: VersionDataModule,
  ) {
    super();
    this.wsClient.addEventListener('dcts:spatialData:calculateLightsInPolygon', async data => {
      const calculateLightResult = JSON.parse(data.msg) as CalculateLightsInPolygonVo[];
      this.slModule.addTask(calculateLightResult)
      this.lnModule.closeSignalLightLoading()
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

  public allLabels = this.lnModule.allLabels
  public allLayers = this.lnModule.allLayers
  public readonly setLayer = this.lnModule.setLayer.bind(this.lnModule)

  public readonly refreshScreenEntities = this.meModule.refreshScreenEntities.bind(this.meModule)

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件覆盖及初始化 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  protected init() {
    super.init();

    if (!this.viewer) {
      return
    }

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

    this.lnModule.setViewer(this.viewer)
    this.lnModule.setSetAllLabelsCB(() => {
      this.allLabels = this.lnModule.allLabels
    })
    this.lnModule.setLayerLoadingEndCB(this.LnModuleCloseCB.bind(this))

    this.meModule.setLnModule(this.lnModule)
    this.meModule.setVdModule(this.vdModule)
    this.meModule.setViewer(this.viewer)
    this.meModule.setRefreshContextMenuOption(this.refreshContextMenuOption)
    this.meModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates)

    this.miModule.setMeModule(this.meModule)
    this.miModule.setVdModule(this.vdModule)
    this.miModule.setViewer(this.viewer)
    this.miModule.setGetMouseMovePosition(() => this.mouseMovePosition)

    this.pModule.setMeModule(this.meModule)

    this.slModule.setCModule(this.cModule)
    this.slModule.setMeModule(this.meModule)
    this.slModule.setVdModule(this.vdModule)
    this.slModule.setViewer(this.viewer)

    this.cModule.init()
    this.lnModule.init()
    this.miModule.init()
    this.slModule.init()
  }

  destroy() {
    super.destroy();
    this.cModule.destroy()
    this.slModule.destroy()
    this.lnModule.closeLayerLoading().then(() => {
      useDashboardCesium = createDashboardCesium()
    })
  }

  protected async globeTileLoadProgressEventCB(queuedTileCount: number) {
    await super.globeTileLoadProgressEventCB(queuedTileCount);
    // 加载中
    if (queuedTileCount > 0) {
      this.lnModule.openLayerLoading()
    }
    // 加载完成
    if (queuedTileCount === 0) {
      await this.lnModule.closeLayerLoading(true)
    }
  }

  protected async cameraMoveEndCB() {
    await super.cameraMoveEndCB();
    await this.refreshScreenEntities()
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
    if (currentConfig.VITE_MODE === 'dev') {
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
  private async LnModuleCloseCB(count: number) {
    if (count === 1) {
      await this.refreshScreenEntities()
    }
  }
}

export function createDashboardCesium() {
  const wsClient = new WsClient();
  const cModule = new ClockModule();
  const cmModule = new ContextMenuModule();
  const lmModule = new LayerNotificationModule();
  const meModule = new MapEntityModule();
  const miModule = new MapInteractionModule();
  const pModule = new PermissionModule();
  const slModule = new SignalLightModule();
  const vdModule = new VersionDataModule();
  return new UseDashboardCesium(
      wsClient,
      cModule,
      cmModule,
      lmModule,
      meModule,
      miModule,
      pModule,
      slModule,
      vdModule,
  );
}

export let useDashboardCesium = createDashboardCesium()

// 获取有权限的按钮
watch(visibleButtons, () => {
  useDashboardCesium.refreshContextMenuOption()
}, {
  immediate: true
})
