import { publicDict } from "@/utils/base.ts";
import { JunctionPositionDto } from "@/type/module/dcts/junction/junctionPosition.ts";

export const junctionPositionDict: { [P in keyof JunctionPositionDto]: string } = {
  ...publicDict,
  geom: '位置',
  name: '路口名',
  junctionType: '路口类型',
}
