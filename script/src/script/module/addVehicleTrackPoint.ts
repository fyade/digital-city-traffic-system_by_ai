import { Injectable } from "@nestjs/common";
import { request } from "../../api/request";
import { numberUtils } from "@dcts/common";

@Injectable()
export class AddVehicleTrackPointModule {
  async main() {
    console.info('正在请求路网数据')
    const res = await request<{
      allRoads: { osm_id: string, name: string | null, highway: string | null, motorcar: null, way: string }[]
    }>({
      url: '/dcts/spatial-data/nodes-with-ways-in-polygon',
      method: 'POST',
      data: {
        points: [
          {"lon": 118.86151992827578, "lat": 32.06867789973003},
          {"lon": 118.98386000269642, "lat": 32.0686779440421},
          {"lon": 118.98391025796168, "lat": 32.144299040358405},
          {"lon": 118.86146977500331, "lat": 32.144299020691896},
          {"lon": 118.86151992827578, "lat": 32.06867789973003},
        ]
      }
    });
    console.info('路网数据请求完成')
    const roads = res.data.allRoads.map(item => this.getLonlatFromWay(item.way));

    const chunkNum = 120 * 30
    const date = ['2025', '09', '02']

    const start = new Date(`${date[0]}-${date[1]}-${date[2]}T00:00:00.000Z`).getTime() - 1000 * 60 * 60 * 8
    const end = new Date(`${date[0]}-${date[1]}-${date[2]}T23:59:59.000Z`).getTime() - 1000 * 60 * 60 * 8
    const results: ReturnType<typeof this.generatePositions>[][] = []
    for (let i = 0; i < (1000 * 60 * 60 * 24) / (1000 * 5); i++) {
      const index = i % chunkNum;
      if (!results[index]) {
        results.push([])
      }
      const road = roads[numberUtils.randomNumber(0, roads.length - 1)];
      const speed = numberUtils.randomNumber(10, 40);
      const time = new Date(numberUtils.randomNumber(start, end))
      const positions = this.generatePositions(road, speed, time);
      results[index].push(positions)
    }
    let str = '分片大小'
    console.info(`共${results.length}个分片`)
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      // 计算大小
      const jsonString = JSON.stringify(result);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = sizeInBytes / 1024;
      const sizeInMB = sizeInKB / 1024;
      if (str.length > 0) {
        str += '__'
      }
      str += `${i + 1}-${sizeInMB.toFixed(3)}MB`
    }
    console.info(str)

    let str2 = '上传成功分片'
    let str3 = '上传失败分片'
    console.info(`共${results.length}个分片`)
    for (let i = 0; i < results.length; i++) {
      console.info(`正在上传第${i + 1}/${results.length}个分片`)
      try {
        await request({
          url: '/dcts/external/add-vehicle-track-point',
          method: 'POST',
          data: {
            datas: results[i]
          }
        });
        if (str2.length > 0 && !str2.endsWith('_')) {
          str2 += '__'
        }
        str2 += `${i + 1}`
      } catch (e) {
        if (str3.length > 0 && !str3.endsWith('_')) {
          str3 += '__'
        }
        str3 += `${i + 1}`
      }
    }
    console.info(str2);
    console.info(str3);
  }

  private getLonlatFromWay(way: string) {
    return way.replace('LINESTRING(', '').replace(')', '').split(',').map(str => str.split(' ').map(Number)) as [number, number][]
  }

  /**
   * 计算两点间的球面距离 (米)
   */
  private haversineDistance(p1: [number, number], p2: [number, number]): number {
    const R = 6371000; // 地球半径 (m)
    const toRad = (d: number) => (d * Math.PI) / 180;

    const dLat = toRad(p2[1] - p1[1]);
    const dLng = toRad(p2[0] - p1[0]);
    const lat1 = toRad(p1[1]);
    const lat2 = toRad(p2[1]);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 计算两点的航向角 (度)
   */
  private bearing(p1: [number, number], p2: [number, number]): number {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    const lat1 = toRad(p1[1]);
    const lat2 = toRad(p2[1]);
    const dLng = toRad(p2[0] - p1[0]);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360; // 0–360
  }

  private generatePositions(
      path: [number, number][],
      speedKmh: number,
      startTime: Date
  ): { time: number; position: [number, number]; heading: number }[] {
    if (path.length < 2) return [];

    const speedMps = (speedKmh * 1000) / 3600; // m/s

    // 预计算每段长度 & 累计长度
    const distances: number[] = [];
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const d = this.haversineDistance(path[i], path[i + 1]);
      distances.push(d);
      totalDistance += d;
    }

    const totalSeconds = Math.floor(totalDistance / speedMps);
    const result: { time: number; position: [number, number]; heading: number }[] = [];

    let segIndex = 0;
    let segStartDist = 0; // 当前段起点累计距离
    let segEndDist = distances[0];

    for (let t = 0; t <= totalSeconds; t++) {
      const traveled = t * speedMps;

      // 找到当前所处的路段
      while (traveled > segEndDist && segIndex < distances.length - 1) {
        segIndex++;
        segStartDist = segEndDist;
        segEndDist += distances[segIndex];
      }

      const ratio =
          (traveled - segStartDist) / (segEndDist - segStartDist || 1);

      const p1 = path[segIndex];
      const p2 = path[segIndex + 1];

      // 线性插值求当前位置
      const lng = p1[0] + (p2[0] - p1[0]) * ratio;
      const lat = p1[1] + (p2[1] - p1[1]) * ratio;

      // 航向角：如果还没到段末，就用 p1→p2；如果在最后一秒，就用最后一段
      const heading = this.bearing(p1, p2);

      result.push({
        time: new Date(startTime.getTime() + t * 1000).getTime(),
        position: [lng, lat],
        heading,
      });
    }

    return result;
  }
}
