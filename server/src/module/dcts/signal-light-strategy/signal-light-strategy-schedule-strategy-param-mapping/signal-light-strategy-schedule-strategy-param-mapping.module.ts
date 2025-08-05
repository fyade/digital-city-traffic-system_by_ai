import { Module } from '@nestjs/common';
import { SignalLightStrategyScheduleStrategyParamMappingService } from './signal-light-strategy-schedule-strategy-param-mapping.service';
import { SignalLightStrategyScheduleStrategyParamMappingController } from './signal-light-strategy-schedule-strategy-param-mapping.controller';

@Module({
  providers: [SignalLightStrategyScheduleStrategyParamMappingService],
  controllers: [SignalLightStrategyScheduleStrategyParamMappingController]
})
export class SignalLightStrategyScheduleStrategyParamMappingModule {}
