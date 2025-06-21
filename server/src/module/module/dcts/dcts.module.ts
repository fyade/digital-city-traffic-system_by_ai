import { Module } from "@nestjs/common";
import { SignalLightSpecificationModule } from './signal-light/signal-light-specification/signal-light-specification.module';
import { SignalLightStaticStrategyModule } from './signal-light/signal-light-static-strategy/signal-light-static-strategy.module';

@Module({
  imports: [
    SignalLightSpecificationModule,
    SignalLightStaticStrategyModule
  ]
})
export class DctsModule {
}
