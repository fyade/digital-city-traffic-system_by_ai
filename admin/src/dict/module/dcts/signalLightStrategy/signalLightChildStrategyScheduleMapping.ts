import { publicDict } from "@/utils/base.ts";
import { SignalLightChildStrategyScheduleMappingDto } from "@/type/module/dcts/signalLightStrategy/signalLightChildStrategyScheduleMapping.ts";

export const signalLightChildStrategyScheduleMappingDict: { [P in keyof SignalLightChildStrategyScheduleMappingDto]: string } = {
  ...publicDict,
  childLightId: '子信号灯id',
  strategyScheduleId: '信号灯策略调度id',
}
