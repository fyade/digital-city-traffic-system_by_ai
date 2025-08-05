import { Module } from '@nestjs/common';
import { LogOperationWsController } from './log-operation-ws.controller';
import { LogOperationWsService } from './log-operation-ws.service';

@Module({
  controllers: [LogOperationWsController],
  providers: [LogOperationWsService],
})
export class LogOperationWsModule {
}
