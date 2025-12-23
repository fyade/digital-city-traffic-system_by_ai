import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class AircraftTrackPointDto extends BaseClass {
  id!: number;
  aircraftId!: number;
  point!: string;
  height!: number;
  heading!: number;
}

export class AircraftTrackPointSelDto extends PageDto {
}

export class AircraftTrackPointSelAllDto {
}

export class AircraftTrackPointInsDto {
  aircraftId!: number;
  point!: string;
  height!: number;
  heading!: number;
}

export class AircraftTrackPointUpdDto extends AircraftTrackPointInsDto {
  id!: number;
}
