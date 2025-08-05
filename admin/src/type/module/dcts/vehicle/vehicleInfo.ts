import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class VehicleInfoDto extends BaseClass {
  id!: number;
  plateNumber!: string;
  vehicleType!: string;
  brand!: string;
  color!: string;
}

export class VehicleInfoSelDto extends PageDto {
}

export class VehicleInfoSelAllDto {
}

export class VehicleInfoInsDto {
  plateNumber!: string;
  vehicleType!: string;
  brand!: string;
  color!: string;
}

export class VehicleInfoUpdDto extends VehicleInfoInsDto {
  id!: number;
}
