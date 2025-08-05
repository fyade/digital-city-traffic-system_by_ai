import { Module } from '@nestjs/common';
import { SignalLightChildStyleMappingController } from './signal-light-child-style-mapping.controller';
import { SignalLightChildStyleMappingService } from './signal-light-child-style-mapping.service';

@Module({
  controllers: [SignalLightChildStyleMappingController],
  providers: [SignalLightChildStyleMappingService]
})
export class SignalLightChildStyleMappingModule {}
