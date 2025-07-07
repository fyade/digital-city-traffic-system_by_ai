import { Module } from '@nestjs/common';
import { SignalLightGroupStrategyTypeMappingController } from './signal-light-group-strategy-type-mapping.controller';
import { SignalLightGroupStrategyTypeMappingService } from './signal-light-group-strategy-type-mapping.service';

@Module({
  controllers: [SignalLightGroupStrategyTypeMappingController],
  providers: [SignalLightGroupStrategyTypeMappingService]
})
export class SignalLightGroupStrategyTypeMappingModule {}
