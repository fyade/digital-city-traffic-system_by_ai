import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class FlightRestrictionZoneDto extends BaseClass {
  id!: number;
  name!: string;
  code!: string;
  type!: string;
  geometry!: string;
  descr!: string;
}

export class FlightRestrictionZoneSelDto extends PageDto {
}

export class FlightRestrictionZoneSelAllDto {
}

export class FlightRestrictionZoneInsDto {
  name!: string;
  code!: string;
  type!: string;
  geometry!: string;
  descr!: string;
}

export class FlightRestrictionZoneUpdDto extends FlightRestrictionZoneInsDto {
  id!: number;
}
