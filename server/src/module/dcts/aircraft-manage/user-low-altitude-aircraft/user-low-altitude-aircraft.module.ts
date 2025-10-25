import { Module } from '@nestjs/common';
import { UserLowAltitudeAircraftController } from './user-low-altitude-aircraft.controller';
import { UserLowAltitudeAircraftService } from './user-low-altitude-aircraft.service';

@Module({
  controllers: [UserLowAltitudeAircraftController],
  providers: [UserLowAltitudeAircraftService]
})
export class UserLowAltitudeAircraftModule {}
