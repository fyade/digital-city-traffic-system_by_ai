import { Module } from '@nestjs/common';
import { UserVisitorController } from './user-visitor.controller';
import { UserVisitorService } from './user-visitor.service';
import { UserRoleFacadeService } from '../../sys-manage/user-role/user-role.facade.service';
import { RoleFacadeService } from '../../sys-manage/role/role.facade.service';
import { UserDeptFacadeService } from '../../sys-manage/user-dept/user-dept.facade.service';
import { DeptFacadeService } from '../../sys-manage/dept/dept.facade.service';
import { UserUserGroupFacadeService } from '../../../algorithm/user-user-group/user-user-group.facade.service';
import { UserGroupFacadeService } from '../../../algorithm/user-group/user-group.facade.service';

@Module({
  controllers: [UserVisitorController],
  providers: [
    UserVisitorService,
    UserRoleFacadeService,
    RoleFacadeService,
    UserDeptFacadeService,
    DeptFacadeService,
    UserUserGroupFacadeService,
    UserGroupFacadeService,
  ],
})
export class UserVisitorModule {}
