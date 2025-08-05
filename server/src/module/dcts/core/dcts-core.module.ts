import { Global, Module } from '@nestjs/common';
import { DctsCoreService } from './dcts-core.service';
import { DctsCalculateService } from './dcts-calculate.service';

@Global()
@Module({
  providers: [DctsCoreService, DctsCalculateService],
  exports: [DctsCoreService],
})
export class DctsCoreModule {}
