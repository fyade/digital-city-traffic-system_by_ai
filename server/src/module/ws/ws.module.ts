import { Global, Module } from '@nestjs/common';
import { WsService } from './ws.service';

@Global()
@Module({
  providers: [WsService]
})
export class WsModule {}
