import * as Cesium from "cesium";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { adminConfig } from "@dcts/config";
import { timeUtils } from "@dcts/common";
import { final } from "@/utils/base.ts";
import { useUserStore } from "@/store/module/user.ts";

const currentConfig = adminConfig.currentConfig();

/**
 * 通用 Cesium 类
 */
export class UseCesium {
  private static instance: UseCesium | null = null
  protected viewer: Cesium.Viewer | null = null
  private pointCollection: Cesium.PointPrimitiveCollection | null = null
  private pointMap: Map<string, Cesium.PointPrimitive> | null = null
  private polylineCollection: Cesium.PrimitiveCollection | null = null
  private polylineMap: Map<string, Cesium.Primitive> | null = null

  private userStore = useUserStore()

  constructor() {
    if (!UseCesium.instance) {
      UseCesium.instance = this
    }
    return UseCesium.instance
  }

  /**
   * 初始化
   * @protected
   */
  protected init() {
    if (this.viewer) {
      // 初始化点的集合
      this.pointCollection = this.viewer.scene.primitives.add(
          new Cesium.PointPrimitiveCollection()
      )
      this.pointMap = new Map<string, Cesium.PointPrimitive>()

      // 初始化线的集合
      this.polylineCollection = this.viewer.scene.primitives.add(
          new Cesium.PrimitiveCollection()
      )
      this.polylineMap = new Map<string, Cesium.Primitive>()
    }

    document.addEventListener('visibilitychange', this._documentVisibilitychangeCB)
  }

  /**
   * 销毁
   */
  public destroy() {
    UseCesium.instance = null
    if (this.viewer) {
      this.viewer.destroy()
    }
    this.viewer = null

    this.pointCollection = null
    this.pointMap = null
    this.polylineCollection = null
    this.polylineMap = null

    document.removeEventListener('visibilitychange', this._documentVisibilitychangeCB)
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 通用工具函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 设置视角到
   * @param lon
   * @param lat
   * @param height
   * @param ifFly
   */
  public setViewTo(lon: number, lat: number,
                   {
                     height,
                     ifFly = false
                   }: {
                     height?: number
                     ifFly?: boolean
                   } = {}
  ) {
    if (!this.viewer) {
      return
    }
    if (ifFly) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height || this.cameraHeight),
        duration: 0.5
      })
    } else {
      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height || this.cameraHeight)
      })
    }
  }

  /**
   * 屏幕坐标转地理坐标
   * @param x
   * @param y
   */
  public screenXYToLonLat(x: number, y: number) {
    if (!this.viewer) {
      return null
    }
    const pickedPosition = new Cesium.Cartesian2(x, y);
    // 转为笛卡尔坐标
    const cartesian = this.viewer.camera.pickEllipsoid(pickedPosition, this.viewer.scene.globe.ellipsoid);
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
   * 获取屏幕中心地理坐标
   */
  public centerLonLat() {
    if (!this.viewer) {
      return null
    }
    return this.screenXYToLonLat(this.viewer.canvas.width / 2, this.viewer.canvas.height / 2);
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
    if (cartographicCorners.length < 3) {
      return null;
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
   * 获取实体的经纬度坐标
   * @param entityId
   */
  public getEntityLonLatHeight(entityId: string) {
    if (!this.viewer || !entityId) {
      return null
    }
    const entity = this.viewer.entities.getById(entityId);
    if (!entity || !entity.position) {
      return null;
    }
    const position = entity.position.getValue(this.viewer.clock.currentTime);
    if (!position) {
      return null
    }
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    return {
      lon: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
      height: cartographic.height,
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 通用基础对象函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
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
    if (!this.pointMap) {
      return null
    }
    const colorWithOpacity = Cesium.Color.fromAlpha(obj.color, obj.opacity)
    const point = this.pointCollection.add({
      id: obj.id,
      position: Cesium.Cartesian3.fromDegrees(obj.lon, obj.lat, obj.height),
      color: colorWithOpacity,
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
    this.delPoint(obj.id)
    this.addPoint(obj)
    return obj
  }

  /**
   * 删除点
   * @param ids
   */
  public delPoint(...ids: string[]) {
    if (!this.pointCollection) {
      return
    }
    if (!this.pointMap) {
      return
    }
    for (const id of ids) {
      const point = this.pointMap.get(id);
      if (point) {
        this.pointCollection.remove(point);
        this.pointMap.delete(id);
      }
    }
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
    if (!this.polylineMap) {
      return null
    }
    const colorWithOpacity = Cesium.Color.fromAlpha(obj.color, obj.opacity);
    const geometry = new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(obj.points.map(p => [p.lon, p.lat, p.height]).flat()),
      width: 2,
      vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
    });
    const instance = new Cesium.GeometryInstance({
      id: obj.id,
      geometry: geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(colorWithOpacity)
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
    this.delLine(obj.id)
    this.addLine(obj)
    return obj
  }

  /**
   * 删除线
   * @param ids
   */
  public delLine(...ids: string[]) {
    if (!this.polylineCollection) {
      return
    }
    if (!this.polylineMap) {
      return
    }
    for (const id of ids) {
      const line = this.polylineMap.get(id);
      if (line) {
        this.polylineCollection.remove(line);
        this.polylineMap.delete(id);
      }
    }
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 硬件状态变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // 鼠标左键是否按下
  private MOUSE_LEFT_DOWN = false
  // 鼠标右键是否按下
  private MOUSE_RIGHT_DOWN = false

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 地图通用变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  // 鼠标点击的位置[经度、纬度、按键]（0左键、2右键）
  public mouseClickPosition: [number, number, number] = [0, 0, 0]
  // 鼠标移动的位置[经度、纬度]（实时）
  public mouseMovePosition: [number, number] = [0, 0]
  // 鼠标点击的位置[x, y]
  public mouseClickPositionXY: [number, number] = [0, 0]
  // 鼠标移动的位置[x, y]
  public mouseMovePositionXY: [number, number] = [0, 0]
  // 相机高度
  public cameraHeight = 10000
  // 地图中心点位置[经度、纬度]
  public mapCenterPosition: [number, number] = [118.92269000122111, 32.10650387256775]
  // 当前聚焦的实体
  private _trackedEntityId: string | null = null
  get trackedEntityId(): string | null {
    return this._trackedEntityId;
  }

  set trackedEntityId(value: string | null) {
    this._trackedEntityId = value;
  }

  // 鼠标按下时的位置
  public mouseDownPosition: 'timeline' | 'canvas' | null = null

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件封装 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 设置容器
   * @param container
   */
  public setContainer(container: string) {
    const ifAdminLogin = this.userStore.getLoginType() === 'admin';
    this.viewer = new Cesium.Viewer(container, {
      infoBox: false, // 属性面板
      selectionIndicator: false, // 选择指示器
      geocoder: false, // 搜索框
      homeButton: false, // 主页按钮
      sceneModePicker: false, // 场景模式选择器
      baseLayerPicker: false, // 底图选择器
      navigationHelpButton: false, // 帮助按钮
      animation: false, // 动画控制器
      shouldAnimate: true, // 自动播放
      timeline: true, // 时间轴
      fullscreenButton: false, // 全屏按钮
    });
    (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
    if (!ifAdminLogin) {
      (this.viewer.timeline.container as HTMLElement).style.display = "none";
    }
    // this.viewer.animation.viewModel.dateFormatter = time => timeUtils.formatDate(Cesium.JulianDate.toDate(time), 'YYYY-MM-DD');
    // this.viewer.animation.viewModel.timeFormatter = time => timeUtils.formatDate(Cesium.JulianDate.toDate(time), 'HH:mm:ss');
    this.viewer.timeline.makeLabel = time => timeUtils.formatDate(Cesium.JulianDate.toDate(time));

    if (currentConfig.VITE_MODE === final.DEV) {
      this.viewer.scene.debugShowFramesPerSecond = true
    }

    const cameraController = this.viewer.scene.screenSpaceCameraController;
    cameraController.minimumZoomDistance = 500 // 最小高度
    cameraController.maximumZoomDistance = 1000000 // 最大高度
    cameraController.maximumTiltAngle = Math.PI / 180 * 45 // 最大俯仰角

    this.setViewTo(this.mapCenterPosition[0], this.mapCenterPosition[1], {height: this.cameraHeight})

    // 获取默认的影像图层
    const defaultImagery = this.viewer.imageryLayers.get(0);
    // 移除默认图层
    this.viewer.imageryLayers.remove(defaultImagery);


    const cesiumViewerTimelineContainer = document.querySelector('.cesium-viewer-timelineContainer') as HTMLElement | null;
    if (cesiumViewerTimelineContainer) {
      cesiumViewerTimelineContainer.addEventListener('mousedown', this.cesiumViewerTimelineContainerMousedownCB.bind(this))
      cesiumViewerTimelineContainer.addEventListener('mouseup', this.cesiumViewerTimelineContainerMouseupCB.bind(this))
    }

    this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEndCB.bind(this))
    this.viewer.clock.onStop.addEventListener(this.clockOnStopCB.bind(this))
    this.viewer.clock.onTick.addEventListener(this.clockOnTickCB.bind(this))
    this.viewer.scene.globe.tileLoadProgressEvent.addEventListener(this.globeTileLoadProgressEventCB.bind(this))

    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction(this.ScreenSpaceEventTypeLeftDownCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(this.ScreenSpaceEventTypeLeftUpCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_UP)
    handler.setInputAction(this.ScreenSpaceEventTypeRightDownCB.bind(this), Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    handler.setInputAction(this.ScreenSpaceEventTypeRightUpCB.bind(this), Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    handler.setInputAction(this.ScreenSpaceEventTypeLeftClickCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(this.ScreenSpaceEventTypeRightClickCB.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    handler.setInputAction(this.ScreenSpaceEventTypeLeftDoubleClickCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    handler.setInputAction(this.ScreenSpaceEventTypeMouseMoveCB.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(this.ScreenSpaceEventTypeWheelCB.bind(this), Cesium.ScreenSpaceEventType.WHEEL)

    this.init()
  }

  /**
   * 页面可见性变化
   * @private
   */
  private _documentVisibilitychangeCB = this.documentVisibilitychangeCB.bind(this)

  /**
   * 页面可见性变化
   * @protected
   */
  protected documentVisibilitychangeCB() {
  }

  /**
   * 时间轴鼠标按下事件
   * @param e
   * @protected
   */
  protected cesiumViewerTimelineContainerMousedownCB(e: MouseEvent) {
    this.mouseDownPosition = 'timeline'
  }

  /**
   * 时间轴鼠标抬起事件
   * @param e
   * @protected
   */
  protected cesiumViewerTimelineContainerMouseupCB(e: MouseEvent) {
  }

  /**
   * 相机移动结束事件
   * @protected
   */
  protected cameraMoveEndCB() {
    const centerLonLat1 = this.centerLonLat();
    if (centerLonLat1) {
      this.mapCenterPosition[0] = centerLonLat1.lon
      this.mapCenterPosition[1] = centerLonLat1.lat
    }
    if (this.viewer) {
      this.cameraHeight = this.viewer.camera.positionCartographic.height
    }
  }

  /**
   * 时钟停止事件
   * @protected
   */
  protected clockOnStopCB() {
  }

  /**
   * 时钟周期事件
   * @protected
   */
  protected clockOnTickCB() {
  }

  /**
   * 瓦片图层加载事件
   * @param queuedTileCount
   * @protected
   */
  protected globeTileLoadProgressEventCB(queuedTileCount: number) {
  }

  /**
   * 鼠标左键按下
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeLeftDownCB() {
    this.MOUSE_LEFT_DOWN = true
    this.mouseDownPosition = 'canvas'
  }

  /**
   * 鼠标左键抬起
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeLeftUpCB() {
    this.MOUSE_LEFT_DOWN = false
  }

  /**
   * 鼠标右键按下
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeRightDownCB() {
    this.MOUSE_RIGHT_DOWN = true
    this.mouseDownPosition = 'canvas'
  }

  /**
   * 鼠标右键抬起
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeRightUpCB() {
    this.MOUSE_RIGHT_DOWN = false
  }

  /**
   * 左键点击
   * @param m
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeLeftClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    this.mouseClickPositionXY[0] = m.position.x
    this.mouseClickPositionXY[1] = m.position.y
    const lonLat = this.screenXYToLonLat(m.position.x, m.position.y);
    if (lonLat) {
      this.mouseClickPosition[0] = lonLat.lon
      this.mouseClickPosition[1] = lonLat.lat
      this.mouseClickPosition[2] = 0
    }
    this.ScreenSpaceEventTypeClickCB()
  }

  /**
   * 右键点击
   * @param m
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeRightClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
    this.mouseClickPositionXY[0] = m.position.x
    this.mouseClickPositionXY[1] = m.position.y
    const lonLat = this.screenXYToLonLat(m.position.x, m.position.y);
    if (lonLat) {
      this.mouseClickPosition[0] = lonLat.lon
      this.mouseClickPosition[1] = lonLat.lat
      this.mouseClickPosition[2] = 2
    }
    this.ScreenSpaceEventTypeClickCB()
  }

  /**
   * 左键双击
   * @param m
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeLeftDoubleClickCB(m: Cesium.ScreenSpaceEventHandler.PositionedEvent) {
  }

  /**
   * 鼠标移动
   * @param m
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeMouseMoveCB(m: Cesium.ScreenSpaceEventHandler.MotionEvent) {
    this.mouseMovePositionXY[0] = m.endPosition.x
    this.mouseMovePositionXY[1] = m.endPosition.y
    const lonLat = this.screenXYToLonLat(m.endPosition.x, m.endPosition.y);
    if (lonLat) {
      this.mouseMovePosition[0] = lonLat.lon
      this.mouseMovePosition[1] = lonLat.lat
    }
  }

  /**
   * 缩放
   * @param m
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeWheelCB(m: number) {
  }

  /**
   * 左键及右键点击
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeClickCB() {
  }

  /**
   * 聚焦实体
   * @param entityId
   */
  public trackEntity(entityId: string | null) {
    if (!this.viewer) {
      return
    }
    if (entityId) {
      const entity = this.viewer.entities.getById(entityId);
      if (!entity) {
        return;
      }
      this.viewer.trackedEntity = entity
    } else {
      this.trackedEntityId = null
      this.viewer.trackedEntity = void 0
      this.setViewTo(this.mapCenterPosition[0], this.mapCenterPosition[1], {height: this.cameraHeight})
    }

    this.trackedEntityId = this.viewer.trackedEntity ? this.viewer.trackedEntity.id : null
    if (this.trackedEntityId) {
      const lonLatHeight = this.getEntityLonLatHeight(this.trackedEntityId);
      if (!lonLatHeight) {
        return;
      }
      this.setViewTo(lonLatHeight.lon, lonLatHeight.lat, {height: this.cameraHeight, ifFly: true})
    }
  }
}
