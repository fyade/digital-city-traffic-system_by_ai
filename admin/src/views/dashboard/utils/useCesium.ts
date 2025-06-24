import * as Cesium from "cesium";

/**
 * 大屏页面的Cesium
 */
export class UseCesium {
  private static instance: UseCesium | null = null
  private viewer: Cesium.Viewer | null = null

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
    if (ifFly) {
      this.viewer?.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
      })
    } else {
      this.viewer?.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
      })
    }
  }

  /**
   * 获取可视区域的四个角的经纬度坐标（逆时针）
   */
  public getViewCornerCoordinates() {
    const scene = this.viewer?.scene;
    const camera = this.viewer?.camera;
    const canvas = this.viewer?.canvas;

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

  public addPoint() {
  }

  public updPoint() {
  }

  public delPoint() {
  }

  public addLine() {
  }

  public updLine() {
  }

  public delLine() {
  }
}
