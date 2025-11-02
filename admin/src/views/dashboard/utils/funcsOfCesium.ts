import * as Cesium from "cesium";

/**
 * 计算中心点
 * @param positions
 */
export function computePolygonCenter(positions: Cesium.Cartesian3[]): Cesium.Cartesian3 {
  const center = new Cesium.Cartesian3();
  for (let i = 0; i < positions.length; i++) {
    Cesium.Cartesian3.add(center, positions[i], center);
  }
  Cesium.Cartesian3.divideByScalar(center, positions.length, center);
  return center;
}
