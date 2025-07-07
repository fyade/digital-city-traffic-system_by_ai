import { publicDict } from "@/utils/base.ts";
import { SignalLightGroupStrategyTypeMappingDto } from "@/type/module/dcts/signalLightStrategy/signalLightGroupStrategyTypeMapping.ts";

export const signalLightGroupStrategyTypeMappingDict: { [P in keyof SignalLightGroupStrategyTypeMappingDto]: string } = {
  ...publicDict,
  groupId: 'groupId',
  strategyTypeId: 'strategyTypeId',
}
