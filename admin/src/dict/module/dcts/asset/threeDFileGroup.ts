import { publicDict } from "@/utils/base.ts";
import { ThreeDFileGroupDto } from "@/type/module/dcts/asset/threeDFileGroup.ts";

export const threeDFileGroupDict: { [P in keyof ThreeDFileGroupDto]: string } = {
  ...publicDict,
  name: '文件组名',
  description: '文件组描述',
}
