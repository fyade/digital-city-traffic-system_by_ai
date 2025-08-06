import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import { AddRouteInformationDto } from "./dto";
import { SpatialDataService } from "../spatial-data/spatial-data.service";

@Injectable()
export class ExternalService {
  constructor(
      private readonly spatialDataService: SpatialDataService
  ) {
  }

  async addRouteInformation(dto: AddRouteInformationDto): Promise<R> {
    const bounds = expandBounds([Math.max(dto.startPoint.lat, dto.endPoint.lat), Math.max(dto.startPoint.lon, dto.endPoint.lon), Math.min(dto.startPoint.lat, dto.endPoint.lat), Math.min(dto.startPoint.lon, dto.endPoint.lon)]);
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

/**
 * 将矩形边界向外扩展固定距离（单位：千米）
 * @param bounds 原始矩形边界 [top, right, bottom, left]（单位：度）
 * @param padding 扩展距离（单位：千米，默认2km）
 * @returns 扩展后的矩形边界 [top, right, bottom, left]
 */
function expandBounds(
    bounds: [number, number, number, number], // [top, right, bottom, left]
    padding: number = 2
): [number, number, number, number] {
  const [top, right, bottom, left] = bounds;

  // 计算纬度方向扩展量（全球1°≈111km）
  const latPadding = padding / 111;

  // 计算经度方向扩展量（需考虑纬度影响）
  const centerLat = (top + bottom) / 2;
  const lngPadding = padding / (111 * Math.cos(centerLat * Math.PI / 180));

  return [
    top + latPadding,    // 上边扩展
    right + lngPadding,  // 右边扩展
    bottom - latPadding, // 下边扩展
    left - lngPadding    // 左边扩展
  ];
}
