import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyScheduleDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";

export const signalLightStrategyScheduleDict: { [P in keyof SignalLightStrategyScheduleDto]: string } = {
  ...publicDict,
  name: '策略调度名',
  description: '策略调度描述',
  scheduleType: '调度类型',
  startTime: '开始时间',
  endTime: '结束时间',
  cronExpression: 'cron表达式',
}
