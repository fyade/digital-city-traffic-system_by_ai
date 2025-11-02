import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class LowAltitudeAircraftDto extends BaseClass {
  id!: number;
  aircraftName!: string;
  serialNumber!: string;
  registrationNumber!: string;
  type!: string;
}

export class LowAltitudeAircraftSelDto extends PageDto {
}

export class LowAltitudeAircraftSelAllDto {
}

export class LowAltitudeAircraftInsDto {
  aircraftName!: string;
  serialNumber!: string;
  registrationNumber!: string;
  type!: string;
}

export class LowAltitudeAircraftUpdDto extends LowAltitudeAircraftInsDto {
  id!: number;
}
