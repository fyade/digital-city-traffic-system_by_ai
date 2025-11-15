import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { SysDto, SysSelListDto, SysSelAllDto, SysInsOneDto, SysUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class SysService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_sys', {
      notNullKeys: ['name', 'perms', 'orderNum', 'path', 'ifDisabled'],
      numberKeys: ['orderNum'],
    });
  }

  async selSys(dto: SysSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<SysDto>('sys_sys', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllSys(dto: SysSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<SysDto>('sys_sys', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesSys(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<SysDto>('sys_sys', ids);
    return R.ok(res);
  }

  async selOneSys(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<SysDto>('sys_sys', id);
    return R.ok(res);
  }

  async insSys(dto: SysInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<SysDto>('sys_sys', dto);
    return R.ok(res);
  }

  async insSyss(dtos: SysInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<SysDto>('sys_sys', dtos);
    return R.ok(res);
  }

  async updSys(dto: SysUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<SysDto>('sys_sys', dto);
    return R.ok(res);
  }

  async updSyss(dtos: SysUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<SysDto>('sys_sys', dtos);
    return R.ok(res);
  }

  async delSys(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<SysDto>('sys_sys', ids);
    return R.ok(res);
  }
}
