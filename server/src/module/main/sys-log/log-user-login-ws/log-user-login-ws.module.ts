import { Module } from '@nestjs/common';
import { LogUserLoginWsController } from './log-user-login-ws.controller';
import { LogUserLoginWsService } from './log-user-login-ws.service';

@Module({
  controllers: [LogUserLoginWsController],
  providers: [LogUserLoginWsService]
})
export class LogUserLoginWsModule {}
