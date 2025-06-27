import * as Cesium from "cesium";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { adminConfig } from "@dcts/config";
import { idUtils } from "@dcts/common";

const currentConfig = adminConfig.currentConfig();

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
    if (!UseCesium.instance) {
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
      }

      UseCesium.instance = this
    }
    return UseCesium.instance
  }

  public getViewer() {
    return this.viewer;
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
}
