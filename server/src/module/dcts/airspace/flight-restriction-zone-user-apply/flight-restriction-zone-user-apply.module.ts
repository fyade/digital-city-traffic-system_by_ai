import { Module } from '@nestjs/common';
import { FlightRestrictionZoneUserApplyController } from './flight-restriction-zone-user-apply.controller';
import { FlightRestrictionZoneUserApplyService } from './flight-restriction-zone-user-apply.service';

@Module({
  controllers: [FlightRestrictionZoneUserApplyController],
  providers: [FlightRestrictionZoneUserApplyService]
})
export class FlightRestrictionZoneUserApplyModule {}
