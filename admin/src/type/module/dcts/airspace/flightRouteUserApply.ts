import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class FlightRouteUserApplyDto extends BaseClass {
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

export class FlightRouteUserApplySelDto extends PageDto {
}

export class FlightRouteUserApplySelAllDto {
}

export class FlightRouteUserApplyInsDto {
  aircraftId!: string;
  taskName!: string;
  path!: string;
  startTime!: string;
  endTime!: string;
  applyStatus!: string;
  applyOpinion!: string;
  files!: string;
}

export class FlightRouteUserApplyUpdDto extends FlightRouteUserApplyInsDto {
  id!: number;
}
