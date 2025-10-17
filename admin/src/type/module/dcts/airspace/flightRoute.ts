import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class FlightRouteDto extends BaseClass {
  id!: number;
  name!: string;
  path!: string;
  color!: string;
}

export class FlightRouteSelDto extends PageDto {
}

export class FlightRouteSelAllDto {
}

export class FlightRouteInsDto {
  name!: string;
  path!: string;
  color!: string;
}

export class FlightRouteUpdDto extends FlightRouteInsDto {
  id!: number;
}
