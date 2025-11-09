import { publicDict } from "@/utils/base.ts";
import { UserFlightRestrictionZoneUserApplyDto } from "@/type/module/dcts/airspace/userFlightRestrictionZoneUserApply.ts";

export const userFlightRestrictionZoneUserApplyDict: { [P in keyof UserFlightRestrictionZoneUserApplyDto]: string } = {
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
