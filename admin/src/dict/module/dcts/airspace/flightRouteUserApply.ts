import { publicDict } from "@/utils/base.ts";
import { FlightRouteUserApplyDto } from "@/type/module/dcts/airspace/flightRouteUserApply.ts";

export const flightRouteUserApplyDict: { [P in keyof FlightRouteUserApplyDto]: string } = {
  ...publicDict,
  aircraftId: '航空器列表',
  taskName: '任务名称',
  path: '航线',
  startTime: '开始时间',
  endTime: '结束时间',
}
