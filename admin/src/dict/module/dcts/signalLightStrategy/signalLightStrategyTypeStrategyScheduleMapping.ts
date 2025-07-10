import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyTypeStrategyScheduleMappingDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyTypeStrategyScheduleMapping.ts";

export const signalLightStrategyTypeStrategyScheduleMappingDict: { [P in keyof SignalLightStrategyTypeStrategyScheduleMappingDto]: string } = {
  ...publicDict,
  strategyTypeId: '信号灯策略类型id',
  strategyScheduleId: '信号灯策略调度id',
}
