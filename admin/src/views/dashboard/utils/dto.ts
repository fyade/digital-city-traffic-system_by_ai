import { idUtils } from "@dcts/common";

export class CesiumPoint {
  id!: string
  lon!: number
  lat!: number

  constructor({
                id = idUtils.genId(),
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
                id = idUtils.genId(),
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
