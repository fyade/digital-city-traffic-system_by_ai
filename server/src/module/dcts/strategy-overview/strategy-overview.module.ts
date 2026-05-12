import { Module } from '@nestjs/common';
import { StrategyOverviewController } from './strategy-overview.controller';
import { StrategyOverviewService } from './strategy-overview.service';

@Module({
  controllers: [StrategyOverviewController],
  providers: [StrategyOverviewService],
})
export class StrategyOverviewModule {}
