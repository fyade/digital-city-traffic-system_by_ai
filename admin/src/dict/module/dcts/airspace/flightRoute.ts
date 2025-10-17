import { publicDict } from "@/utils/base.ts";
import { FlightRouteDto } from "@/type/module/dcts/airspace/flightRoute.ts";

export const flightRouteDict: { [P in keyof FlightRouteDto]: string } = {
  ...publicDict,
  name: '航线名',
  path: '航线路径',
}
