import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';

@Module({
  providers: [ScriptService]
})
export class ScriptModule {}
