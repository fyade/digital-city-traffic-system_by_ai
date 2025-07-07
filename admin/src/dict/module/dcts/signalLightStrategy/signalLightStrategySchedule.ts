import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyScheduleDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";

export const signalLightStrategyScheduleDict: { [P in keyof SignalLightStrategyScheduleDto]: string } = {
  ...publicDict,
  typeId: '信号灯策略类型id',
  scheduleType: '调度类型',
  startTime: '开始时间',
  endTime: '结束时间',
  cronExpression: 'cron表达式',
}
