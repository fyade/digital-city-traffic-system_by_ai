import { Module } from '@nestjs/common';
import { UserFlightRestrictionZoneUserApplyController } from './user-flight-restriction-zone-user-apply.controller';
import { UserFlightRestrictionZoneUserApplyService } from './user-flight-restriction-zone-user-apply.service';

@Module({
  controllers: [UserFlightRestrictionZoneUserApplyController],
  providers: [UserFlightRestrictionZoneUserApplyService]
})
export class UserFlightRestrictionZoneUserApplyModule {}
