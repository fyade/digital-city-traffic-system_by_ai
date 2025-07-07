import { Module } from '@nestjs/common';
import { SignalLightStrategyScheduleController } from './signal-light-strategy-schedule.controller';
import { SignalLightStrategyScheduleService } from './signal-light-strategy-schedule.service';

@Module({
  controllers: [SignalLightStrategyScheduleController],
  providers: [SignalLightStrategyScheduleService]
})
export class SignalLightStrategyScheduleModule {}
