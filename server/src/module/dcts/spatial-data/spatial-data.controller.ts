import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SpatialDataService } from "./spatial-data.service";
import { Authorize } from "../../../decorator/authorize.decorator";
import { R } from "../../../common/R";
import {
  NodesWithWaysInPolygonDto,
  SignalLightGroupsInPolygonDto,
  CalculateLightsInPolygonDto,
  GetVehiclesInPolygonDto,
  QueryVehicleTrajectoryDto, GetAirspaceInPolygonDto, GetAircraftsInPolygonDto,
} from "./dto";
import { publicConfig } from "@dcts/config";
import { Exception } from "../../../exception/exception";

@Controller('/dcts/spatial-data')
@ApiTags(`${publicConfig.APP_NAME}/空间数据`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({transform: true}))
export class SpatialDataController {
  constructor(private readonly spatialDataService: SpatialDataService) {
  }

  @Post('/nodes-with-ways-in-polygon')
  @ApiOperation({
    summary: '查询多边形内的所有节点及有连接的道路',
  })
  @Authorize({
    permission: 'dcts:spatialData:nodesWithWaysInPolygon',
    label: '查询多边形内的所有节点及有连接的道路',
  })
  async nodesWithWaysInPolygon(@Body() dto: NodesWithWaysInPolygonDto): Promise<R> {
    return this.spatialDataService.nodesWithWaysInPolygon(dto);
  }

  @Post('/signal-light-groups-in-polygon')
  @ApiOperation({
    summary: '查询多边形内的所有信号灯组'
  })
  @Authorize({
    permission: 'dcts:spatialData:signalLightGroupsInPolygon',
    label: '查询多边形内的所有信号灯组',
  })
  async signalLightGroupsInPolygon(@Body() dto: SignalLightGroupsInPolygonDto): Promise<R> {
    return this.spatialDataService.signalLightGroupsInPolygon(dto);
  }

  @Post('/calculate-lights-in-polygon')
  @ApiOperation({
    summary: '计算多边形内的所有信号灯'
  })
  @Authorize({
    permission: 'dcts:spatialData:calculateLightsInPolygon',
    label: '计算多边形内的所有信号灯'
  })
  async calculateLightsInPolygon(@Body() dto: CalculateLightsInPolygonDto): Promise<R> {
    if (!dto.groupIds && !dto.points) {
      throw new Exception('多边形至少需要 3 个顶点。')
    }
    if (dto.timeRange && dto.timeRange[1] - dto.timeRange[0] > 1000 * 60 * 60) {
      throw new Exception('时间范围不能超过1小时')
    }
    return this.spatialDataService.calculateLightsInPolygon(dto);
  }

  @Post('/get-vehicles-in-polygon')
  @ApiOperation({
    summary: '计算多边形内的车辆实时信息'
  })
  @Authorize({
    permission: 'dcts:spatialData:getVehiclesInPolygon',
    label: '计算多边形内的车辆实时信息'
  })
  async getVehiclesInPolygon(@Body() dto: GetVehiclesInPolygonDto): Promise<R> {
    if (dto.timeRange && dto.timeRange[1] - dto.timeRange[0] > 1000 * 60 * 60) {
      throw new Exception('时间范围不能超过1小时')
    }
    return this.spatialDataService.getVehiclesInPolygon(dto);
  }

  @Post('/query-vehicle-trajectory')
  @ApiOperation({
    summary: '查询车辆轨迹'
  })
  @Authorize({
    permission: 'dcts:spatialData:queryVehicleTrajectory',
    label: '查询车辆轨迹'
  })
  async queryVehicleTrajectory(@Body() dto: QueryVehicleTrajectoryDto): Promise<R> {
    return this.spatialDataService.queryVehicleTrajectory(dto);
  }

  @Post('/get-airspace-in-polygon')
  @ApiOperation({
    summary: '查询多边形内的空域'
  })
  @Authorize({
    permission: 'dcts:spatialData:getAirspaceInPolygon',
    label: '查询多边形内的空域'
  })
  async getAirspaceInPolygon(@Body() dto: GetAirspaceInPolygonDto): Promise<R> {
    return this.spatialDataService.getAirspaceInPolygon(dto);
  }

  @Post('/get-aircrafts-in-polygon')
  @ApiOperation({
    summary: '计算多边形内的航空器实时信息'
  })
  @Authorize({
    permission: 'dcts:spatialData:getAircraftsInPolygon',
    label: '计算多边形内的航空器实时信息'
  })
  async getAircraftsInPolygon(@Body() dto: GetAircraftsInPolygonDto): Promise<R> {
    if (dto.timeRange && dto.timeRange[1] - dto.timeRange[0] > 1000 * 60 * 60) {
      throw new Exception('时间范围不能超过1小时')
    }
    return this.spatialDataService.getAircraftsInPolygon(dto)
  }
}
