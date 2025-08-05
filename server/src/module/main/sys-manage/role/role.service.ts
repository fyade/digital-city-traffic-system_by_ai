import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { RoleDto, RoleSelListDto, RoleSelAllDto, RoleInsOneDto, RoleUpdOneDto } from './dto';
import { CachePermissionService } from '../../../../infra/cache/cache.permission.service';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
    this.bcs.setFieldSelectParam('sys_role', {
      notNullKeys: ['label', 'ifAdmin', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    })
  }

  async selRole(dto: RoleSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<RoleDto, RoleSelListDto>('sys_role', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllRole(dto: RoleSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<RoleDto>('sys_role', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesRole(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<RoleDto>('sys_role', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneRole(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<RoleDto>('sys_role', Number(id));
    return R.ok(res);
  }

  async insRole(dto: RoleInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<RoleDto>('sys_role', dto);
    return R.ok(res);
  }

  async insRoles(dtos: RoleInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<RoleDto>('sys_role', dtos);
    return R.ok(res);
  }

  async updRole(dto: RoleUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<RoleDto>('sys_role', dto);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }

  async updRoles(dtos: RoleUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<RoleDto>('sys_role', dtos);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }

  async delRole(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<RoleDto>('sys_role', ids);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }
}
