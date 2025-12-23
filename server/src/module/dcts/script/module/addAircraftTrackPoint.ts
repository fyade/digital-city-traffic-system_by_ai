import { Injectable } from "@nestjs/common";
import { geoUtils, numberUtils } from '@dcts/common'
import { request } from "../../../../api/requestDcts";

@Injectable()
export class AddAircraftTrackPointModule {
  async main() {
    const _points = [
      {"lon": 118.86151992827578, "lat": 32.06867789973003},
      {"lon": 118.98386000269642, "lat": 32.0686779440421},
      {"lon": 118.98391025796168, "lat": 32.144299040358405},
      {"lon": 118.86146977500331, "lat": 32.144299020691896},
    ]
    const reqData: {
      datas: { lon: number, lat: number, height: number, time: number, heading: number, index: number }[]
      end: boolean
    } = {
      datas: [],
      end: false
    }
    const dataCount = 2
    for (let i = 0; i < dataCount; i++) {
      const pointNum = numberUtils.randomNumber(3, 10);
      const trackPoints: [number, number][] = []
      for (let j = 0; j < pointNum; j++) {
        const lon = _points[0].lon + (_points[2].lon - _points[0].lon) * numberUtils.randomNumber(0, 1, 4);
        const lat = _points[0].lat + (_points[2].lat - _points[0].lat) * numberUtils.randomNumber(0, 1, 4);
        trackPoints.push([lon, lat])
      }
      const now_ = new Date()
      now_.setHours(0, 0, 0, 0)
      let now = now_.getTime() + numberUtils.randomNumber(0, 1000 * 60 * 60 * 24)
      const height = numberUtils.randomNumber(0, 500, 2)
      for (let j = 1; j < trackPoints.length; j++) {
        const startPoint = trackPoints[j - 1];
        const endPoint = trackPoints[j];
        const distance = geoUtils.haversineDistance(startPoint, endPoint);
        // 米/秒
        const speed = numberUtils.randomNumber(1, 10, 2);
        const second = Math.floor(distance / speed)
        const h = numberUtils.randomNumber(-10, 10, 2)
        const allPoints: [number, number][] = []
        for (let k = 0; k < second; k++) {
          allPoints.push([
            startPoint[0] + (endPoint[0] - startPoint[0]) * (k / second),
            startPoint[1] + (endPoint[1] - startPoint[1]) * (k / second),
          ])
        }
        for (let k = 0; k < second; k++) {
          let heading = 0
          if (k > 0) {
            heading = this.bearing(allPoints[k - 1], allPoints[k])
          }
          reqData.datas.push({
            lon: allPoints[k][0],
            lat: allPoints[k][1],
            height: height + h,
            time: now += 1000,
            heading: heading,
            index: i,
          })
        }
      }
    }
    const chunkSize = 100;
    const chunks = Math.ceil(reqData.datas.length / chunkSize);
    for (let i = 0; i < chunks; i++) {
      if (i === chunks - 1) {
        reqData.end = true
      }
      const data = reqData.datas.slice(chunkSize * i, chunkSize * (i + 1));
      await request({
        url: '/dcts/external/add-aircraft-track-point',
        method: 'POST',
        data: {
          ...reqData,
          datas: data,
        }
      })
    }
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

    const brng = toDeg(Math.atan2(y, x));
    return 360 - (brng + 360) % 360; // 0–360
  }
}
