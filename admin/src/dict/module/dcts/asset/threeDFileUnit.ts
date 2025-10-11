import { publicDict } from "@/utils/base.ts";
import { ThreeDFileUnitDto } from "@/type/module/dcts/asset/threeDFileUnit.ts";

export const threeDFileUnitDict: { [P in keyof ThreeDFileUnitDto]: string } = {
  ...publicDict,
  groupId: '文件组id',
  name: '文件单元名',
  description: '文件单元描述',
}
