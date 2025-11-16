import { Module } from '@nestjs/common';
import { DctsUserController } from './dcts-user.controller';
import { DctsUserService } from './dcts-user.service';
import { UserRoleFacadeService } from "../../../main/sys-manage/user-role/user-role.facade.service";
import { RoleFacadeService } from "../../../main/sys-manage/role/role.facade.service";
import { UserDeptFacadeService } from "../../../main/sys-manage/user-dept/user-dept.facade.service";
import { DeptFacadeService } from "../../../main/sys-manage/dept/dept.facade.service";
import { UserUserGroupFacadeService } from "../../../algorithm/user-user-group/user-user-group.facade.service";
import { UserGroupFacadeService } from "../../../algorithm/user-group/user-group.facade.service";

@Module({
  controllers: [DctsUserController],
  providers: [
      DctsUserService,
      UserRoleFacadeService,
      RoleFacadeService,
      UserDeptFacadeService,
      DeptFacadeService,
      UserUserGroupFacadeService,
      UserGroupFacadeService,
  ]
})
export class DctsUserModule {}
