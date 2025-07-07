import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyTypeDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";

export const signalLightStrategyTypeDict: { [P in keyof SignalLightStrategyTypeDto]: string } = {
  ...publicDict,
  name: '策略类型名',
  description: '策略类型描述',
}
