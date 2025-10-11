import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class ThreeDFileUnitDto extends BaseClass {
  id!: number;
  groupId!: number;
  name!: string;
  description!: string;
  orderNum!: number;
}

export class ThreeDFileUnitSelDto extends PageDto {
}

export class ThreeDFileUnitSelAllDto {
}

export class ThreeDFileUnitInsDto {
  groupId!: number;
  name!: string;
  description!: string;
  orderNum!: number;
}

export class ThreeDFileUnitUpdDto extends ThreeDFileUnitInsDto {
  id!: number;
}
