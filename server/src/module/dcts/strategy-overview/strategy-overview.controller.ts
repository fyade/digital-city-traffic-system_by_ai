import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StrategyOverviewService } from './strategy-overview.service';
import { Authorize } from '../../../decorator/authorize.decorator';
import { R } from '../../../common/R';
import { publicConfig } from '@dcts/config';

@Controller('/dcts/strategy-overview')
@ApiTags(`${publicConfig.APP_NAME}/策略概览`)
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ transform: true }))
export class StrategyOverviewController {
  constructor(
    private readonly strategyOverviewService: StrategyOverviewService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '信号灯策略多表联查概览' })
  @Authorize({
    permission: 'dcts:strategyOverview:get',
    label: '信号灯策略多表联查概览',
  })
  async overview(): Promise<R> {
    return this.strategyOverviewService.getOverview();
  }
}
