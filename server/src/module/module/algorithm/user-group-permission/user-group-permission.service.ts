import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { UserGroupPermissionDto, UserGroupPermissionSelListDto, UserGroupPermissionSelAllDto, UserGroupPermissionInsOneDto, UserGroupPermissionUpdOneDto } from './dto';
import { final } from '../../../../util/base';
import { LogAlgorithmCallDto } from '../log-algorithm-call/dto';
import { BaseContextService } from '../../../base-context/base-context.service';

@Injectable()
export class UserGroupPermissionService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_user_group_permission', {
      notNullKeys: ['userGroupId', 'permissionId'],
      numberKeys: ['userGroupId', 'permissionId'],
    })
  }

  async selUserGroupPermission(dto: UserGroupPermissionSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<UserGroupPermissionDto, UserGroupPermissionSelListDto>('sys_user_group_permission', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllUserGroupPermission(dto: UserGroupPermissionSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<UserGroupPermissionDto>('sys_user_group_permission', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesUserGroupPermission(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<UserGroupPermissionDto>('sys_user_group_permission', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserGroupPermission(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<UserGroupPermissionDto>('sys_user_group_permission', Number(id));
    const count = await this.mysqlPrisma.count<LogAlgorithmCallDto>('log_algorithm_call', {
      data: { userGroupPermissionId: id },
    });
    const res2 = {
      ...res,
      count: count,
    }
    return R.ok(res2);
  }

  async insUserGroupPermission(dto: UserGroupPermissionInsOneDto): Promise<R> {
    dto.ifUseUp = final.N;
    // const dto1 = await this.mysqlPrisma.findFirst<UserGroupPermissionDto>('sys_user_group_permission', {
    //   userGroupId: dto.userGroupId,
    //   permissionId: dto.permissionId,
    // });
    // if (dto1) {
    //   return R.err('已存在用户组-权限对，不可重复添加。');
    // }
    const res = await this.mysqlPrisma.create<UserGroupPermissionDto>('sys_user_group_permission', dto);
    return R.ok(res);
  }

  async delUserGroupPermission(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<UserGroupPermissionDto>('sys_user_group_permission', ids);
    return R.ok(res);
  }
}
