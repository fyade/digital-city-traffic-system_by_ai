import { UseCesium } from "@/views/dashboard/core/useCesium.ts";
import { h, watch } from "vue";
import {
  createDiscreteApi,
  DropdownDividerOption,
  DropdownGroupOption,
  DropdownOption,
  DropdownRenderOption,
  NotificationReactive,
  NSpin
} from "naive-ui";
import { ContextMenuItem, LayerDto } from "@/views/dashboard/index/dto.ts";
import router from "@/router";
import * as Cesium from "cesium";
import { geoserverConfig } from "@dcts/config";
import { signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import signalLight1Svg from "@/assets/images2/signal-light-1.png";
import { useUserStore } from "@/store/module/user.ts";
import { useSysStore } from "@/store/module/sys.ts";

const sysStore = useSysStore()
const userStore = useUserStore();

const visibleButtons = sysStore.getVisibleButtons();

const {notification} = createDiscreteApi(['notification'])

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 常量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
export const ID_PREFIX_POINT = 'ID_PREFIX_POINT::::::::::'
export const ID_PREFIX_LINE = 'ID_PREFIX_LINE::::::::::'
export const ID_PREFIX_SIGNAL_LIGHT_GROUP = 'ID_PREFIX_SIGNAL_LIGHT_GROUP::::::::::'

/**
 * 大屏页面的 Cesium
 */
class UseDashboardCesium extends UseCesium {
  constructor({
                container
              }: {
                container?: string
              } = {}
  ) {
    super({container});
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件重写 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  protected init() {
    super.init();

    this.setLayer()
  }

  destroy() {
    super.destroy();
    this.layerLoadingEnd()
    useDashboardCesium = new UseDashboardCesium();
  }

  protected globeTileLoadProgressEventCB(queuedTileCount: number) {
    super.globeTileLoadProgressEventCB(queuedTileCount);
    // 加载中
    if (queuedTileCount > 0 && !this.layerLoading) {
      this.layerLoading = true
      this.layerLoadingNotification = notification.create({
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
      if (!this.layerLoadingTimer) {
        this.layerLoadingTimer = setTimeout(() => {
          if (this.layerLoadingNotification) {
            this.layerLoadingNotification.content = '加载时间可能稍长，请稍作等待，感谢您的配合...'
          }
        }, 3000)
      }
    }
    // 加载完成
    if (queuedTileCount === 0 && this.layerLoading) {
      this.layerLoadingEnd(true)
    }
  }

  private layerLoadingEnd(ifEnd = false) {
    this.layerLoadingCount++;
    // 第一次图层加载完成后调用
    if (this.layerLoadingCount === 1) {
      this.refreshScreenEntities()
    }
    if (this.layerLoadingNotification) {
      this.layerLoadingNotification.destroy()
    }
    this.layerLoading = false
    if (ifEnd) {
      notification.success({
        title: '提示',
        content: '图层加载完成',
        duration: 3000
      })
    }
    // 清除定时器
    if (this.layerLoadingTimer) {
      clearTimeout(this.layerLoadingTimer)
      this.layerLoadingTimer = null
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
    this.contextMenuShow = false
  }

  protected ScreenSpaceEventTypeRightClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    super.ScreenSpaceEventTypeRightClickCB(m);
    this.contextMenuXY = [m.position.x, m.position.y];
    this.contextMenuShow = true
  }

  protected ScreenSpaceEventTypeMouseMoveCB(m: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    super.ScreenSpaceEventTypeMouseMoveCB(m);
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
    this.selectedEntityIds = []
    const cartesian2 = new Cesium.Cartesian2(this.mouseClickPositionXY[0], this.mouseClickPositionXY[1]);
    const pickedObject = this.viewer.scene.pick(cartesian2);
    if (!pickedObject) {
      return;
    }
    // 情况1：如果点击的是 Entity（如点、线、面）
    if (pickedObject.id instanceof Cesium.Entity) {
      const entity = pickedObject.id as Cesium.Entity;
      this.selectedEntityIds = [entity.id];
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

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 图层及通知业务 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // 图层是否正在加载
  private layerLoading = false
  // 图层加载次数
  private layerLoadingCount = 0
  // 右上角的 Loading 通知
  private layerLoadingNotification: NotificationReactive | null = null
  // 右上角的通知内容变化定时器
  private layerLoadingTimer: NodeJS.Timeout | null = null
  // 所有图层的链接及当前图层index
  private currentIdOfBaseMap = [[''], ['a1']]
  private currentIdOfRoadData = [[''], ['b1']]
  private allLayersOfBaseMap: LayerDto[] = [
    {
      id: 'a1',
      name: 'SuperMap影像底图',
      preview: '',
      func: () => {
        if (!this.viewer) {
          return
        }
        const provider = new Cesium.UrlTemplateImageryProvider({
          url: `https://www.supermapol.com/proxy/y8f150ad/iserver/services/map-geovis-img/rest/maps/GEOVIS_Img/zxyTileImage.png?width=256&height=256&x={x}&y={y}&z={z}`,
          minimumLevel: 0,
          maximumLevel: 18,
          credit: new Cesium.Credit('SuperMap iServer')
        });
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '影像底图',
      fromCompany: 'SuperMap',
      fromUrl: 'https://www.supermapol.com/resource-center/map/detail?id=2118000783'
    }
  ]
  private allLayersOfRoadData: LayerDto[] = [
    {
      id: 'b1',
      name: 'OSM路网数据[路网](2025.06.22)',
      preview: '',
      func: () => {
        if (!this.viewer) {
          return
        }
        const provider = new Cesium.WebMapServiceImageryProvider({
          url: `${geoserverConfig.VITE_API_PREFIX}/geoserver/wms`,
          layers: 'ne:planet_osm_line',
          parameters: {
            transparent: true,
            format: 'image/png'
          }
        });
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '路网数据[路网]',
      fromCompany: 'OpenStreetMap',
      fromUrl: 'https://www.openstreetmap.org/'
    }
  ]
  public allLabels: string[][] = []

  private setLayer() {
    this.allLabels = []
    const filter1 = this.allLayersOfBaseMap.filter(item => this.currentIdOfBaseMap[1].includes(item.id));
    for (const f of filter1) {
      f.func()
      this.allLabels.push([f.dataType, f.fromCompany, f.fromUrl])
    }
    const filter2 = this.allLayersOfRoadData.filter(item => this.currentIdOfRoadData[1].includes(item.id));
    for (const f of filter2) {
      f.func()
      this.allLabels.push([f.dataType, f.fromCompany, f.fromUrl])
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 右键菜单业务 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // 右键菜单的显示
  private _contextMenuShow = false

  get contextMenuShow(): boolean {
    return this._contextMenuShow;
  }

  set contextMenuShow(value: boolean) {
    this._contextMenuShow = value;
  }

  // 右键菜单的坐标
  public contextMenuXY = [0, 0]
  public contextMenus: ContextMenuItem[] = [
    {
      id: 'dcts:signalLight:signalLightGroupInfo:ins',
      func: () => {
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:ins'})
      }
    },
    {
      id: 'dcts:signalLight:signalLightGroupInfo:upd',
      func: () => {
        let itemId = ''
        if (this.selectedEntityIds[0].startsWith(ID_PREFIX_SIGNAL_LIGHT_GROUP)) {
          itemId = this.selectedEntityIds[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:upd', query: {id: itemId}})
      }
    },
    {
      id: 'dcts:signalLight:signalLightGroupInfo:del',
      func: () => {
        let itemId = ''
        if (this.selectedEntityIds[0].startsWith(ID_PREFIX_SIGNAL_LIGHT_GROUP)) {
          itemId = this.selectedEntityIds[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:del', query: {id: itemId}})
      }
    },
    {
      id: 'close',
      func: () => {
        this.contextMenuShow = false
      }
    }
  ]
  public contextMenuOption: Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption> = []

  public refreshContextMenuOption() {
    this.contextMenuOption = [
      {
        label: '信号灯管理',
        key: 'i:dcts:signalLight',
        show: this.contextMenuIfHasPermission('i:dcts:signalLight'),
        children: [
          {
            label: '信号灯组信息管理',
            key: 'i:dcts:signalLight:signalLightGroupInfo',
            show: this.contextMenuIfHasPermission('i:dcts:signalLight:signalLightGroupInfo'),
            children: [
              {
                label: '新增信号灯组',
                key: 'dcts:signalLight:signalLightGroupInfo:ins',
                show: this.contextMenuIfHasPermission('dcts:signalLight:signalLightGroupInfo:ins'),
              },
              {
                label: '修改信号灯组',
                key: 'dcts:signalLight:signalLightGroupInfo:upd',
                show: this.contextMenuIfHasPermission('dcts:signalLight:signalLightGroupInfo:upd', true),
              },
              {
                label: '删除信号灯组',
                key: 'dcts:signalLight:signalLightGroupInfo:del',
                show: this.contextMenuIfHasPermission('dcts:signalLight:signalLightGroupInfo:del', true),
              }
            ]
          },
          {
            label: '子信号灯信息管理',
            key: 'i:dcts:signalLight:signalLightInfo',
            show: this.contextMenuIfHasPermission('i:dcts:signalLight:signalLightInfo', true),
            children: [
              {
                label: '新增子信号灯',
                key: 'dcts:signalLight:signalLightInfo:ins',
                show: this.contextMenuIfHasPermission('dcts:signalLight:signalLightInfo:ins', true),
              }
            ]
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        label: '关闭',
        key: 'close'
      }
    ]
  }

  public formPanelTitle = ''
  /**
   * 右键菜单的事件
   * @param key
   * @param obj
   */
  public contextMenuSelect = (key: string, obj: DropdownOption) => {
    if (obj) {
      this.formPanelTitle = obj.label as string
    }
    const find = this.contextMenus.find(item => item.id === key);
    if (find) {
      find.func()
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 地图实体业务 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // 当前选中的实体
  private _selectedEntityIds: string[] = []

  get selectedEntityIds(): string[] {
    return this._selectedEntityIds;
  }

  set selectedEntityIds(value: string[]) {
    this._selectedEntityIds = value;
    this.refreshContextMenuOption()
  }

  // 已渲染的信号灯组的id列表
  private renderedSignalLightGroupIds: string[] = []

  /**
   * 刷新可视区域内的实体
   * @param ifRefresh
   */
  public refreshScreenEntities(ifRefresh = false) {
    this.drawSignalLightGroupsWhenMapMove(ifRefresh)
  }

  /**
   * 查询可视区域内的信号灯组
   * @param ifRefresh
   */
  private drawSignalLightGroupsWhenMapMove(ifRefresh = false) {
    const viewCornerCoordinates = this.getViewCornerCoordinates();
    if (viewCornerCoordinates && viewCornerCoordinates.length >= 3) {
      viewCornerCoordinates.push(viewCornerCoordinates[0])
      signalLightGroupsInPolygonApi({
        version: '1.0',
        points: viewCornerCoordinates
      }).then(res => {
        if (!this.viewer) {
          return
        }
        if (ifRefresh) {
          const ids = [
            ...res.map(item => item.id),
            ...this.selectedEntityIds.map(item => item.replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, ''))
          ]
          for (const id of ids) {
            const d = `${ID_PREFIX_SIGNAL_LIGHT_GROUP}${id}`;
            const index = this.renderedSignalLightGroupIds.indexOf(d);
            if (index > -1) {
              this.viewer.entities.removeById(d)
              this.renderedSignalLightGroupIds.splice(index, 1)
            }
          }
        }
        for (const re of res) {
          const d = `${ID_PREFIX_SIGNAL_LIGHT_GROUP}${re.id}`;
          if (this.renderedSignalLightGroupIds.includes(d)) {
            continue;
          }
          this.renderedSignalLightGroupIds.push(d)
          const strings = re.location.split(',').map(Number) as [number, number];
          this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(strings[0], strings[1]),
            billboard: {
              image: signalLight1Svg,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              width: 32,
              height: 32
            },
            id: d,
          });
        }
      })
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 权限相关 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 右键菜单项是否有权限
   * @param perm
   * @param ifNeedEntity
   * @private
   */
  private contextMenuIfHasPermission(perm: string, ifNeedEntity = false) {
    const dctsButtons = visibleButtons.get('sys:dcts');
    if (dctsButtons) {
      return userStore.ifLogin && dctsButtons.includes(perm) && (ifNeedEntity ? this.selectedEntityIds.length > 0 : true)
    }
    return false
  }
}

export let useDashboardCesium = new UseDashboardCesium();

// 获取有权限的按钮
watch(visibleButtons, () => {
  useDashboardCesium.refreshContextMenuOption()
}, {
  immediate: true
})
