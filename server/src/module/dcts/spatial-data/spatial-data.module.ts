import { Module } from '@nestjs/common';
import { SpatialDataController } from './spatial-data.controller';
import { SpatialDataService } from './spatial-data.service';

@Module({
  controllers: [SpatialDataController],
  providers: [SpatialDataService]
})
export class SpatialDataModule {}
