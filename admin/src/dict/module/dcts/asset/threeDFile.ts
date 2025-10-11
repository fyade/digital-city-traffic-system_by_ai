import { publicDict } from "@/utils/base.ts";
import { ThreeDFileDto } from "@/type/module/dcts/asset/threeDFile.ts";

export const threeDFileDict: { [P in keyof ThreeDFileDto]: string } = {
  ...publicDict,
  unitId: '文件单元id',
  fileName: '文件名',
}
