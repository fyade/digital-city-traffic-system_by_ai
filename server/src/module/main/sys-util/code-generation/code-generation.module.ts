import { Module } from '@nestjs/common';
import { CodeGenerationController } from './code-generation.controller';
import { CodeGenerationService } from './code-generation.service';
import { CodeGenTableFacadeService } from '../code-gen-table/code-gen-table.facade.service';
import { CodeGenColumnFacadeService } from '../code-gen-column/code-gen-column.facade.service';
import { SysFacadeService } from '../../sys-manage/sys/sys.facade.service';

@Module({
  controllers: [CodeGenerationController],
  providers: [CodeGenerationService, CodeGenTableFacadeService, CodeGenColumnFacadeService, SysFacadeService],
})
export class CodeGenerationModule {}
