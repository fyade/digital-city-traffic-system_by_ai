import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyParamDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";

export const signalLightStrategyParamDict: { [P in keyof SignalLightStrategyParamDto]: string } = {
  ...publicDict,
  lightType: '灯类型',
  round: '轮次',
  duration: '时长',
  currentLight: '当前灯色',
}
