import { UseCesium } from "@/views/dashboard/core/useCesium.ts";
import { h, watch } from "vue";
import { createDiscreteApi, NSpin } from "naive-ui";
import * as Cesium from "cesium";
import { useSysStore } from "@/store/module/sys.ts";
import { ContextMenuModule } from "@/views/dashboard/functionModules/contextMenuModule.ts";
import { LayerNotificationModule } from "@/views/dashboard/functionModules/layerNotificationModule.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { PermissionModule } from "@/views/dashboard/functionModules/permissionModule.ts";

const sysStore = useSysStore()

const visibleButtons = sysStore.getVisibleButtons();

const {notification} = createDiscreteApi(['notification'])

/**
 * 大屏页面的 Cesium
 */
class UseDashboardCesium extends UseCesium {
  constructor(
      private readonly cmModule: ContextMenuModule,
      private readonly lnModule: LayerNotificationModule,
      private readonly meModule: MapEntityModule,
      private readonly miModule: MapInteractionModule,
      private readonly pModule: PermissionModule,
  ) {
    super();
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 外部访问 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  public readonly refreshContextMenuOption = this.cmModule.refreshContextMenuOption.bind(this.cmModule)
  public contextMenuShow = this.cmModule.contextMenuShow
  public contextMenuXY = this.cmModule.contextMenuXY
  public contextMenuOption = this.cmModule.contextMenuOption
  public readonly contextMenuSelect = this.cmModule.contextMenuSelect.bind(this.cmModule)
  public formPanelTitle = this.cmModule.formPanelTitle

  public allLabels = this.lnModule.allLabels

  public readonly refreshScreenEntities = this.meModule.refreshScreenEntities.bind(this.meModule)

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件覆盖 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  protected init() {
    super.init();

    if (!this.viewer) {
      return
    }

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

    this.meModule.setViewer(this.viewer)
    this.meModule.setRefreshContextMenuOption(this.refreshContextMenuOption)
    this.meModule.setGetViewCornerCoordinates(this.getViewCornerCoordinates)

    this.miModule.setMeModule(this.meModule)
    this.miModule.setViewer(this.viewer)
    this.miModule.setGetMouseMovePosition(() => this.mouseMovePosition)

    this.pModule.setMeModule(this.meModule)

    this.lnModule.setLayer()
    this.miModule.init()
  }

  destroy() {
    super.destroy();
    this.layerLoadingEnd()
    useDashboardCesium = createDashboardCesium()
  }

  protected globeTileLoadProgressEventCB(queuedTileCount: number) {
    super.globeTileLoadProgressEventCB(queuedTileCount);
    // 加载中
    if (queuedTileCount > 0 && !this.lnModule.layerLoading) {
      this.lnModule.layerLoading = true
      this.lnModule.layerLoadingNotification = notification.create({
        title: '提示',
        content: '图层加载中...',
        duration: 0,
        avatar: () => h(NSpin, {
          size: 'medium',
          strokeWidth: 20
        }),
        closable: false,
      });
      // 设置定时器
      if (!this.lnModule.layerLoadingTimer) {
        this.lnModule.layerLoadingTimer = setTimeout(() => {
          if (this.lnModule.layerLoadingNotification) {
            this.lnModule.layerLoadingNotification.content = '加载时间可能稍长，请稍作等待，感谢您的配合...'
          }
        }, 3000)
      }
    }
    // 加载完成
    if (queuedTileCount === 0 && this.lnModule.layerLoading) {
      this.layerLoadingEnd(true)
    }
  }

  private layerLoadingEnd(ifEnd = false) {
    this.lnModule.layerLoadingCount++;
    // 第一次图层加载完成后调用
    if (this.lnModule.layerLoadingCount === 1) {
      this.refreshScreenEntities()
    }
    if (this.lnModule.layerLoadingNotification) {
      this.lnModule.layerLoadingNotification.destroy()
    }
    this.lnModule.layerLoading = false
    if (ifEnd) {
      notification.success({
        title: '提示',
        content: '图层加载完成',
        duration: 3000
      })
    }
    // 清除定时器
    if (this.lnModule.layerLoadingTimer) {
      clearTimeout(this.lnModule.layerLoadingTimer)
      this.lnModule.layerLoadingTimer = null
    }
  }

  protected cameraMoveEndCB() {
    super.cameraMoveEndCB();
    this.refreshScreenEntities()
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
    // 拾取该位置的物体
    if (!this.viewer) {
      return
    }
    this.meModule.selectedEntityIds = []
    const cartesian2 = new Cesium.Cartesian2(this.mouseClickPositionXY[0], this.mouseClickPositionXY[1]);
    const pickedObject = this.viewer.scene.pick(cartesian2);
    if (!pickedObject) {
      return;
    }
    // 情况1：如果点击的是 Entity（如点、线、面）
    if (pickedObject.id instanceof Cesium.Entity) {
      const entity = pickedObject.id as Cesium.Entity;
      this.meModule.selectedEntityIds = [entity.id];
    }
    // 情况2：如果点击的是 Primitive（如3D模型、自定义图元）
    else if (pickedObject.primitive instanceof Cesium.Primitive) {
      const primitive = pickedObject.primitive;
    }
    // 情况3：如果点击的是3D Tiles（如倾斜摄影、BIM模型）
    else if (pickedObject.tileset instanceof Cesium.Cesium3DTileset) {
      const tileset = pickedObject.tileset;
    }
  }
}

export function createDashboardCesium() {
  const cmModule = new ContextMenuModule();
  const lmModule = new LayerNotificationModule();
  const meModule = new MapEntityModule();
  const miModule = new MapInteractionModule();
  const pModule = new PermissionModule();
  return new UseDashboardCesium(
      cmModule,
      lmModule,
      meModule,
      miModule,
      pModule,
  );
}

export let useDashboardCesium = createDashboardCesium()

// 获取有权限的按钮
watch(visibleButtons, () => {
  useDashboardCesium.refreshContextMenuOption()
}, {
  immediate: true
})
