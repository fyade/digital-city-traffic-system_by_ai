import { Module } from '@nestjs/common';
import { JunctionConnectionController } from './junction-connection.controller';
import { JunctionConnectionService } from './junction-connection.service';

@Module({
  controllers: [JunctionConnectionController],
  providers: [JunctionConnectionService]
})
export class JunctionConnectionModule {}
