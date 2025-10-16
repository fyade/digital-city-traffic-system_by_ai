import { Module } from '@nestjs/common';
import { FlightRestrictionZoneController } from './flight-restriction-zone.controller';
import { FlightRestrictionZoneService } from './flight-restriction-zone.service';

@Module({
  controllers: [FlightRestrictionZoneController],
  providers: [FlightRestrictionZoneService]
})
export class FlightRestrictionZoneModule {}
