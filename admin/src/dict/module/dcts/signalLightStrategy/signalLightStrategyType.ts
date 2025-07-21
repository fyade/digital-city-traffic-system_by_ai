import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyTypeDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";

export const signalLightStrategyTypeDict: { [P in keyof SignalLightStrategyTypeDto]: string } = {
  ...publicDict,
  name: '策略类型名',
  description: '策略类型描述',
  strategyType: '策略类型',
  scheduleType: '调度类型',
  startTime: '开始时间',
  endTime: '结束时间',
}
