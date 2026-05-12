import { Module } from "@nestjs/common";
import { DctsCoreModule } from './core/dcts-core.module';
import { JunctionPositionModule } from './junction/junction-position/junction-position.module';
import { JunctionConnectionModule } from './junction/junction-connection/junction-connection.module';
import { SpatialDataModule } from './spatial-data/spatial-data.module';
import { SignalLightGroupInfoModule } from "./signal-light/signal-light-group-info/signal-light-group-info.module";
import { SignalLightInfoModule } from './signal-light/signal-light-info/signal-light-info.module';
import { SignalLightGroupChildMappingModule } from './signal-light/signal-light-group-child-mapping/signal-light-group-child-mapping.module';
import { SignalLightStrategyTypeModule } from './signal-light-strategy/signal-light-strategy-type/signal-light-strategy-type.module';
import { SignalLightStrategyScheduleModule } from './signal-light-strategy/signal-light-strategy-schedule/signal-light-strategy-schedule.module';
import { SignalLightGroupStrategyTypeMappingModule } from './signal-light-strategy/signal-light-group-strategy-type-mapping/signal-light-group-strategy-type-mapping.module';
import { SignalLightChildStrategyScheduleMappingModule } from './signal-light-strategy/signal-light-child-strategy-schedule-mapping/signal-light-child-strategy-schedule-mapping.module';
import { SignalLightStrategyTypeStrategyScheduleMappingModule } from './signal-light-strategy/signal-light-strategy-type-strategy-schedule-mapping/signal-light-strategy-type-strategy-schedule-mapping.module';
import { SignalLightStrategyParamModule } from './signal-light-strategy/signal-light-strategy-param/signal-light-strategy-param.module';
import { SignalLightStrategyScheduleStrategyParamMappingModule } from './signal-light-strategy/signal-light-strategy-schedule-strategy-param-mapping/signal-light-strategy-schedule-strategy-param-mapping.module';
import { SignalLightStyleModule } from './signal-light/signal-light-style/signal-light-style.module';
import { SignalLightChildStyleMappingModule } from './signal-light/signal-light-child-style-mapping/signal-light-child-style-mapping.module';
import { ExternalModule } from './external/external.module';
import { VehicleInfoModule } from './vehicle/vehicle-info/vehicle-info.module';
import { VehicleTrackPointModule } from './vehicle/vehicle-track-point/vehicle-track-point.module';
import { ScriptModule } from './script/script.module';
import { ThreeDFileGroupModule } from './asset/three-d-file-group/three-d-file-group.module';
import { ThreeDFileUnitModule } from './asset/three-d-file-unit/three-d-file-unit.module';
import { ThreeDFileModule } from './asset/three-d-file/three-d-file.module';
import { FlightRestrictionZoneModule } from './airspace/flight-restriction-zone/flight-restriction-zone.module';
import { FlightRouteModule } from './airspace/flight-route/flight-route.module';
import { DctsUserModule } from './user/dcts-user/dcts-user.module';
import { LowAltitudeAircraftModule } from './aircraft-manage/low-altitude-aircraft/low-altitude-aircraft.module';
import { UserLowAltitudeAircraftModule } from './aircraft-manage/user-low-altitude-aircraft/user-low-altitude-aircraft.module';
import { FlightRestrictionZoneUserApplyModule } from './airspace/flight-restriction-zone-user-apply/flight-restriction-zone-user-apply.module';
import { UserFlightRestrictionZoneUserApplyModule } from './airspace/user-flight-restriction-zone-user-apply/user-flight-restriction-zone-user-apply.module';
import { FlightRouteUserApplyModule } from './airspace/flight-route-user-apply/flight-route-user-apply.module';
import { UserFlightRouteUserApplyModule } from './airspace/user-flight-route-user-apply/user-flight-route-user-apply.module';
import { AircraftTrackPointModule } from './aircraft-manage/aircraft-track-point/aircraft-track-point.module';
import { StatisticsModule } from './statistics/statistics.module';
import { StrategyOverviewModule } from './strategy-overview/strategy-overview.module';

@Module({
  imports: [
    DctsCoreModule,
    JunctionPositionModule,
    JunctionConnectionModule,
    SpatialDataModule,
    SignalLightGroupInfoModule,
    SignalLightInfoModule,
    SignalLightGroupChildMappingModule,
    SignalLightStrategyTypeModule,
    SignalLightStrategyScheduleModule,
    SignalLightGroupStrategyTypeMappingModule,
    SignalLightChildStrategyScheduleMappingModule,
    SignalLightStrategyTypeStrategyScheduleMappingModule,
    SignalLightStrategyParamModule,
    SignalLightStrategyScheduleStrategyParamMappingModule,
    SignalLightStyleModule,
    SignalLightChildStyleMappingModule,
    ExternalModule,
    VehicleInfoModule,
    VehicleTrackPointModule,
    ScriptModule,
    ThreeDFileGroupModule,
    ThreeDFileUnitModule,
    ThreeDFileModule,
    FlightRestrictionZoneModule,
    FlightRouteModule,
    DctsUserModule,
    LowAltitudeAircraftModule,
    UserLowAltitudeAircraftModule,
    FlightRestrictionZoneUserApplyModule,
    UserFlightRestrictionZoneUserApplyModule,
    FlightRouteUserApplyModule,
    UserFlightRouteUserApplyModule,
    AircraftTrackPointModule,
    StatisticsModule,
    StrategyOverviewModule,
  ]
})
export class DctsModule {
}
