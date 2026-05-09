import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { NonSupportException } from '../../../../exception/non-support.exception';
import { codeGeneration } from './codeGeneration';
import { CgTablesInterface } from './dto';
import { fileUtils, regularUtils } from '@dcts/common';
import { CodeGenTableFacadeService } from '../code-gen-table/code-gen-table.facade.service';
import { CodeGenColumnFacadeService } from '../code-gen-column/code-gen-column.facade.service';
import { SysFacadeService } from '../../sys-manage/sys/sys.facade.service';

@Injectable()
export class CodeGenerationService {
  constructor(
    private readonly codeGenTableFacadeService: CodeGenTableFacadeService,
    private readonly codeGenColumnFacadeService: CodeGenColumnFacadeService,
    private readonly sysFacadeService: SysFacadeService,
  ) {
  }

  async getDatabaseInfo(): Promise<R> {
    let text = '';
    try {
      const pathJoin = path.join(__dirname, '../../../../../../../');
      const prismaPath = path.join(pathJoin.endsWith('dist/') ? pathJoin.substring(0, pathJoin.length - 5) : pathJoin, 'prisma');
      const files = fileUtils.getAllFiles(prismaPath, { ifIncludeSubFolder: false });
      const prismaFiles = files.filter((item) => item.endsWith('.prisma'));
      for (const file of prismaFiles) {
        text = text + '\n' + fs.readFileSync(file, 'utf-8');
      }
    } catch (e) {
      throw new NonSupportException('读取数据库信息');
    }
    const lines = text.split('\n');
    const tables: CgTablesInterface[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      if (regularUtils.REGEX_MAIN_CODEGEN_regex1_test(lines[i]) && regularUtils.REGEX_MAIN_CODEGEN_regex2_test(lines[i + 1])) {
        tables.push({
          rowIndex: i,
          tableNameCnInitial: lines[i],
          tableNameEnInitial: lines[i + 1],
          tableNameCn: lines[i].replace(/\/+ +/, ''),
          tableNameEn: lines[i + 1].replace(/^model +/, '').replace(/ +{/, '').trim(),
          cols: [],
        });
      }
    }
    for (let i = 0; i < tables.length; i++) {
      const is: number = tables[i].rowIndex + 2;
      const ie: number = i === tables.length - 1 ? lines.length - 1 : tables[i + 1].rowIndex - 2;
      let is1: number = is;
      let ie1: number = ie;
      while (lines[is1].trim().endsWith('{') || lines[is1].trim().length === 0) {
        is1++;
      }
      ie1 = is1;
      while (!lines[ie1 + 1].trim().endsWith('}')) {
        ie1++;
      }
      for (let j = is1; j <= ie1; j++) {
        if (lines[j].trim().length === 0) {
          continue;
        }
        if (lines[j].trim().startsWith('@@')) {
          continue;
        }
        tables[i].cols.push({
          colInfo: lines[j],
          colName: regularUtils.REGEX_MAIN_STRING_1_match(lines[j].replace(regularUtils.REGEX_MAIN_CODEGEN_regex3, '$1'))[0],
          colType: lines[j].replace(regularUtils.REGEX_MAIN_CODEGEN_regex3, '$2').replace('?', ''),
          ifMust: !lines[j].replace(regularUtils.REGEX_MAIN_CODEGEN_regex3, '$2').endsWith('?'),
          colRemark: lines[j].replace(regularUtils.REGEX_MAIN_CODEGEN_regex3, '$3'),
        });
      }
    }
    return R.ok(tables);
  }

  async genCode(id: number): Promise<R> {
    const table = await this.codeGenTableFacadeService.getById(id);
    const columns = await this.codeGenColumnFacadeService.findByTableId(id);
    const sys = await this.sysFacadeService.getById(table.sysId);
    const cgRes = codeGeneration({table, columns, sys});
    return R.ok({
      table,
      columns,
      cgRes,
    });
  }

  async genCodeZip(id: number): Promise<R> {
    return R.ok('codeZip');
  }
}
