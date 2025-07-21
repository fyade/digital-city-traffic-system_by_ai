import { Module } from '@nestjs/common';
import { SignalLightStyleController } from './signal-light-style.controller';
import { SignalLightStyleService } from './signal-light-style.service';

@Module({
  controllers: [SignalLightStyleController],
  providers: [SignalLightStyleService]
})
export class SignalLightStyleModule {}
