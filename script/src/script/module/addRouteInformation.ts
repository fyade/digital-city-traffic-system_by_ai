import { request } from "../../api/request";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AddRouteInformationModule {
  async main() {
    const p = this._();
    await request({
      url: '/dcts/vehicle/vehicle-track-point/s',
      method: 'POST',
      data: {
        items: [
          {
            vehicleId: 1,
            point: `${p[0][0]},${p[0][1]}`,
            heading: p[0][2],
          },
          {
            vehicleId: 2,
            point: `${p[1][0]},${p[1][1]}`,
            heading: p[1][2],
          }
        ]
      }
    })
  }

  private _i = 0
  private _count = 10
  private _points = [
    [[118.93484816200569, 32.08984761763202], [118.93484816200569, 32.09484761763202], [118.93984816200569, 32.09484761763202], [118.93984816200569, 32.08984761763202]],
    [[118.93404816200569, 32.08904761763202], [118.93404816200569, 32.09404761763202], [118.93904816200569, 32.09404761763202], [118.93904816200569, 32.08904761763202]],
  ]

  private _() {
    const index0 = Math.floor((this._i / this._count) % this._points[0].length)
    const index1 = this._i % this._count
    const p = this._points.map(points => {
      const p1 = points[index0]
      const p2 = points[(index0 + 1) >= points.length ? 0 : (index0 + 1)]
      return [
        p1[0] + (p2[0] - p1[0]) * index1 / this._count,
        p1[1] + (p2[1] - p1[1]) * index1 / this._count,
        360 - index0 * 90,
      ]
    });
    this._i++
    return p
  }
}
