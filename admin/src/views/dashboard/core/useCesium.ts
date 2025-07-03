import * as Cesium from "cesium";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { adminConfig } from "@dcts/config";
import { idUtils } from "@dcts/common";

const currentConfig = adminConfig.currentConfig();

/**
 * 通用 Cesium 类
 */
export class UseCesium {
  private static instance: UseCesium | null = null
  protected viewer: Cesium.Viewer | null = null
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
        this.setContainer(container)
      }

      UseCesium.instance = this
    }
    return UseCesium.instance
  }

  public getViewer() {
    return this.viewer;
  }

  protected init() {
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 通用工具函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
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
    // 转换为经纬度十进制度数
    return cartographicCorners.map(c => {
      return {
        lon: Cesium.Math.toDegrees(c.longitude),
        lat: Cesium.Math.toDegrees(c.latitude)
      };
    });
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
  public mapCenterPosition: [number, number] = [118.92844631852402, 32.12752744546319]

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 事件封装 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
  /**
   * 设置容器
   * @param container
   */
  public setContainer(container: string) {
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

    this.setViewTo(this.mapCenterPosition[0], this.mapCenterPosition[1], this.cameraHeight)

    // 获取默认的影像图层
    const defaultImagery = this.viewer.imageryLayers.get(0);
    // 移除默认图层
    this.viewer.imageryLayers.remove(defaultImagery);


    this.viewer.scene.globe.tileLoadProgressEvent.addEventListener(this.globeTileLoadProgressEventCB.bind(this))
    this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEndCB.bind(this))

    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
    handler.setInputAction(this.ScreenSpaceEventTypeLeftDownCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(this.ScreenSpaceEventTypeLeftUpCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_UP)
    handler.setInputAction(this.ScreenSpaceEventTypeRightDownCB.bind(this), Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    handler.setInputAction(this.ScreenSpaceEventTypeRightUpCB.bind(this), Cesium.ScreenSpaceEventType.RIGHT_DOWN)
    handler.setInputAction(this.ScreenSpaceEventTypeLeftClickCB.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(this.ScreenSpaceEventTypeRightClickCB.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    handler.setInputAction(this.ScreenSpaceEventTypeMouseMoveCB.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction(this.ScreenSpaceEventTypeWheelCB.bind(this), Cesium.ScreenSpaceEventType.WHEEL)

    this.init()
  }

  /**
   * 瓦片图层加载事件
   * @param queuedTileCount
   * @protected
   */
  protected globeTileLoadProgressEventCB(queuedTileCount: number) {
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
   * 鼠标左键按下
   * @constructor
   * @protected
   */
  protected ScreenSpaceEventTypeLeftDownCB() {
    this.MOUSE_LEFT_DOWN = true
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
}
