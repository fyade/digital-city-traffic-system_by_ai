import { Module } from '@nestjs/common';
import { ThreeDFileController } from './three-d-file.controller';
import { ThreeDFileService } from './three-d-file.service';

@Module({
  controllers: [ThreeDFileController],
  providers: [ThreeDFileService]
})
export class ThreeDFileModule {}
