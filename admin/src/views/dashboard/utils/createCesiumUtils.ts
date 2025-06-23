import * as Cesium from "cesium";

let createdCesiumUtils: ReturnType<typeof createCesiumUtils> | null = null

// 获取Cesium工具函数
export const getCesiumUtils = () => {
  return createdCesiumUtils
}

// 创建Cesium工具函数
export const createCesiumUtils = (viewer: Cesium.Viewer) => {
  const retObj = {
    /**
     * 设置视角到
     * @param lon
     * @param lat
     * @param height
     * @param ifFly
     */
    setViewTo: (lon: number, lat: number, height: number, ifFly = false): void => {
      if (ifFly) {
        viewer?.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
        })
      } else {
        viewer?.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
        })
      }
    },
    /**
     * 获取可视区域的四个角的经纬度坐标
     */
    getViewCornerCoordinates: () => {
      const scene = viewer?.scene;
      const camera = viewer?.camera;
      const canvas = viewer?.canvas;

      if (!scene || !camera || !canvas) {
        return
      }

      // 屏幕四个角的像素坐标
      // const corners = [
      //   {x: 0, y: 0},
      //   {x: canvas.width, y: 0},
      //   {x: canvas.width, y: canvas.height},
      //   {x: 0, y: canvas.height},
      // ]
      const corners = [
        {x: 0, y: canvas.height},
        {x: canvas.width, y: canvas.height},
        {x: canvas.width, y: 0},
        {x: 0, y: 0},
      ]

      const cartographicCorners: (null | { longitude: number, latitude: number })[] = []

      corners.forEach(corner => {
        // 生成射线
        const ray = camera.getPickRay(new Cesium.Cartesian2(corner.x, corner.y));
        if (!ray) {
          cartographicCorners.push(null);
          return;
        }
        // 射线与地球表面相交点
        const cartesian = scene.globe.pick(ray, scene);
        if (!cartesian) {
          cartographicCorners.push(null);
          return;
        }
        // 转换为经纬度坐标
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        cartographicCorners.push(cartographic);
      });

      // 转换为经纬度十进制度数
      return cartographicCorners.map(c => {
        if (!c) return null;
        return {
          lon: Cesium.Math.toDegrees(c.longitude),
          lat: Cesium.Math.toDegrees(c.latitude)
        };
      });
    }
  }
  createdCesiumUtils = retObj
  return retObj
}
