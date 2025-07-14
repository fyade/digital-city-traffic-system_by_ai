import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../../prisma/mysql.prisma.service';
import { R } from '../../../../../common/R';
import { CodeGenColumnDto, CodeGenColumnSelListDto, CodeGenColumnSelAllDto, CodeGenColumnInsOneDto, CodeGenColumnUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';

@Injectable()
export class CodeGenColumnService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_code_gen_column', {
      notNullKeys: ['tableId', 'colName', 'colDescr', 'mysqlType', 'mysqlLength', 'tsType', 'tsName', 'ifIns', 'ifUpd', 'ifSelOne', 'ifSelMore', 'ifRequired', 'selType', 'formType', 'orderNum'],
      numberKeys: ['tableId', 'mysqlLength', 'orderNum'],
    });
  }

  async selCodeGenColumn(dto: CodeGenColumnSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<CodeGenColumnDto, CodeGenColumnSelListDto>('sys_code_gen_column', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllCodeGenColumn(dto: CodeGenColumnSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<CodeGenColumnDto>('sys_code_gen_column', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesCodeGenColumn(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<CodeGenColumnDto>('sys_code_gen_column', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneCodeGenColumn(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<CodeGenColumnDto>('sys_code_gen_column', Number(id));
    return R.ok(res);
  }

  async insCodeGenColumn(dto: CodeGenColumnInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<CodeGenColumnDto>('sys_code_gen_column', dto);
    return R.ok(res);
  }

  async insCodeGenColumns(dtos: CodeGenColumnInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<CodeGenColumnDto>('sys_code_gen_column', dtos);
    return R.ok(res);
  }

  async updCodeGenColumn(dto: CodeGenColumnUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<CodeGenColumnDto>('sys_code_gen_column', dto);
    return R.ok(res);
  }

  async updCodeGenColumns(dtos: CodeGenColumnUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<CodeGenColumnDto>('sys_code_gen_column', dtos);
    return R.ok(res);
  }

  async delCodeGenColumn(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<CodeGenColumnDto>('sys_code_gen_column', ids);
    return R.ok(res);
  }
}
