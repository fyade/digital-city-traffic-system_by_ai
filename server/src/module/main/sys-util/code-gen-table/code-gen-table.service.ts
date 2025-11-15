import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { CodeGenTableDto, CodeGenTableSelListDto, CodeGenTableSelAllDto, CodeGenTableInsOneDto, CodeGenTableUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class CodeGenTableService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_code_gen_table', {
      notNullKeys: ['tableName', 'tableDescr', 'entityName', 'businessName', 'moduleName', 'businessNameCn', 'moduleNameCn', 'sysId', 'orderNum'],
      numberKeys: ['sysId', 'orderNum'],
    });
  }

  async selCodeGenTable(dto: CodeGenTableSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<CodeGenTableDto>('sys_code_gen_table', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllCodeGenTable(dto: CodeGenTableSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<CodeGenTableDto>('sys_code_gen_table', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesCodeGenTable(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<CodeGenTableDto>('sys_code_gen_table', ids);
    return R.ok(res);
  }

  async selOneCodeGenTable(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<CodeGenTableDto>('sys_code_gen_table', id);
    return R.ok(res);
  }

  async insCodeGenTable(dto: CodeGenTableInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<CodeGenTableDto>('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async insCodeGenTables(dtos: CodeGenTableInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<CodeGenTableDto>('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async updCodeGenTable(dto: CodeGenTableUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<CodeGenTableDto>('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async updCodeGenTables(dtos: CodeGenTableUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<CodeGenTableDto>('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async delCodeGenTable(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<CodeGenTableDto>('sys_code_gen_table', ids);
    return R.ok(res);
  }
}
