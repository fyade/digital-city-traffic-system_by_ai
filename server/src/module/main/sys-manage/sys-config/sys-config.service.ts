import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { SysConfigDto, SysConfigSelListDto, SysConfigSelAllDto, SysConfigInsOneDto, SysConfigUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class SysConfigService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_config', {
      notNullKeys: ['ifAllowUserRegist'],
    });
  }

  async selSysConfig(dto: SysConfigSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<SysConfigDto>('sys_config', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSysConfig(dto: SysConfigSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<SysConfigDto>('sys_config', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSysConfig(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<SysConfigDto>('sys_config', ids);
    return R.ok(res);
  }

  async selOneSysConfig(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<SysConfigDto>('sys_config', Number(id));
    return R.ok(res);
  }

  async insSysConfig(dto: SysConfigInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<SysConfigDto>('sys_config', dto);
    return R.ok(res);
  }

  async insSysConfigs(dtos: SysConfigInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<SysConfigDto>('sys_config', dtos);
    return R.ok(res);
  }

  async updSysConfig(dto: SysConfigUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<SysConfigDto>('sys_config', dto);
    return R.ok(res);
  }

  async updSysConfigs(dtos: SysConfigUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<SysConfigDto>('sys_config', dtos);
    return R.ok(res);
  }

  async delSysConfig(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<SysConfigDto>('sys_config', ids);
    return R.ok(res);
  }
}
