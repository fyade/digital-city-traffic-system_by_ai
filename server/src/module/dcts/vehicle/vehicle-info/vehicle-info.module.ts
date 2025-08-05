import { Module } from '@nestjs/common';
import { VehicleInfoController } from './vehicle-info.controller';
import { VehicleInfoService } from './vehicle-info.service';

@Module({
  controllers: [VehicleInfoController],
  providers: [VehicleInfoService]
})
export class VehicleInfoModule {}
