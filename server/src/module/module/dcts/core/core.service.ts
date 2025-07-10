import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScheduleService } from "../../../schedule/schedule.service";
import { WsService } from "../../../ws/ws.service";

@Injectable()
export class CoreService implements OnModuleInit {
  constructor(
      private readonly scheduleService: ScheduleService,
      private readonly wsService: WsService,
  ) {
    this.scheduleService.addScheduleFunc('sys:dcts:runCoreSchedule', this.runCoreSchedule.bind(this))
  }

  /**
   * 仅供框架调用，禁止外部调用
   */
  async onModuleInit() {
    await this.runCore()
  }

  private async runCore() {
  }

  private async runCoreSchedule() {
    console.log('aaaaaaaaaaa', new Date())
    return true
  }
}
