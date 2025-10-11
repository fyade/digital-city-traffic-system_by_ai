import { Module } from '@nestjs/common';
import { ThreeDFileGroupController } from './three-d-file-group.controller';
import { ThreeDFileGroupService } from './three-d-file-group.service';

@Module({
  controllers: [ThreeDFileGroupController],
  providers: [ThreeDFileGroupService]
})
export class ThreeDFileGroupModule {}
