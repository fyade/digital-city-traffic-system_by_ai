import { publicDict } from "@/utils/base.ts";
import { SignalLightStyleDto } from "@/type/module/dcts/signalLight/signalLightStyle.ts";

export const signalLightStyleDict: { [P in keyof SignalLightStyleDto]: string } = {
  ...publicDict,
  name: '样式名',
  style: '样式',
}
