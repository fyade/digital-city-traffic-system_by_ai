import { Injectable } from '@nestjs/common';
import { request } from "../api/request";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ScriptService {
  constructor() {
  }

  @Cron('* * * * * *')
  async addRouteInformation() {
    await request({
      url: '/dcts/vehicle/vehicle-track-point/s',
      method: 'POST',
      data: {
        items: [
          {
            vehicleId: 1,
            point: `${118.93984816200569 + (Math.random() - .5) * .001},${32.09484761763202 + (Math.random() - .5) * .001}`,
            heading: Math.random() * 360
          },
          {
            vehicleId: 2,
            point: `${118.93904816200569 + (Math.random() - .5) * .001},${32.09484761763202 + (Math.random() - .5) * .001}`,
            heading: Math.random() * 360
          }
        ]
      }
    })
  }
}
