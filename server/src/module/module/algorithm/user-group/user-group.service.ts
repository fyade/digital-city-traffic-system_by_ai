import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { UserGroupDto, UserGroupSelListDto, UserGroupSelAllDto, UserGroupInsOneDto, UserGroupUpdOneDto } from './dto';
import { BaseContextService } from '../../../base-context/base-context.service';

@Injectable()
export class UserGroupService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_user_group', {
      notNullKeys: ['label', 'parentId', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    })
  }

  async selUserGroup(dto: UserGroupSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<UserGroupDto, UserGroupSelListDto>('sys_user_group', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllUserGroup(dto: UserGroupSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<UserGroupDto>('sys_user_group', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesUserGroup(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<UserGroupDto>('sys_user_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserGroup(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<UserGroupDto>('sys_user_group', Number(id));
    return R.ok(res);
  }

  async insUserGroup(dto: UserGroupInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<UserGroupDto>('sys_user_group', dto);
    return R.ok(res);
  }

  async insUserGroups(dtos: UserGroupInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<UserGroupDto>('sys_user_group', dtos);
    return R.ok(res);
  }

  async updUserGroup(dto: UserGroupUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<UserGroupDto>('sys_user_group', dto);
    return R.ok(res);
  }

  async updUserGroups(dtos: UserGroupUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<UserGroupDto>('sys_user_group', dtos);
    return R.ok(res);
  }

  async delUserGroup(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<UserGroupDto>('sys_user_group', ids);
    return R.ok(res);
  }
}
