import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class UserFlightRouteUserApplyDto extends BaseClass {
  id!: number;
  aircraftId!: string;
  taskName!: string;
  path!: string;
  startTime!: string;
  endTime!: string;
  applyStatus!: string;
  applyOpinion!: string;
  files!: string;
}

export class UserFlightRouteUserApplySelDto extends PageDto {
}

export class UserFlightRouteUserApplySelAllDto {
}

export class UserFlightRouteUserApplyInsDto {
  aircraftId!: string;
  taskName!: string;
  path!: string;
  startTime!: string;
  endTime!: string;
  applyStatus!: string;
  applyOpinion!: string;
  files!: string;
}

export class UserFlightRouteUserApplyUpdDto extends UserFlightRouteUserApplyInsDto {
  id!: number;
}
