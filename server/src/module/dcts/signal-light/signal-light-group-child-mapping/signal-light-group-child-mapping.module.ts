import { Module } from '@nestjs/common';
import { SignalLightGroupChildMappingController } from './signal-light-group-child-mapping.controller';
import { SignalLightGroupChildMappingService } from './signal-light-group-child-mapping.service';

@Module({
  controllers: [SignalLightGroupChildMappingController],
  providers: [SignalLightGroupChildMappingService]
})
export class SignalLightGroupChildMappingModule {}
