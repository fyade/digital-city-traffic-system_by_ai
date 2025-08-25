import * as Cesium from "cesium";
import arrowUrl from '../../../assets/images2/array.png'
import arrowUrl2 from '../../../assets/images2/arrow2.png'
import { geoUtils, timeUtils } from "@dcts/common";
import { ChucanDto, RucanDto } from "@/views/dashboard/debugPanel/index.ts";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";

/**
 * debug模块
 */
export class DebugModule {
  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private addLine: ((obj: CesiumLine) => CesiumLine | null) | null = null

  public setAddLine(func: (obj: CesiumLine) => CesiumLine | null) {
    this.addLine = func
  }

  private addPoint: ((obj: CesiumPoint) => CesiumPoint | null) | null = null

  public setAddPoint(func: (obj: CesiumPoint) => CesiumPoint | null) {
    this.addPoint = func
  }

  private setViewTo: ((lon: number, lat: number, obj?: { height?: number, ifFly?: boolean }) => void) | null = null

  public setSetViewTo(func: (lon: number, lat: number, obj?: { height?: number, ifFly?: boolean }) => void) {
    this.setViewTo = func
  }
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  public sf1(data: RucanDto) {
    if (!this.viewer || !this.addLine || !this.addPoint || !this.setViewTo) {
      return
    }
    this.setViewTo((data.startPoint.lon + data.endPoint.lon) / 2, (data.startPoint.lat + data.endPoint.lat) / 2, {ifFly: true})
    const allRoads = data.allRoads
        .map(road => road.way
            .replace('LINESTRING(', '')
            .replace(')', '')
            .split(',')
            .map(item => item.split(' ').map(Number))
            .map(point => new CesiumPoint({lon: point[0], lat: point[1]}))
        )
        .map(points => new CesiumLine({points: points, color: Cesium.Color.BLACK}))
    for (const road of allRoads) {
      this.addLine(road)
    }
    const allNodes = data.allNodes
        .map(node => new CesiumPoint({lon: node.lon, lat: node.lat, color: Cesium.Color.BLACK}))
    for (const node of allNodes) {
      this.addPoint(node)
    }

    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(data.startPoint.lon, data.startPoint.lat, 1),
      label: {
        text: `起点 ${timeUtils.formatDate(new Date(data.startTime))}`,
        font: '14pt sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP // 文字基准点
      }
    });
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(data.endPoint.lon, data.endPoint.lat, 1),
      label: {
        text: '终点',
        font: '14pt sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.TOP // 文字基准点
      }
    });
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(data.startPoint.lon, data.startPoint.lat, 0.9),
      billboard: {
        image: arrowUrl2,
        width: 42,
        height: 42,
        scale: 1.0,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM // 图片对齐方式
      }
    });
    this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(data.endPoint.lon, data.endPoint.lat, 0.9),
      billboard: {
        image: arrowUrl2,
        width: 42,
        height: 42,
        scale: 1.0,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM // 图片对齐方式
      }
    });
  }

  public sf2(data: ChucanDto) {
    if (!this.viewer || !this.addLine || !this.addPoint) {
      return
    }
    const allRoads = data.roads
        .map(road => road.way
            .replace('LINESTRING(', '')
            .replace(')', '')
            .split(',')
            .map(item => item.split(' ').map(Number))
            .map(point => new CesiumPoint({lon: point[0], lat: point[1], height: 1}))
        )
        .map(points => new CesiumLine({points: points, color: Cesium.Color.WHITE}))
    for (const road of allRoads) {
      this.addLine(road)
    }
    const allNodes = data.nodes
        .map(node => new CesiumPoint({lon: node.lon, lat: node.lat, height: 1, color: Cesium.Color.WHITE}))
    for (let i = 0; i < data.nodes.length; i++) {
      this.addPoint(allNodes[i])
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(allNodes[i].lon, allNodes[i].lat, 1),
        label: {
          text: `途径时间${timeUtils.formatDate(new Date(data.nodes[i].time[0]))}-${timeUtils.formatDate(new Date(data.nodes[i].time[1]))}`,
          font: '14pt sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, 0),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.TOP // 文字基准点
        }
      });
    }
  }

  /**
   * 小车跟随导航轨迹绘制
   * @constructor
   */
  public cesiumModelPathAnimation() {
    if (!this.viewer) {
      return
    }

    const lujin0: [number, number, number][] = [
      [118.92438099512003, 32.09993580742475, 0],
      [118.92716463218643, 32.096260145640755, 0],
      [118.9234542758118, 32.09020514377874, 0],
      [118.9220677248058, 32.08924855616345, 0],
      [118.91968878123386, 32.08804390837116, 0],
      [118.91788963775954, 32.08758337716926, 0],
      [118.91310611927477, 32.09386060865487, 0],
      [118.9170490373999, 32.095969995945616, 0]
    ]
    const lujin = lujin0.map(arr => [arr[0], arr[1]]).flat()

    const positions = Cesium.Cartesian3.fromDegreesArray(lujin)

    // 绘制深绿色边框
    this.viewer.entities.add({
      polyline: {
        positions: positions,
        width: 10,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Cesium.Color.DARKGREEN.withAlpha(0.8)
        }),
        clampToGround: true
      }
    })
    // 绘制浅绿色中心线
    this.viewer.entities.add({
      polyline: {
        positions: positions,
        width: 6,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.LIGHTGREEN.withAlpha(0.9)
        }),
        clampToGround: true
      }
    })
    // 沿路径等距插值生成箭头位置
    // const arrowSpacing = 100
    // for (let i = 0; i < positions.length - 1; i++) {
    //   const start = positions[i]
    //   const emd = positions[i + 1]
    //   const distance = Cesium.Cartesian3.distance(start, emd)
    //   // 分段插值点
    //   const segmentCount = Math.floor(distance / arrowSpacing)
    //   for (let j = 0; j < segmentCount; j++) {
    //
    //   }
    // }
    // 起点
    this.viewer.entities.add({
      name: '起点',
      position: Cesium.Cartesian3.fromDegrees(lujin[0], lujin[1]),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 15,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      },
      label: {
        text: '起点',
        font: '14px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10) // 文字偏移
      }
    });
    // 终点
    this.viewer.entities.add({
      name: '终点',
      position: Cesium.Cartesian3.fromDegrees(lujin[lujin.length - 2], lujin[lujin.length - 1]),
      point: {
        color: Cesium.Color.GREEN,
        pixelSize: 15,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
      },
      label: {
        text: '终点',
        font: '14px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10)
      }
    });
    // 3. 模拟车辆位置（蓝色点）
    const carPosition = Cesium.Cartesian3.fromDegrees(lujin[0], lujin[1]); // 初始位置设为起点
    const carEntity = this.viewer.entities.add({
      name: '车辆',
      position: carPosition,
      point: {
        color: Cesium.Color.BLUE,
        pixelSize: 12,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 1
      },
      label: {
        text: '车辆',
        font: '12px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 1,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -8)
      }
    });

    // 1. 准备路径数据（过滤掉高度信息，只保留经纬度）
    const pathPoints: [number, number][] = lujin0.map(arr => [arr[0], arr[1]]);

    // 2. 计算路径总长度（使用Haversine公式）
    const pathLength = geoUtils.calculatePathLengthHaversine(pathPoints);

    // 3. 转换路径为Cesium Cartesian3数组（包含高度）
    const pathPositions = lujin0.map(point =>
        Cesium.Cartesian3.fromDegrees(point[0], point[1])
    );

    // 4. 计算各段长度（用于后续插值）
    const segmentLengths: number[] = [];
    for (let i = 0; i < pathPoints.length - 1; i++) {
      segmentLengths.push(
          geoUtils.calculatePathLengthHaversine([pathPoints[i], pathPoints[i + 1]])
      );
    }

    // 5. 车辆移动逻辑（每秒1米）
    let distanceMoved = 0; // 已移动距离（米）
    const speed = 5; // 速度：米/秒

    function moveCar() {
      distanceMoved += speed;

      // 如果到达终点，重置到起点
      if (distanceMoved >= pathLength) {
        distanceMoved = 0;
        carEntity.position = new Cesium.ConstantPositionProperty(pathPositions[0]);
        setTimeout(moveCar, 1000);
        return;
      }

      // 计算当前所在的路径段
      let accumulatedLen = 0;
      let segmentIndex = 0;
      for (; segmentIndex < segmentLengths.length; segmentIndex++) {
        if (accumulatedLen + segmentLengths[segmentIndex] >= distanceMoved) break;
        accumulatedLen += segmentLengths[segmentIndex];
      }

      // 在当前段内插值
      const segmentStart = pathPositions[segmentIndex];
      const segmentEnd = pathPositions[segmentIndex + 1];
      const segmentProgress = (distanceMoved - accumulatedLen) / segmentLengths[segmentIndex];
      const newPosition = Cesium.Cartesian3.lerp(
          segmentStart,
          segmentEnd,
          segmentProgress,
          new Cesium.Cartesian3()
      );

      // 更新车辆位置和方向
      carEntity.position = new Cesium.ConstantPositionProperty(newPosition);

      // 计算方向（朝向路径切线）
      const tangent = Cesium.Cartesian3.subtract(segmentEnd, segmentStart, new Cesium.Cartesian3());
      const heading = Math.atan2(tangent.y, tangent.x);
      if (carEntity.billboard) {
        carEntity.billboard.rotation = new Cesium.ConstantProperty(heading - Cesium.Math.PI_OVER_TWO);
      }

      // 继续移动
      setTimeout(moveCar, 1000);
    }

    // 6. 开始移动
    moveCar();
  }
}
