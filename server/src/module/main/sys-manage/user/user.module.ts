import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserLoginController } from './user-login.controller';
import { LogUserLoginFacadeService } from '../../sys-log/log-user-login/log-user-login.facade.service';
import { UserRoleFacadeService } from '../user-role/user-role.facade.service';
import { RoleFacadeService } from '../role/role.facade.service';
import { UserDeptFacadeService } from '../user-dept/user-dept.facade.service';
import { DeptFacadeService } from '../dept/dept.facade.service';
import { UserUserGroupFacadeService } from '../../../algorithm/user-user-group/user-user-group.facade.service';
import { UserGroupFacadeService } from '../../../algorithm/user-group/user-group.facade.service';
import { AdminTopFacadeService } from '../admin-top/admin-top.facade.service';
import { SysConfigFacadeService } from '../sys-config/sys-config.facade.service';

@Module({
  controllers: [UserController, UserLoginController],
  providers: [
    UserService,
    LogUserLoginFacadeService,
    UserRoleFacadeService,
    RoleFacadeService,
    UserDeptFacadeService,
    DeptFacadeService,
    UserUserGroupFacadeService,
    UserGroupFacadeService,
    AdminTopFacadeService,
    SysConfigFacadeService,
  ],
})
export class UserModule {}
