import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class UserLowAltitudeAircraftDto extends BaseClass {
  id!: number;
  aircraftName!: string;
  serialNumber!: string;
  registrationNumber!: string;
}

export class UserLowAltitudeAircraftSelDto extends PageDto {
}

export class UserLowAltitudeAircraftSelAllDto {
}

export class UserLowAltitudeAircraftInsDto {
  aircraftName!: string;
  serialNumber!: string;
  registrationNumber!: string;
}

export class UserLowAltitudeAircraftUpdDto extends UserLowAltitudeAircraftInsDto {
  id!: number;
}
