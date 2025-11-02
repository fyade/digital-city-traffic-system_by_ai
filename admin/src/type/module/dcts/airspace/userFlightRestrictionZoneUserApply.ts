import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class UserFlightRestrictionZoneUserApplyDto extends BaseClass {
  id!: number;
  aircraftId!: string;
  taskName!: string;
  geometry!: string;
  startTime!: string;
  endTime!: string;
}

export class UserFlightRestrictionZoneUserApplySelDto extends PageDto {
}

export class UserFlightRestrictionZoneUserApplySelAllDto {
}

export class UserFlightRestrictionZoneUserApplyInsDto {
  aircraftId!: string;
  taskName!: string;
  geometry!: string;
  startTime!: string;
  endTime!: string;
}

export class UserFlightRestrictionZoneUserApplyUpdDto extends UserFlightRestrictionZoneUserApplyInsDto {
  id!: number;
}
