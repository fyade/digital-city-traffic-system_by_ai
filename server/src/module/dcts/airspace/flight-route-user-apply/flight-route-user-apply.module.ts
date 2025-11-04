import { Module } from '@nestjs/common';
import { FlightRouteUserApplyController } from './flight-route-user-apply.controller';
import { FlightRouteUserApplyService } from './flight-route-user-apply.service';

@Module({
  controllers: [FlightRouteUserApplyController],
  providers: [FlightRouteUserApplyService]
})
export class FlightRouteUserApplyModule {}
