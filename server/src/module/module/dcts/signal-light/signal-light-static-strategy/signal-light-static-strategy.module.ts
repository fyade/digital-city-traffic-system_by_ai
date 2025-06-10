import { Module } from '@nestjs/common';
import { SignalLightStaticStrategyController } from './signal-light-static-strategy.controller';
import { SignalLightStaticStrategyService } from './signal-light-static-strategy.service';

@Module({
  controllers: [SignalLightStaticStrategyController],
  providers: [SignalLightStaticStrategyService]
})
export class SignalLightStaticStrategyModule {}
