import { Module } from '@nestjs/common';
import { SignalLightStrategyTypeStrategyScheduleMappingController } from './signal-light-strategy-type-strategy-schedule-mapping.controller';
import { SignalLightStrategyTypeStrategyScheduleMappingService } from './signal-light-strategy-type-strategy-schedule-mapping.service';

@Module({
  controllers: [SignalLightStrategyTypeStrategyScheduleMappingController],
  providers: [SignalLightStrategyTypeStrategyScheduleMappingService]
})
export class SignalLightStrategyTypeStrategyScheduleMappingModule {}
