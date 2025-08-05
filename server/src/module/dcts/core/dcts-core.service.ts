import { Injectable } from '@nestjs/common';
import { ScheduleService } from "../../../infra/schedule/schedule.service";
import { WsService } from "../../../infra/ws/ws.service";
import { DctsCalculateService } from "./dcts-calculate.service";

@Injectable()
export class DctsCoreService {
  constructor(
      private readonly scheduleService: ScheduleService,
      private readonly wsService: WsService,
      private readonly dctsCalculateService: DctsCalculateService,
  ) {
    this.scheduleService.addScheduleFunc('sys:dcts:runCoreSchedule', this.runCoreSchedule.bind(this))
  }

  public async calculateLightsInPolygon(signalLightGroupIds: number[], loginRole: string, userId: string, ifSendWs: boolean) {
    const signalLightRunParams = await this.calculateLight(signalLightGroupIds);
    if (ifSendWs) {
      this.wsService.sendMsg(loginRole, userId, 'dcts:spatialData:calculateLightsInPolygon', JSON.stringify(signalLightRunParams))
    }
    return signalLightRunParams
  }

  /**
   * 计算信号灯
   * @param signalLightGroupIds
   * @private
   */
  private async calculateLight(signalLightGroupIds: number[]) {
    return this.dctsCalculateService.calculateLight(signalLightGroupIds)
  }

  /**
   * 信号灯数据变化时调用此方法，让前端刷新信号灯
   * @private
   */
  public refreshLightWhenDatabaseChange() {
    const users = this.wsService.getUsersByPageContext('dashboard');
    for (const user of users) {
      this.wsService.sendMsg(user.loginRole, user.userId, 'dcts:spatialData:refreshLightWhenDatabaseChange', '')
    }
  }

  private async runCoreSchedule() {
    return true
  }
}
