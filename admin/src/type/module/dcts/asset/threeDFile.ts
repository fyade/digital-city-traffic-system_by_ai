import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class ThreeDFileDto extends BaseClass {
  id!: number;
  unitId!: number;
  fileName!: string;
  orderNum!: number;
}

export class ThreeDFileSelDto extends PageDto {
}

export class ThreeDFileSelAllDto {
}

export class ThreeDFileInsDto {
  unitId!: number;
  fileName!: string;
  orderNum!: number;
}

export class ThreeDFileUpdDto extends ThreeDFileInsDto {
  id!: number;
}
