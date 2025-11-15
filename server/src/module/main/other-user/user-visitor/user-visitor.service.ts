import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { UserVisitorDto, UserVisitorSelListDto, AdminNewUserVisitorDto, ResetUserVisitorPsdDto } from './dto';
import { final } from '../../../../util/base';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { Exception } from "../../../../exception/exception";
import { base, encryptUtils, idUtils } from '@dcts/common'
import { UserRoleFacadeService } from '../../sys-manage/user-role/user-role.facade.service';
import { RoleFacadeService } from '../../sys-manage/role/role.facade.service';
import { UserDeptFacadeService } from '../../sys-manage/user-dept/user-dept.facade.service';
import { DeptFacadeService } from '../../sys-manage/dept/dept.facade.service';
import { UserUserGroupFacadeService } from '../../../algorithm/user-user-group/user-user-group.facade.service';
import { UserGroupFacadeService } from '../../../algorithm/user-group/user-group.facade.service';

@Injectable()
export class UserVisitorService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly userRoleFacadeService: UserRoleFacadeService,
    private readonly roleFacadeService: RoleFacadeService,
    private readonly userDeptFacadeService: UserDeptFacadeService,
    private readonly deptFacadeService: DeptFacadeService,
    private readonly userUserGroupFacadeService: UserUserGroupFacadeService,
    private readonly userGroupFacadeService: UserGroupFacadeService,
  ) {
    this.bcs.setFieldSelectParam('sys_user_visitor', {
      notNullKeys: ['id', 'username'],
    })
  }

  async selUserVisitor(dto: UserVisitorSelListDto): Promise<R> {
    const ifWithRole = dto.ifWithRole;
    delete dto.ifWithRole;
    const res = await this.mysqlPrisma.findPage<UserVisitorDto>('sys_user_visitor', {
      data: dto,
      orderBy: false,
    });
    res.list.forEach(item => {
      delete item.password;
    });
    if (ifWithRole !== final.Y) {
      return R.ok(res);
    }
    const res2 = [];
    const userIds = res.list.map(item => item.id);
    const allUserRolesOfThoseUsers = await this.userRoleFacadeService.getByUserInfo(userIds, base.LoginRoleEnum.visitor);
    const allRoleIdsOfThoseUsers = allUserRolesOfThoseUsers.map(item => item.roleId);
    const allRolesOfThoseUsers = await this.roleFacadeService.getByIds(allRoleIdsOfThoseUsers);
    const allUserDeptsOfThoseUsers = await this.userDeptFacadeService.getByUserInfo(userIds, base.LoginRoleEnum.visitor);
    const allUserDeptIdsOfThoseUsers = allUserDeptsOfThoseUsers.map(item => item.deptId);
    const allDeptsOfThoseUsers = await this.deptFacadeService.getByIds(allUserDeptIdsOfThoseUsers);
    const allUserUserGroupsOfThoseUsers = await this.userUserGroupFacadeService.getByUserInfo(userIds, base.LoginRoleEnum.visitor);
    const allUserUserGroupIdsOfThoseUsers = allUserUserGroupsOfThoseUsers.map(item => item.userGroupId);
    const allUserGroupsOfThoseUsers = await this.userGroupFacadeService.getByIds(allUserUserGroupIdsOfThoseUsers);
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

  async insUserVisitor(dto: AdminNewUserVisitorDto): Promise<R> {
    const userVisitor = await this.mysqlPrisma.findFirst<UserVisitorDto>('sys_user_visitor', { username: dto.username });
    if (userVisitor) {
      throw new Exception('用户名已存在。');
    }
    await this.mysqlPrisma.create<UserVisitorDto>('sys_user_visitor', {
      ...dto,
      password: await encryptUtils.bcrypt.hashPassword(dto.password),
      id: idUtils.genId(10, false),
    }, { ifCustomizeId: true });
    return R.ok(true);
  }

  async adminResetUserVisitorPsd(dto: ResetUserVisitorPsdDto): Promise<R> {
    await this.mysqlPrisma.updateById<UserVisitorDto>('sys_user_visitor', { ...dto, password: await encryptUtils.bcrypt.hashPassword(dto.password) });
    return R.ok(true);
  }
}
