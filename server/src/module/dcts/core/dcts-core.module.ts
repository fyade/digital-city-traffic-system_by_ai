import { Global, Module } from '@nestjs/common';
import { DctsCoreService } from './dcts-core.service';
import { DctsCalculateService } from './dcts-calculate.service';
import { ExternalService } from "../external/external.service";
import { SpatialDataService } from "../spatial-data/spatial-data.service";
import { LowAltitudeAircraftFacadeService } from "../aircraft-manage/low-altitude-aircraft/low-altitude-aircraft.facade.service";
import { SignalLightChildStyleMappingFacadeService } from "../signal-light/signal-light-child-style-mapping/signal-light-child-style-mapping.facade.service";
import { SignalLightGroupChildMappingFacadeService } from "../signal-light/signal-light-group-child-mapping/signal-light-group-child-mapping.facade.service";
import { SignalLightGroupInfoFacadeService } from "../signal-light/signal-light-group-info/signal-light-group-info.facade.service";
import { SignalLightInfoFacadeService } from "../signal-light/signal-light-info/signal-light-info.facade.service";
import { SignalLightStyleFacadeService } from "../signal-light/signal-light-style/signal-light-style.facade.service";
import { SignalLightChildStrategyScheduleMappingFacadeService } from "../signal-light-strategy/signal-light-child-strategy-schedule-mapping/signal-light-child-strategy-schedule-mapping.facade.service";
import { SignalLightGroupStrategyTypeMappingFacadeService } from "../signal-light-strategy/signal-light-group-strategy-type-mapping/signal-light-group-strategy-type-mapping.facade.service";
import { SignalLightStrategyParamFacadeService } from "../signal-light-strategy/signal-light-strategy-param/signal-light-strategy-param.facade.service";
import { SignalLightStrategyScheduleFacadeService } from "../signal-light-strategy/signal-light-strategy-schedule/signal-light-strategy-schedule.facade.service";
import { SignalLightStrategyScheduleStrategyParamMappingFacadeService } from "../signal-light-strategy/signal-light-strategy-schedule-strategy-param-mapping/signal-light-strategy-schedule-strategy-param-mapping.facade.service";
import { SignalLightStrategyTypeFacadeService } from "../signal-light-strategy/signal-light-strategy-type/signal-light-strategy-type.facade.service";
import { SignalLightStrategyTypeStrategyScheduleMappingFacadeService } from "../signal-light-strategy/signal-light-strategy-type-strategy-schedule-mapping/signal-light-strategy-type-strategy-schedule-mapping.facade.service";
import { VehicleInfoFacadeService } from "../vehicle/vehicle-info/vehicle-info.facade.service";
import { VehicleTrackPointFacadeService } from "../vehicle/vehicle-track-point/vehicle-track-point.facade.service";

@Global()
@Module({
  providers: [
    DctsCoreService,
    DctsCalculateService,
    ExternalService,
    SpatialDataService,
    LowAltitudeAircraftFacadeService,
    SignalLightChildStyleMappingFacadeService,
    SignalLightGroupChildMappingFacadeService,
    SignalLightGroupInfoFacadeService,
    SignalLightInfoFacadeService,
    SignalLightStyleFacadeService,
    SignalLightChildStrategyScheduleMappingFacadeService,
    SignalLightGroupStrategyTypeMappingFacadeService,
    SignalLightStrategyParamFacadeService,
    SignalLightStrategyScheduleFacadeService,
    SignalLightStrategyScheduleStrategyParamMappingFacadeService,
    SignalLightStrategyTypeFacadeService,
    SignalLightStrategyTypeStrategyScheduleMappingFacadeService,
    VehicleInfoFacadeService,
    VehicleTrackPointFacadeService,
  ],
  exports: [
    DctsCoreService,
    DctsCalculateService,
    ExternalService,
    SpatialDataService,
    LowAltitudeAircraftFacadeService,
    SignalLightChildStyleMappingFacadeService,
    SignalLightGroupChildMappingFacadeService,
    SignalLightGroupInfoFacadeService,
    SignalLightInfoFacadeService,
    SignalLightStyleFacadeService,
    SignalLightChildStrategyScheduleMappingFacadeService,
    SignalLightGroupStrategyTypeMappingFacadeService,
    SignalLightStrategyParamFacadeService,
    SignalLightStrategyScheduleFacadeService,
    SignalLightStrategyScheduleStrategyParamMappingFacadeService,
    SignalLightStrategyTypeFacadeService,
    SignalLightStrategyTypeStrategyScheduleMappingFacadeService,
    VehicleInfoFacadeService,
    VehicleTrackPointFacadeService,
  ],
})
export class DctsCoreModule {
}
