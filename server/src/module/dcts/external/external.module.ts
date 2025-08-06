import { Module } from '@nestjs/common';
import { ExternalController } from './external.controller';
import { ExternalService } from './external.service';
import { SpatialDataService } from "../spatial-data/spatial-data.service";

@Module({
  controllers: [ExternalController],
  providers: [
      ExternalService,
      SpatialDataService
  ]
})
export class ExternalModule {}
