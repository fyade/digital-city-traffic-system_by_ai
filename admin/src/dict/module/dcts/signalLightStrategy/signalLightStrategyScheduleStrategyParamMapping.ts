import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyScheduleStrategyParamMappingDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyScheduleStrategyParamMapping.ts";

export const signalLightStrategyScheduleStrategyParamMappingDict: { [P in keyof SignalLightStrategyScheduleStrategyParamMappingDto]: string } = {
  ...publicDict,
  strategyScheduleId: '信号灯策略调度id',
  strategyParamId: '信号灯策略参数id',
}
