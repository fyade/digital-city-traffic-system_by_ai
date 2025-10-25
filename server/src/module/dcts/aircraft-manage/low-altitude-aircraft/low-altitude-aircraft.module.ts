import { Module } from '@nestjs/common';
import { LowAltitudeAircraftController } from './low-altitude-aircraft.controller';
import { LowAltitudeAircraftService } from './low-altitude-aircraft.service';

@Module({
  controllers: [LowAltitudeAircraftController],
  providers: [LowAltitudeAircraftService]
})
export class LowAltitudeAircraftModule {}
