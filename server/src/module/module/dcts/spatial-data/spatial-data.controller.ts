import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SpatialDataService } from "./spatial-data.service";
import { Authorize } from "../../../../decorator/authorize.decorator";
import { R } from "../../../../common/R";
import { NodesWithWaysInPolygonDto, SignalLightGroupsInPolygonDto } from "./dto";
import { publicConfig } from "@dcts/config";

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
}
