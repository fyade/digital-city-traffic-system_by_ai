import { publicDict } from "@/utils/base.ts";
import { SignalLightGroupChildMappingDto } from "@/type/module/dcts/signalLight/signalLightGroupChildMapping.ts";

export const signalLightGroupChildMappingDict: { [P in keyof SignalLightGroupChildMappingDto]: string } = {
  ...publicDict,
  groupId: '组id',
  childLightId: '子id',
}
