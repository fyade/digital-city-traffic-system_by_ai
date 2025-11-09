import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { UserPermissionDeniedException } from '../../../../exception/user-permission-denied.exception';
import { AuthService } from '../../../../infra/auth/auth.service';
import { UserDeptDto, UserDeptSelListDto, UserDeptSelAllDto, UserDeptInsOneDto, UserDeptUpdOneDto, UserDeptUpdUDDto, UserDeptUpdDUDto } from './dto';
import { CachePermissionService } from '../../../../infra/cache/cache.permission.service';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class UserDeptService {
  constructor(
      private readonly mysqlPrisma: MysqlPrismaService,
    private readonly authService: AuthService,
    private readonly cachePermissionService: CachePermissionService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_user_dept', {
      notNullKeys: ['userId', 'deptId', 'loginRole'],
      numberKeys: ['deptId'],
    })
  }

  async selUserDept(dto: UserDeptSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<UserDeptDto>('sys_user_dept', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllUserDept(dto: UserDeptSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<UserDeptDto>('sys_user_dept', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesUserDept(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<UserDeptDto>('sys_user_dept', ids);
    return R.ok(res);
  }

  async selOneUserDept(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<UserDeptDto>('sys_user_dept', Number(id));
    return R.ok(res);
  }

  async updUserDeptUD(dto: UserDeptUpdUDDto): Promise<R> {
    if (!await this.authService.ifAdminUserUpdNotAdminUser(this.bcs.getUserData().userId, dto.userId)) {
      throw new UserPermissionDeniedException();
    }
    const allDepts = await this.mysqlPrisma.findAll<UserDeptDto>('sys_user_dept', { data: { userId: dto.userId } });
    const allDeptIds = allDepts.map(item => item.deptId);
    const addDepts = dto.deptId.filter(id => allDeptIds.indexOf(id) === -1);
    const delDeptIds = allDeptIds.filter(id => dto.deptId.indexOf(id) === -1);
    const delDepts = allDepts.filter(item => delDeptIds.indexOf(item.deptId) > -1).map(item => item.id);
    await this.mysqlPrisma.deleteById('sys_user_dept', delDepts);
    await this.mysqlPrisma.createMany('sys_user_dept', addDepts.map(item => ({ userId: dto.userId, deptId: item, loginRole: dto.loginRole })));
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(true);
  }

  async updUserDeptDU(dto: UserDeptUpdDUDto): Promise<R> {
    const data = [];
    const allUsersOfThisDept = await this.mysqlPrisma.findAll<UserDeptDto>('sys_user_dept', {
      data: { deptId: dto.deptId },
    });
    const allUserIdsOfThisDept = allUsersOfThisDept.map(item => item.userId);
    const userIds = dto.userId.filter(item => allUserIdsOfThisDept.indexOf(item) === -1);
    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      if (!await this.authService.ifAdminUserUpdNotAdminUser(this.bcs.getUserData().userId, userId)) {
        throw new UserPermissionDeniedException();
      }
      data.push({
        userId: userId,
        deptId: dto.deptId,
        loginRole: dto.loginRole,
      });
    }
    await this.mysqlPrisma.createMany('sys_user_dept', data);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(true);
  }

  async delUserDept(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<UserDeptDto>('sys_user_dept', ids);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }
}
