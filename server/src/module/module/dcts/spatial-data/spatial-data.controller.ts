import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SpatialDataService } from "./spatial-data.service";
import { Authorize } from "../../../../decorator/authorize.decorator";
import { R } from "../../../../common/R";
import { CalculateLightsInPolygonDto, NodesWithWaysInPolygonDto, SignalLightGroupsInPolygonDto } from "./dto";
import { publicConfig } from "@dcts/config";
import { Exception } from "../../../../exception/exception";

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
    if (!dto.groupIds && (!dto.points || dto.points.length < 3)) {
      throw new Exception('多边形至少需要 3 个顶点。')
    }
    return this.spatialDataService.calculateLightsInPolygon(dto);
  }
}
