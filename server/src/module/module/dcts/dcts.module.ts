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
    SignalLightStrategyScheduleStrategyParamMappingModule
  ]
})
export class DctsModule {
}
