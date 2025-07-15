import { Global, Module } from '@nestjs/common';
import { DctsCoreService } from './dcts-core.service';

@Global()
@Module({
  providers: [DctsCoreService],
  exports: [DctsCoreService],
})
export class DctsCoreModule {}
