import { Module } from '@nestjs/common';
import { SignalLightChildStrategyScheduleMappingController } from './signal-light-child-strategy-schedule-mapping.controller';
import { SignalLightChildStrategyScheduleMappingService } from './signal-light-child-strategy-schedule-mapping.service';

@Module({
  controllers: [SignalLightChildStrategyScheduleMappingController],
  providers: [SignalLightChildStrategyScheduleMappingService]
})
export class SignalLightChildStrategyScheduleMappingModule {}
