import { Module } from '@nestjs/common';
import { SignalLightInfoController } from './signal-light-info.controller';
import { SignalLightInfoService } from './signal-light-info.service';

@Module({
  controllers: [SignalLightInfoController],
  providers: [SignalLightInfoService]
})
export class SignalLightInfoModule {}
