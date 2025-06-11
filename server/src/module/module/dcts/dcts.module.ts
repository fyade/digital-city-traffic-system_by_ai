import { Module } from "@nestjs/common";
import { SignalLightSpecificationModule } from './signal-light/signal-light-specification/signal-light-specification.module';
import { SignalLightStaticStrategyModule } from './signal-light/signal-light-static-strategy/signal-light-static-strategy.module';
import { JunctionPositionModule } from './junction/junction-position/junction-position.module';
import { JunctionConnectionModule } from './junction/junction-connection/junction-connection.module';

@Module({
  imports: [
    SignalLightSpecificationModule,
    SignalLightStaticStrategyModule,
    JunctionPositionModule,
    JunctionConnectionModule
  ]
})
export class DctsModule {
}
