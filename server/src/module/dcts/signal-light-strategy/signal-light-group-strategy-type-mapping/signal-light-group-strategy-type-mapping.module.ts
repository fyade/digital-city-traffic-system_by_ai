import { Module } from '@nestjs/common';
import { SignalLightGroupStrategyTypeMappingController } from './signal-light-group-strategy-type-mapping.controller';
import { SignalLightGroupStrategyTypeMappingService } from './signal-light-group-strategy-type-mapping.service';
import { SignalLightGroupChildMappingFacadeService } from "../../signal-light/signal-light-group-child-mapping/signal-light-group-child-mapping.facade.service";
import { SignalLightChildStrategyScheduleMappingFacadeService } from "../signal-light-child-strategy-schedule-mapping/signal-light-child-strategy-schedule-mapping.facade.service";

@Module({
  controllers: [SignalLightGroupStrategyTypeMappingController],
  providers: [SignalLightGroupStrategyTypeMappingService, SignalLightGroupChildMappingFacadeService, SignalLightChildStrategyScheduleMappingFacadeService]
})
export class SignalLightGroupStrategyTypeMappingModule {}
