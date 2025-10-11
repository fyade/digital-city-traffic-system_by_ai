import { Module } from '@nestjs/common';
import { ThreeDFileUnitController } from './three-d-file-unit.controller';
import { ThreeDFileUnitService } from './three-d-file-unit.service';

@Module({
  controllers: [ThreeDFileUnitController],
  providers: [ThreeDFileUnitService]
})
export class ThreeDFileUnitModule {}
