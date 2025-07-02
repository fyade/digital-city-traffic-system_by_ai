import { idUtils } from "@dcts/common";
import { ID_PREFIX_LINE, ID_PREFIX_POINT } from "@/views/dashboard/class/useDashboardCesium.ts";

export class CesiumPoint {
  id!: string
  lon!: number
  lat!: number

  constructor({
                id = ID_PREFIX_POINT + idUtils.genId(),
                lon,
                lat
              }: {
                id?: string
                lon: number
                lat: number
              }
  ) {
    this.id = id;
    this.lon = lon;
    this.lat = lat;
  }
}

export class CesiumLine {
  id!: string
  points!: CesiumPoint[]

  constructor({
                id = ID_PREFIX_LINE + idUtils.genId(),
                points = []
              }: {
                id?: string
                points?: CesiumPoint[]
              }
  ) {
    this.id = id;
    this.points = points;
  }
}
