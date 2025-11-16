import { Module } from '@nestjs/common';
import { SignalLightGroupInfoController } from './signal-light-group-info.controller';
import { SignalLightGroupInfoService } from './signal-light-group-info.service';
import { SignalLightGroupChildMappingFacadeService } from "../signal-light-group-child-mapping/signal-light-group-child-mapping.facade.service";
import { SignalLightInfoFacadeService } from "../signal-light-info/signal-light-info.facade.service";

@Module({
  controllers: [SignalLightGroupInfoController],
  providers: [SignalLightGroupInfoService, SignalLightGroupChildMappingFacadeService, SignalLightInfoFacadeService],
})
export class SignalLightGroupInfoModule {
}
