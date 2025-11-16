import { Module } from '@nestjs/common';
import { SignalLightInfoController } from './signal-light-info.controller';
import { SignalLightInfoService } from './signal-light-info.service';
import { SignalLightGroupChildMappingFacadeService } from "../signal-light-group-child-mapping/signal-light-group-child-mapping.facade.service";

@Module({
  controllers: [SignalLightInfoController],
  providers: [SignalLightInfoService, SignalLightGroupChildMappingFacadeService]
})
export class SignalLightInfoModule {
}
