import { BaseClass, PageDto } from "@/type/tablePage.ts";
import { RoleDto } from "@/type/module/main/sysManage/role.ts";
import { DeptDto } from "@/type/module/main/sysManage/dept.ts";
import { UserGroupDto } from "@/type/module/algorithm/userGroup.ts";
import { UserVisitorDto } from "@/type/module/main/otherUser/userVisitor.ts";
import { DctsUserDto } from "@/type/module/dcts/user/dctsUser.ts";

export class _UserDto extends BaseClass {
  id!: string;
  username!: string;
  nickname!: string;
  password!: string;
  avatar!: string;
  sex!: string;
  email!: string;
  tel!: string;
}

export class UserDto extends _UserDto {
  ifWithRole!: string
}

export class UserSelAllDto {
}

export class UserInsDto {
  username?: string;
  nickname?: string;
  password?: string;
  avatar?: string;
  sex?: string;
  email?: string;
  tel?: string;
}

export class UserUpdDto extends UserInsDto {
  id!: string;
}

export class UserDto2 {
  id!: string;
  username!: string;
  nickname!: string;
}

export class LoginDto2 {
  username!: string
  password!: string
  loginRole!: string
  psdType?: string
}

export class LoginDto extends LoginDto2 {
  verificationCode!: string
  verificationCodeUuid!: string
}

export class RegistDto extends LoginDto2 {
}

export class UserUpdPsdDto {
  oldp!: string
  newp1!: string
  newp2!: string
}

export class AdminResetUserPsdDto {
  id!: string
  password!: string
}

export class UserDto_ extends UserDto {
  roles!: RoleDto[]
  depts!: DeptDto[]
  ugs!: UserGroupDto[]
}

export class MultiAuthUserDto {
  admin!: UserDto | null;
  visitor!: UserVisitorDto | null;
  dctsUser!: DctsUserDto | null;
}
