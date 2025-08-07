import * as Cesium from 'cesium'
import { idUtils } from "@dcts/common";
import { CESIUM_DEFAULT, ID_PREFIX_LINE, ID_PREFIX_POINT } from "@/views/dashboard/functionModules/constant.ts";

export class CesiumPoint {
  id!: string
  lon!: number
  lat!: number
  color!: Cesium.Color
  height!: number

  constructor({
                id = ID_PREFIX_POINT + idUtils.genId(),
                lon,
                lat,
                color = CESIUM_DEFAULT.COLOR_POINT,
                height = CESIUM_DEFAULT.HEIGHT_POINT
              }: {
                id?: string
                lon: number
                lat: number
                color?: Cesium.Color
                height?: number
              }
  ) {
    this.id = id;
    this.lon = lon;
    this.lat = lat;
    this.color = color;
    this.height = height;
  }
}

export class CesiumLine {
  id!: string
  points!: CesiumPoint[]
  color!: Cesium.Color
  height!: number

  constructor({
                id = ID_PREFIX_LINE + idUtils.genId(),
                points = [],
                color = CESIUM_DEFAULT.COLOR_LINE,
                height = CESIUM_DEFAULT.HEIGHT_LINE
              }: {
                id?: string
                points?: CesiumPoint[]
                color?: Cesium.Color
                height?: number
              }
  ) {
    this.id = id;
    this.points = points;
    this.color = color;
    this.height = height;
  }
}
