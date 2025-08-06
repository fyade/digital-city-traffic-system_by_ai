import { Injectable } from '@nestjs/common';
import { request } from "../api/request";

@Injectable()
export class ScriptService {
  constructor() {
    this.addRouteInformation()
  }

  async addRouteInformation() {
    const res = await request({
      url: '/dcts/external/add-route-information',
      method: 'POST',
      data: {
        plateNumber: '苏A11111',
        "startPoint": {
          "lon": 118.9211767957686,
          "lat": 32.050497033870116
        },
        "endPoint": {
          "lon": 118.90981876041977,
          "lat": 32.039721262258894
        }
      }
    })
  }
}
