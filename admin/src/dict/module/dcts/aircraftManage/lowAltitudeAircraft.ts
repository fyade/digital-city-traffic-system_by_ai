import { publicDict } from "@/utils/base.ts";
import { LowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/lowAltitudeAircraft.ts";

export const lowAltitudeAircraftDict: { [P in keyof LowAltitudeAircraftDto]: string } = {
  ...publicDict,
  aircraftName: '航空器名',
  serialNumber: '序列号',
  registrationNumber: '实名登记号',
}
