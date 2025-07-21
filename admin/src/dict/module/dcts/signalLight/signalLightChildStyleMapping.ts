import { publicDict } from "@/utils/base.ts";
import { SignalLightChildStyleMappingDto } from "@/type/module/dcts/signalLight/signalLightChildStyleMapping.ts";

export const signalLightChildStyleMappingDict: { [P in keyof SignalLightChildStyleMappingDto]: string } = {
  ...publicDict,
  childId: '子信号灯id',
  styleId: '样式id',
}
