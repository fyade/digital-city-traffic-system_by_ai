import { publicDict } from "@/utils/base.ts";
import { UserLowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/userLowAltitudeAircraft.ts";

export const userLowAltitudeAircraftDict: { [P in keyof UserLowAltitudeAircraftDto]: string } = {
  ...publicDict,
  aircraftName: '航空器名',
  serialNumber: '序列号',
  registrationNumber: '实名登记号',
  type: '航空器类型',
}
