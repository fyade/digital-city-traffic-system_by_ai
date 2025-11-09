import { publicDict } from "@/utils/base.ts";
import { FlightRestrictionZoneUserApplyDto } from "@/type/module/dcts/airspace/flightRestrictionZoneUserApply.ts";

export const flightRestrictionZoneUserApplyDict: { [P in keyof FlightRestrictionZoneUserApplyDto]: string } = {
  ...publicDict,
  aircraftId: '航空器列表',
  taskName: '任务名称',
  geometry: '空域',
  startTime: '开始时间',
  endTime: '结束时间',
  applyStatus: '申请状态',
  applyOpinion: '申请意见',
  files: '附件',
}
