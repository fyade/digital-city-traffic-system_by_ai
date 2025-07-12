import { Module } from '@nestjs/common';
import { SignalLightStrategyParamController } from './signal-light-strategy-param.controller';
import { SignalLightStrategyParamService } from './signal-light-strategy-param.service';

@Module({
  controllers: [SignalLightStrategyParamController],
  providers: [SignalLightStrategyParamService]
})
export class SignalLightStrategyParamModule {}
