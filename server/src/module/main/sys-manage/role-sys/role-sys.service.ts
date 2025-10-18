import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { RoleSysDto, RoleSysSelListDto, RoleSysSelAllDto, RoleSysInsOneDto, RoleSysUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class RoleSysService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_role_sys', {
      notNullKeys: ['roleId', 'sysId'],
      numberKeys: ['roleId', 'sysId'],
    })
  }

  async selRoleSys(dto: RoleSysSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<RoleSysDto>('sys_role_sys', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllRoleSys(dto: RoleSysSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<RoleSysDto>('sys_role_sys', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesRoleSys(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<RoleSysDto>('sys_role_sys', ids);
    return R.ok(res);
  }

  async selOneRoleSys(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<RoleSysDto>('sys_role_sys', Number(id));
    return R.ok(res);
  }

  async insRoleSys(dto: RoleSysInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<RoleSysDto>('sys_role_sys', dto);
    return R.ok(res);
  }

  async insRoleSyss(dtos: RoleSysInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<RoleSysDto>('sys_role_sys', dtos);
    return R.ok(res);
  }

  async updRoleSys(dto: RoleSysUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<RoleSysDto>('sys_role_sys', dto);
    return R.ok(res);
  }

  async updRoleSyss(dtos: RoleSysUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<RoleSysDto>('sys_role_sys', dtos);
    return R.ok(res);
  }

  async delRoleSys(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<RoleSysDto>('sys_role_sys', ids);
    return R.ok(res);
  }
}
