import { Module } from '@nestjs/common';
import { SignalLightGroupInfoController } from './signal-light-group-info.controller';
import { SignalLightGroupInfoService } from './signal-light-group-info.service';

@Module({
  controllers: [SignalLightGroupInfoController],
  providers: [SignalLightGroupInfoService],
})
export class SignalLightGroupInfoModule {
}
