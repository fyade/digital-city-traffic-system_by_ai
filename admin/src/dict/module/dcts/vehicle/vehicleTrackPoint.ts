import { publicDict } from "@/utils/base.ts";
import { VehicleTrackPointDto } from "@/type/module/dcts/vehicle/vehicleTrackPoint.ts";

export const vehicleTrackPointDict: { [P in keyof VehicleTrackPointDto]: string } = {
  ...publicDict,
  vehicleId: '车辆id',
  point: '轨迹点',
  heading: '航向角',
}
