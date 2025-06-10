import { Module } from '@nestjs/common';
import { SignalLightSpecificationController } from './signal-light-specification.controller';
import { SignalLightSpecificationService } from './signal-light-specification.service';

@Module({
  controllers: [SignalLightSpecificationController],
  providers: [SignalLightSpecificationService]
})
export class SignalLightSpecificationModule {}
