import { publicDict } from "@/utils/base.ts";
import { SignalLightStrategyParamDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";

export const signalLightStrategyParamDict: { [P in keyof SignalLightStrategyParamDto]: string } = {
  ...publicDict,
  name: '策略参数名',
  description: '策略参数描述',
  lightType: '灯类型',
  round: '轮次',
  duration: '时长',
  currentLight: '当前灯色',
}
