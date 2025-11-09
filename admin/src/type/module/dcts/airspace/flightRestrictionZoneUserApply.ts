import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class FlightRestrictionZoneUserApplyDto extends BaseClass {
  id!: number;
  aircraftId!: string;
  taskName!: string;
  geometry!: string;
  startTime!: string;
  endTime!: string;
  applyStatus!: string;
  applyOpinion!: string;
  files!: string;
}

export class FlightRestrictionZoneUserApplySelDto extends PageDto {
}

export class FlightRestrictionZoneUserApplySelAllDto {
}

export class FlightRestrictionZoneUserApplyInsDto {
  aircraftId!: string;
  taskName!: string;
  geometry!: string;
  startTime!: string;
  endTime!: string;
  applyStatus!: string;
  applyOpinion!: string;
  files!: string;
}

export class FlightRestrictionZoneUserApplyUpdDto extends FlightRestrictionZoneUserApplyInsDto {
  id!: number;
}
