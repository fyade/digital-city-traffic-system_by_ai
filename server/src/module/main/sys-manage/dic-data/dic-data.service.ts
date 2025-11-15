import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { DicDataDto, DicDataSelListDto, DicDataSelAllDto, DicDataInsOneDto, DicDataUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonService } from "../../../../infra/common/common.service";

@Injectable()
export class DicDataService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly commonService: CommonService,
  ) {
    this.bcs.setFieldSelectParam('sys_dic_data', {
      notNullKeys: ['label', 'value', 'dicTypeId', 'ifDefault', 'ifDisabled', 'orderNum'],
      numberKeys: ['dicTypeId', 'orderNum'],
    });
  }

  async selDicDataOfType(perm: string, label: string = ''): Promise<R> {
    const dicDataDtos = await this.commonService.selDicDataOfType(perm,label);
    return R.ok(dicDataDtos);
  }

  async selDicData(dto: DicDataSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<DicDataDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllDicData(dto: DicDataSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<DicDataDto>('sys_dic_data', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesDicData(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<DicDataDto>('sys_dic_data', ids);
    return R.ok(res);
  }

  async selOneDicData(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<DicDataDto>('sys_dic_data', id);
    return R.ok(res);
  }

  async insDicData(dto: DicDataInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<DicDataDto>('sys_dic_data', dto);
    return R.ok(res);
  }

  async insDicDatas(dtos: DicDataInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<DicDataDto>('sys_dic_data', dtos);
    return R.ok(res);
  }

  async updDicData(dto: DicDataUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<DicDataDto>('sys_dic_data', dto);
    return R.ok(res);
  }

  async updDicDatas(dtos: DicDataUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<DicDataDto>('sys_dic_data', dtos);
    return R.ok(res);
  }

  async delDicData(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<DicDataDto>('sys_dic_data', ids);
    return R.ok(res);
  }
}
