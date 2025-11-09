import { publicDict } from "@/utils/base.ts";
import { UserFlightRouteUserApplyDto } from "@/type/module/dcts/airspace/userFlightRouteUserApply.ts";

export const userFlightRouteUserApplyDict: { [P in keyof UserFlightRouteUserApplyDto]: string } = {
  ...publicDict,
  aircraftId: '航空器列表',
  taskName: '任务名称',
  path: '航线',
  startTime: '开始时间',
  endTime: '结束时间',
  applyStatus: '申请状态',
  applyOpinion: '申请意见',
  files: '附件',
}
