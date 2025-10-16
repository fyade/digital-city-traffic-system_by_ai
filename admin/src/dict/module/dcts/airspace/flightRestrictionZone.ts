import { publicDict } from "@/utils/base.ts";
import { FlightRestrictionZoneDto } from "@/type/module/dcts/airspace/flightRestrictionZone.ts";

export const flightRestrictionZoneDict: { [P in keyof FlightRestrictionZoneDto]: string } = {
  ...publicDict,
  name: '限飞区名',
  code: '限飞区代码',
  type: '限飞区类型',
  geometry: '限飞区边界',
  descr: '描述',
}
