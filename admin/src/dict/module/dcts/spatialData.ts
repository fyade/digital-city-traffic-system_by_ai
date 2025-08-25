import { QueryVehicleTrajectoryDto } from "@/type/module/dcts/spatialData.ts";

export const queryVehicleTrajectoryDict: { [P in keyof QueryVehicleTrajectoryDto]: string } = {
  startTime: '开始时间',
  endTime: '结束时间',
  plateNumber: '车牌号',
}
