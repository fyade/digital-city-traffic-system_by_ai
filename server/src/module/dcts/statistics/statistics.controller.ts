import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Authorize } from '../../../decorator/authorize.decorator';
import { R } from '../../../common/R';
import {
  SignalLightStatusDistributionDto,
  VehicleFlowStatisticsDto,
} from './dto';
import { publicConfig } from '@dcts/config';

@Controller('/dcts/statistics')
@ApiTags(`${publicConfig.APP_NAME}/交通统计`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('/vehicle-flow')
  @ApiOperation({ summary: '车辆流量统计' })
  @Authorize({
    permission: 'dcts:statistics:vehicleFlow',
    label: '车辆流量统计',
  })
  async vehicleFlow(@Body() dto: VehicleFlowStatisticsDto): Promise<R> {
    return this.statisticsService.vehicleFlow(dto);
  }

  @Post('/signal-light-status')
  @ApiOperation({ summary: '信号灯状态分布统计' })
  @Authorize({
    permission: 'dcts:statistics:signalLightStatus',
    label: '信号灯状态分布统计',
  })
  async signalLightStatus(
    @Body() dto: SignalLightStatusDistributionDto,
  ): Promise<R> {
    return this.statisticsService.signalLightStatus(dto);
  }

  @Get('/overview')
  @ApiOperation({ summary: '交通概况' })
  @Authorize({
    permission: 'dcts:statistics:overview',
    label: '交通概况',
  })
  async overview(): Promise<R> {
    return this.statisticsService.overview();
  }
}
