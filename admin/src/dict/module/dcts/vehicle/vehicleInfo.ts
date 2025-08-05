import { publicDict } from "@/utils/base.ts";
import { VehicleInfoDto } from "@/type/module/dcts/vehicle/vehicleInfo.ts";

export const vehicleInfoDict: { [P in keyof VehicleInfoDto]: string } = {
  ...publicDict,
  plateNumber: '车牌号',
  vehicleType: '车辆类型',
  brand: '品牌',
  color: '颜色',
}
