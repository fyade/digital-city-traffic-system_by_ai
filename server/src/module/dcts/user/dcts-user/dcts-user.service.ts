import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { AdminNewDctsUserDto, DctsUserDto, DctsUserSelListDto, ResetDctsUserPsdDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { final } from "../../../../util/base";
import { UserRoleDto } from "../../../main/sys-manage/user-role/dto";
import { base, encryptUtils, idUtils } from "@dcts/common";
import { RoleDto } from "../../../main/sys-manage/role/dto";
import { UserDeptDto } from "../../../main/sys-manage/user-dept/dto";
import { DeptDto } from "../../../main/sys-manage/dept/dto";
import { UserUserGroupDto } from "../../../algorithm/user-user-group/dto";
import { UserGroupDto } from "../../../algorithm/user-group/dto";
import { Exception } from "../../../../exception/exception";

@Injectable()
export class DctsUserService {
  constructor(
      private readonly mysqlPrisma: MysqlPrismaService,
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('dcts_user', {
      notNullKeys: ['username', 'password'],
    });
  }

  async selDctsUser(dto: DctsUserSelListDto): Promise<R> {
    const ifWithRole = dto.ifWithRole;
    delete dto.ifWithRole;
    const res = await this.pgsqlPrisma.findPage<DctsUserDto>('dcts_user', {
      data: dto,
      orderBy: false,
    });
    res.list.forEach(item => {
      delete item.password
    })
    if (ifWithRole !== final.Y) {
      return R.ok(res);
    }
    const res2 = [];
    const userIds = res.list.map(item => item.id);
    const allUserRolesOfThoseUsers = await this.mysqlPrisma.findAll<UserRoleDto>('sys_user_role', {
      data: {
        userId: {
          in: {
            value: userIds
          }
        },
        loginRole: base.LoginRoleEnum.dcts
      }
    })
    const allRoleIdsOfThoseUsers = allUserRolesOfThoseUsers.map(item => item.roleId);
    const allRolesOfThoseUsers = await this.mysqlPrisma.findAll<RoleDto>('sys_role', {
      data: {
        id: {
          in: {
            value: allRoleIdsOfThoseUsers
          }
        }
      }
    })
    const allUserDeptsOfThoseUsers = await this.mysqlPrisma.findAll<UserDeptDto>('sys_user_dept', {
      data: {
        userId: {
          in: {
            value: userIds
          }
        },
        loginRole: base.LoginRoleEnum.dcts
      }
    })
    const allUserDeptIdsOfThoseUsers = allUserDeptsOfThoseUsers.map(item => item.deptId);
    const allDeptsOfThoseUsers = await this.mysqlPrisma.findAll<DeptDto>('sys_dept', {
      data: {
        id: {
          in: {
            value: allUserDeptIdsOfThoseUsers
          }
        }
      }
    })
    const allUserUserGroupsOfThoseUsers = await this.mysqlPrisma.findAll<UserUserGroupDto>('sys_user_user_group', {
      data: {
        userId: {
          in: {
            value: userIds
          }
        },
        loginRole: base.LoginRoleEnum.dcts
      }
    })
    const allUserUserGroupIdsOfThoseUsers = allUserUserGroupsOfThoseUsers.map(item => item.userGroupId);
    const allUserGroupsOfThoseUsers = await this.mysqlPrisma.findAll<UserGroupDto>('sys_user_group', {
      data: {
        id: {
          in: {
            value: allUserUserGroupIdsOfThoseUsers
          },
        },
      },
    })
    for (let i = 0; i < res.list.length; i++) {
      const roleIdsOfThisUser = allUserRolesOfThoseUsers.filter(item => item.userId === res.list[i].id).map(item => item.roleId);
      const rolesOfThisUser = allRolesOfThoseUsers.filter(item => roleIdsOfThisUser.indexOf(item.id) > -1);
      const deptIdsOfThisUser = allUserDeptsOfThoseUsers.filter(item => item.userId === res.list[i].id).map(item => item.deptId);
      const deptsOfThisUser = allDeptsOfThoseUsers.filter(item => deptIdsOfThisUser.indexOf(item.id) > -1);
      const ugIdsOfThisUser = allUserUserGroupsOfThoseUsers.filter(item => item.userId === res.list[i].id).map(item => item.userGroupId);
      const ugsOfThisUser = allUserGroupsOfThoseUsers.filter(item => ugIdsOfThisUser.indexOf(item.id) > -1);
      res2.push({
        ...res.list[i],
        roles: rolesOfThisUser,
        depts: deptsOfThisUser,
        ugs: ugsOfThisUser,
      });
    }
    return R.ok({
      ...res,
      list: res2,
    });
  }

  async insDctsUser(dto: AdminNewDctsUserDto): Promise<R> {
    const dctsUser = await this.pgsqlPrisma.findFirst<DctsUserDto>('dcts_user', { username: dto.username });
    if (dctsUser) {
      throw new Exception('用户名已存在。');
    }
    await this.pgsqlPrisma.create('dcts_user', {
      ...dto,
      password: await encryptUtils.bcrypt.hashPassword(dto.password),
      id: idUtils.genId(10, false),
    }, { ifCustomizeId: true })
    return R.ok(true);
  }

  async adminResetDctsUserPsd(dto: ResetDctsUserPsdDto): Promise<R> {
    await this.pgsqlPrisma.updateById('dcts_user', { ...dto, password: await encryptUtils.bcrypt.hashPassword(dto.password) });
    return R.ok(true);
  }
}
