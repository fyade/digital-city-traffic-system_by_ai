import { Module } from '@nestjs/common';
import { AircraftTrackPointController } from './aircraft-track-point.controller';
import { AircraftTrackPointService } from './aircraft-track-point.service';

@Module({
  controllers: [AircraftTrackPointController],
  providers: [AircraftTrackPointService]
})
export class AircraftTrackPointModule {}
