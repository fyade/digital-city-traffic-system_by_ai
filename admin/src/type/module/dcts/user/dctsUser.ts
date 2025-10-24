import { BaseClass, PageDto } from "@/type/tablePage.ts";
import { RoleDto } from "@/type/module/main/sysManage/role.ts";
import { DeptDto } from "@/type/module/main/sysManage/dept.ts";
import { UserGroupDto } from "@/type/module/algorithm/userGroup.ts";

export class DctsUserDto extends BaseClass {
  id!: string;
  username!: string;
  nickname!: string;
  password!: string;
  avatar!: string;
  sex!: string;
  email!: string;
  tel!: string;
}

export class DctsUserSelDto extends PageDto {
  ifWithRole!: string
}

export class DctsUserSelAllDto {
}

export class DctsUserInsDto {
  username?: string;
  nickname?: string;
  password?: string;
  avatar?: string;
  sex?: string;
  email?: string;
  tel?: string;
}

export class DctsUserUpdDto extends DctsUserInsDto {
  id!: string;
}

export class DctsUserDto2 {
  id!: string;
  username!: string;
  nickname!: string;
}

export class DctsUserLoginDto {
  username!: string
  password!: string
}

export class DctsUserRegistDto extends DctsUserLoginDto {
}

export class AdminResetDctsUserPsdDto {
  id!: string;
  password!: string;
}

export class DctsUserDto_ extends DctsUserDto {
  roles!: RoleDto[]
  depts!: DeptDto[]
  ugs!: UserGroupDto[]
}
