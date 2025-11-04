import { Module } from '@nestjs/common';
import { UserFlightRouteUserApplyController } from './user-flight-route-user-apply.controller';
import { UserFlightRouteUserApplyService } from './user-flight-route-user-apply.service';

@Module({
  controllers: [UserFlightRouteUserApplyController],
  providers: [UserFlightRouteUserApplyService]
})
export class UserFlightRouteUserApplyModule {}
