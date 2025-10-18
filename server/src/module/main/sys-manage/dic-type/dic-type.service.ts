import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { DicTypeDto, DicTypeSelListDto, DicTypeSelAllDto, DicTypeInsOneDto, DicTypeUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class DicTypeService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_dic_type', {
      notNullKeys: ['name', 'type', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
  }

  async selDicType(dto: DicTypeSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<DicTypeDto>('sys_dic_type', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllDicType(dto: DicTypeSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<DicTypeDto>('sys_dic_type', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesDicType(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<DicTypeDto>('sys_dic_type', ids);
    return R.ok(res);
  }

  async selOneDicType(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<DicTypeDto>('sys_dic_type', Number(id));
    return R.ok(res);
  }

  async insDicType(dto: DicTypeInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<DicTypeDto>('sys_dic_type', dto);
    return R.ok(res);
  }

  async insDicTypes(dtos: DicTypeInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<DicTypeDto>('sys_dic_type', dtos);
    return R.ok(res);
  }

  async updDicType(dto: DicTypeUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<DicTypeDto>('sys_dic_type', dto);
    return R.ok(res);
  }

  async updDicTypes(dtos: DicTypeUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<DicTypeDto>('sys_dic_type', dtos);
    return R.ok(res);
  }

  async delDicType(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<DicTypeDto>('sys_dic_type', ids);
    return R.ok(res);
  }
}
