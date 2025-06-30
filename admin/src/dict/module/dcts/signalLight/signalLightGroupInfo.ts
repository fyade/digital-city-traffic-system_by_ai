import { publicDict } from "@/utils/base.ts";
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";

export const signalLightGroupInfoDict: { [P in keyof SignalLightGroupInfoDto]: string } = {
  ...publicDict,
  name: '信号灯组名',
  location: '位置',
  description: '描述',
}
