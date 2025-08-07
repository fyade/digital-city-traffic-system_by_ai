import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import { AddRouteInformationDto } from "./dto";
import { SpatialDataService } from "../spatial-data/spatial-data.service";
import { geoUtils } from "@dcts/common";

@Injectable()
export class ExternalService {
  constructor(
      private readonly spatialDataService: SpatialDataService
  ) {
  }

  async addRouteInformation(dto: AddRouteInformationDto): Promise<R> {
    const bounds = geoUtils.expandBounds([Math.max(dto.startPoint.lat, dto.endPoint.lat), Math.max(dto.startPoint.lon, dto.endPoint.lon), Math.min(dto.startPoint.lat, dto.endPoint.lat), Math.min(dto.startPoint.lon, dto.endPoint.lon)]);
    const points = [
      {lon: bounds[1], lat: bounds[0]},
      {lon: bounds[1], lat: bounds[2]},
      {lon: bounds[3], lat: bounds[2]},
      {lon: bounds[3], lat: bounds[0]},
    ]
    points.push(points[0])
    const allRoads = await this.spatialDataService.nodesWithWaysInPolygon({
      points: points
    });
    return R.ok(allRoads.data)
  }
}
