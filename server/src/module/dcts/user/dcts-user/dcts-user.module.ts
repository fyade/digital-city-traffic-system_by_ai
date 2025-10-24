import { Module } from '@nestjs/common';
import { DctsUserController } from './dcts-user.controller';
import { DctsUserService } from './dcts-user.service';

@Module({
  controllers: [DctsUserController],
  providers: [DctsUserService]
})
export class DctsUserModule {}
