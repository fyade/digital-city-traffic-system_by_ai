import { Module } from '@nestjs/common';
import { SignalLightStrategyTypeController } from './signal-light-strategy-type.controller';
import { SignalLightStrategyTypeService } from './signal-light-strategy-type.service';

@Module({
  controllers: [SignalLightStrategyTypeController],
  providers: [SignalLightStrategyTypeService]
})
export class SignalLightStrategyTypeModule {}
