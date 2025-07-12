import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyParamDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";

export const signalLightStrategyParamDict: { [P in keyof SignalLightStrategyParamDto]: string } = {
  ...publicDict,
  redDuration: '红灯时长',
  yellowDuration: '黄灯时长',
  greenDuration: '绿灯时长',
}
