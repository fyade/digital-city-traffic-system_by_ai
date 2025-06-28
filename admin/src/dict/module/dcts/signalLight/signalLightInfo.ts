import { publicDict } from "@/utils/base.ts";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";

export const signalLightInfoDict: { [P in keyof SignalLightInfoDto]: string } = {
  ...publicDict,
  name: '信号灯名',
  location: '位置',
  description: '描述',
}
