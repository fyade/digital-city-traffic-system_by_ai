import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class JunctionPositionDto extends BaseClass {
  id!: number;
  geom!: string;
  name!: string;
  junctionType!: string;
}

export class JunctionPositionSelDto extends PageDto {
}

export class JunctionPositionSelAllDto {
}

export class JunctionPositionInsDto {
  geom!: string;
  name!: string;
  junctionType!: string;
}

export class JunctionPositionUpdDto extends JunctionPositionInsDto {
  id!: number;
}
