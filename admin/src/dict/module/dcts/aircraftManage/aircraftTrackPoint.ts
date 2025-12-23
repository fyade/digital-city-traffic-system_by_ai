import { publicDict } from "@/utils/base.ts";
import { AircraftTrackPointDto } from "@/type/module/dcts/aircraftManage/aircraftTrackPoint.ts";

export const aircraftTrackPointDict: { [P in keyof AircraftTrackPointDto]: string } = {
  ...publicDict,
  aircraftId: '航空器id',
  point: '轨迹点',
  height: '高度',
  heading: '航向角',
}
