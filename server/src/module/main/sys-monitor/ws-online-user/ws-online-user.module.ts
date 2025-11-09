import { Module } from '@nestjs/common';
import { WsOnlineUserController } from './ws-online-user.controller';
import { WsOnlineUserService } from './ws-online-user.service';

@Module({
  controllers: [WsOnlineUserController],
  providers: [WsOnlineUserService]
})
export class WsOnlineUserModule {}
