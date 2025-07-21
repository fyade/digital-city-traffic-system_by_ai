import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyScheduleDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";

export const signalLightStrategyScheduleDict: { [P in keyof SignalLightStrategyScheduleDto]: string } = {
  ...publicDict,
  name: '策略调度名',
  description: '策略调度描述',
}
