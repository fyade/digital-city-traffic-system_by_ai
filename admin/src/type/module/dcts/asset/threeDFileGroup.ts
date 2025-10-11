import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class ThreeDFileGroupDto extends BaseClass {
  id!: number;
  name!: string;
  description!: string;
  orderNum!: number;
}

export class ThreeDFileGroupSelDto extends PageDto {
}

export class ThreeDFileGroupSelAllDto {
}

export class ThreeDFileGroupInsDto {
  name!: string;
  description!: string;
  orderNum!: number;
}

export class ThreeDFileGroupUpdDto extends ThreeDFileGroupInsDto {
  id!: number;
}
