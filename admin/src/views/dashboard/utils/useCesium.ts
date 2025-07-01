import * as Cesium from "cesium";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { adminConfig, geoserverConfig } from "@dcts/config";
import { idUtils } from "@dcts/common";
import { computed, h, ref, watch } from "vue";
import { ContextMenuItem, LayerDto } from "@/views/dashboard/index/dto.ts";
import { useUserStore } from "@/store/module/user.ts";
import { useSysStore } from "@/store/module/sys.ts";
import {
  DropdownDividerOption,
  DropdownGroupOption,
  DropdownOption,
  DropdownRenderOption,
  NotificationReactive,
  NSpin,
  useNotification
} from "naive-ui";
import router from "@/router";
import { signalLightGroupsInPolygonApi } from "@/api/module/dcts/spatialData.ts";

const currentConfig = adminConfig.currentConfig();

const sysStore = useSysStore()
const userStore = useUserStore()

/**
 * 大屏页面的Cesium
 */
export class UseCesium {
  private static instance: UseCesium | null = null
  private viewer: Cesium.Viewer | null = null
  private pointCollection: Cesium.PointPrimitiveCollection | null = null
  private pointMap = new Map<string, Cesium.PointPrimitive>()
  private polylineCollection: Cesium.PrimitiveCollection | null = null
  private polylineMap = new Map<string, Cesium.Primitive>()
  private geometryInstanceMap = new Map<string, Cesium.GeometryInstance>()

  /**
   * @param container 容器id 若传入，则会执行初始化命令
   */
  constructor({
                container
              }: {
                container?: string
              } = {}
  ) {
    if (!UseCesium.instance || container) {
      if (container) {
        this.viewer = new Cesium.Viewer(container, {
          infoBox: false, // 属性面板
          selectionIndicator: false, // 选择指示器
          geocoder: false, // 搜索框
          homeButton: false, // 主页按钮
          sceneModePicker: false, // 场景模式选择器
          baseLayerPicker: false, // 底图选择器
          navigationHelpButton: false, // 帮助按钮
          animation: false, // 动画控制器
          timeline: false, // 时间轴
          fullscreenButton: false, // 全屏按钮
        });
        (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";

        // 初始化点的集合
        this.pointCollection = this.viewer.scene.primitives.add(
            new Cesium.PointPrimitiveCollection()
        )
        // 初始化线的集合
        this.polylineCollection = this.viewer.scene.primitives.add(
            new Cesium.PrimitiveCollection()
        )

        if (currentConfig.VITE_MODE === 'dev') {
          this.viewer.scene.debugShowFramesPerSecond = true
        }

        this.setViewTo(118.92844631852402, 32.12752744546319, 10000)

        // 获取默认的影像图层
        const defaultImagery = this.viewer.imageryLayers.get(0);
        // 移除默认图层
        this.viewer.imageryLayers.remove(defaultImagery);

        this.setLayer()


        const notification = useNotification();
        // 瓦片图层加载事件
        this.viewer.scene.globe.tileLoadProgressEvent.addEventListener(queuedTileCount => {
          // 加载中
          if (queuedTileCount > 0 && !this.layerLoading.value) {
            this.layerLoading.value = true
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
          if (queuedTileCount === 0 && this.layerLoading.value) {
            if (this.layerLoadingNotification) {
              this.layerLoadingNotification.destroy()
            }
            this.layerLoading.value = false
            notification.success({
              title: '提示',
              content: '图层加载完成',
              duration: 3000
            })
            // 清除定时器
            if (this.layerLoadingTimer) {
              clearTimeout(this.layerLoadingTimer)
              this.layerLoadingTimer = null
            }
          }
        })
        // 镜头移动结束事件
        this.viewer.camera.moveEnd.addEventListener(() => {
          const viewCornerCoordinates = this.getViewCornerCoordinates();
          if (viewCornerCoordinates) {
            viewCornerCoordinates.push(viewCornerCoordinates[0])
            signalLightGroupsInPolygonApi({
              version: '1.0',
              points: viewCornerCoordinates
            }).then(res => {
              console.log(res)
            })
          }
        })
        // 图层点击事件
        this.viewer.cesiumWidget.canvas.addEventListener('click', e => {
          const lonLat = this.screenXYToLonLat(e.clientX, e.clientY);
          if (lonLat) {
            this.mouseClickPosition[0] = lonLat.lon
            this.mouseClickPosition[1] = lonLat.lat
            this.mouseClickPosition[2] = e.button
          }
        })
        // 右键自定义菜单
        this.viewer.canvas.addEventListener('contextmenu', e => {
          const lonLat = this.screenXYToLonLat(e.clientX, e.clientY);
          if (lonLat) {
            this.mouseClickPosition[0] = lonLat.lon
            this.mouseClickPosition[1] = lonLat.lat
            this.mouseClickPosition[2] = e.button
          }
          this.contextMenuXY.value = [e.clientX, e.clientY];
          this.contextMenuShow.value = true
        })
      }

      // 获取有权限的按钮
      const visibleButtons = sysStore.getVisibleButtons();
      watch(visibleButtons, () => {
        const dctsButtons = visibleButtons.get('sys:dcts');
        if (dctsButtons) {
          this.permissionAbleButtons.value = dctsButtons;
        }
      }, {
        immediate: true
      })

      UseCesium.instance = this
    }
    return UseCesium.instance
  }

  public getViewer() {
    return this.viewer;
  }

  /**
   * 销毁
   */
  public destroy() {
    UseCesium.instance = null
    this.viewer?.destroy()
    this.viewer = null

    this.pointCollection = null
    this.polylineCollection = null
  }

  /**
   * 设置视角到
   * @param lon
   * @param lat
   * @param height
   * @param ifFly
   */
  public setViewTo(lon: number, lat: number, height: number, ifFly = false) {
    if (!this.viewer) {
      return
    }
    if (ifFly) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
      })
    } else {
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
      })
    }
  }

  /**
   * 屏幕坐标转地理坐标
   * @param x
   * @param y
   */
  public screenXYToLonLat(x: number, y: number) {
    const pickedPosition = new Cesium.Cartesian2(x, y);
    // 转为笛卡尔坐标
    const cartesian = this.viewer?.camera.pickEllipsoid(pickedPosition, this.viewer?.scene.globe.ellipsoid);
    if (!cartesian) {
      return null
    }
    // 转为地理坐标
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height;
    return {lon, lat, height}
  }

  /**
   * 获取可视区域的四个角的经纬度坐标（逆时针）
   */
  public getViewCornerCoordinates() {
    if (!this.viewer) {
      return null
    }
    const scene = this.viewer.scene;
    const camera = this.viewer.camera;
    const canvas = this.viewer.canvas;

    if (!scene || !camera || !canvas) {
      return null;
    }

    // 屏幕四个角的像素坐标
    const corners = [
      {x: 0, y: canvas.height},
      {x: canvas.width, y: canvas.height},
      {x: canvas.width, y: 0},
      {x: 0, y: 0},
    ]

    const cartographicCorners: ({ longitude: number, latitude: number })[] = []

    corners.forEach(corner => {
      // 生成射线
      const ray = camera.getPickRay(new Cesium.Cartesian2(corner.x, corner.y));
      if (!ray) {
        return null;
      }
      // 射线与地球表面相交点
      const cartesian = scene.globe.pick(ray, scene);
      if (!cartesian) {
        return null;
      }
      // 转换为经纬度坐标
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      cartographicCorners.push(cartographic);
    });

    for (const cartographicCorner of cartographicCorners) {
      if (!cartographicCorner) {
        return null;
      }
    }

    // 转换为经纬度十进制度数
    return cartographicCorners.map(c => {
      return {
        lon: Cesium.Math.toDegrees(c.longitude),
        lat: Cesium.Math.toDegrees(c.latitude)
      };
    });
  }

  /**
   * 新增点
   * @param obj
   */
  public addPoint(obj: CesiumPoint) {
    if (!this.viewer) {
      return null
    }
    if (!this.pointCollection) {
      return null
    }
    const point = this.pointCollection.add({
      id: obj.id,
      position: Cesium.Cartesian3.fromDegrees(obj.lon, obj.lat),
      color: Cesium.Color.RED,
      pixelSize: 12
    });
    this.pointMap.set(obj.id, point);
    return obj
  }

  /**
   * 修改点
   * @param obj
   */
  public updPoint(obj: CesiumPoint) {
    if (!this.viewer) {
      return null
    }
    const point = this.pointMap.get(obj.id);
    if (!point) {
      return null;
    }
    this.pointMap.set(obj.id, point)
    return obj
  }

  /**
   * 新增线
   * @param obj
   */
  public addLine(obj: CesiumLine) {
    if (!this.viewer) {
      return null
    }
    if (!this.polylineCollection) {
      return null
    }
    const geometry = new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArray(obj.points.map(p => [p.lon, p.lat]).flat()),
      width: 2,
      vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
    });
    const instance = new Cesium.GeometryInstance({
      id: obj.id,
      geometry: geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
      },
    });
    const polyline = this.polylineCollection.add(
        new Cesium.Primitive({
          geometryInstances: instance,
          appearance: new Cesium.PolylineColorAppearance()
        })
    );
    this.polylineMap.set(obj.id, polyline)
    return obj
  }

  /**
   * 修改线
   * @param obj
   */
  public updLine(obj: CesiumLine) {
    if (!this.viewer) {
      return null
    }
    const polyline = this.polylineMap.get(obj.id);
    if (!polyline) {
      return null
    }
    this.polylineMap.set(obj.id, polyline)
    return obj
  }

  /**
   * 批量新增线
   * @param objs
   */
  public addLines(objs: CesiumLine[]) {
    if (!this.viewer) {
      return null
    }
    if (!this.polylineCollection) {
      return null
    }
    const instances: Cesium.GeometryInstance[] = []
    for (const obj of objs) {
      const geometry = new Cesium.PolylineGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray(obj.points.map(p => [p.lon, p.lat]).flat()),
        width: 2,
        vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
      });
      const instance = new Cesium.GeometryInstance({
        id: obj.id,
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE)
        },
      });
      instances.push(instance)
      this.geometryInstanceMap.set(obj.id, instance)
    }
    const primitiveId = idUtils.genId();
    const polyline = this.polylineCollection.add(
        new Cesium.Primitive({
          geometryInstances: instances,
          appearance: new Cesium.PolylineColorAppearance()
        })
    );
    this.polylineMap.set(primitiveId, polyline)
    return objs
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 以下为定制功能 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // 图层是否正在加载
  public layerLoading = ref(false)
  // 右上角的 Loading 通知
  public layerLoadingNotification: NotificationReactive | null = null
  // 右上角的通知内容变化定时器
  public layerLoadingTimer: NodeJS.Timeout | null = null
  // 鼠标点击的位置[经度、纬度、按键]（0左键、2右键）
  public mouseClickPosition = [0, 0, 0]
  // 鼠标移动的位置[经度、纬度]（实时）
  public mouseMovePosition = [0, 0]
  // 右键菜单的显示
  public contextMenuShow = ref(false)
  // 右键菜单的坐标
  public contextMenuXY = ref([0, 0])
  public contextMenus: ContextMenuItem[] = [
    {
      id: 'dcts:signalLight:signalLightGroupInfo:ins',
      func: () => {
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:ins'})
      }
    },
    {
      id: 'close',
      func: () => {
        this.contextMenuShow.value = false
      }
    }
  ]
  public contextMenuOption = computed(() => {
    const ret: Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption> = [
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
    return ret;
  })
  public formPanelTitle = ref('')

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 数据 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
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
  private _allLabels = ref<string[][]>([])
  // 有权限的按钮
  private permissionAbleButtons = ref<string[]>([])

  get allLabels(): string[][] {
    return this._allLabels.value;
  }

  set allLabels(value: string[][]) {
    this._allLabels.value = value;
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 工具函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 设置图层
   */
  public setLayer() {
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

  /**
   * 右键菜单项是否有权限
   * @param perm
   */
  public contextMenuIfHasPermission(perm: string) {
    return userStore.ifLogin && this.permissionAbleButtons.value.includes(perm)
  }
}
