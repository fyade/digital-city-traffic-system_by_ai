import { Module } from '@nestjs/common';
import { DctsTestController } from './dcts-test.controller';
import { DctsTestService } from './dcts-test.service';

@Module({
  controllers: [DctsTestController],
  providers: [DctsTestService]
})
export class DctsTestModule {}
