import { Module } from '@nestjs/common';
import { JunctionPositionController } from './junction-position.controller';
import { JunctionPositionService } from './junction-position.service';

@Module({
  controllers: [JunctionPositionController],
  providers: [JunctionPositionService]
})
export class JunctionPositionModule {}
