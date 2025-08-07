import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class VehicleTrackPointDto extends BaseClass {
  id!: number;
  vehicleId!: number;
  point!: string;
  heading!: number;
}

export class VehicleTrackPointSelDto extends PageDto {
}

export class VehicleTrackPointSelAllDto {
}

export class VehicleTrackPointInsDto {
  vehicleId!: number;
  point!: string;
  heading!: number;
}

export class VehicleTrackPointUpdDto extends VehicleTrackPointInsDto {
  id!: number;
}
