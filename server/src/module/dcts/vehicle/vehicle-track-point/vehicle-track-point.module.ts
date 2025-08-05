import { Module } from '@nestjs/common';
import { VehicleTrackPointController } from './vehicle-track-point.controller';
import { VehicleTrackPointService } from './vehicle-track-point.service';

@Module({
  controllers: [VehicleTrackPointController],
  providers: [VehicleTrackPointService]
})
export class VehicleTrackPointModule {}
