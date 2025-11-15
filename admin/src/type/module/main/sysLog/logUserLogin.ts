import { BaseClass2, PageDto } from "@/type/tablePage.ts";

export class LogUserLoginDto extends BaseClass2 {
  id!: number;
  userId!: string;
  loginRole!: string;
  loginType!: string;
  loginIp!: string;
  loginPosition!: string;
  loginBrowser!: string;
  loginOs!: string;
  ifSuccess!: string;
  failType!: string;
  remark!: string;
}

export class LogUserLoginSelDto extends PageDto {
}

export class LogUserLoginSelAllDto {
}

export class LogUserLoginInsDto {
  userId!: string;
  loginRole!: string;
  loginType!: string;
  loginIp!: string;
  loginPosition!: string;
  loginBrowser!: string;
  loginOs!: string;
  ifSuccess!: string;
  failType!: string;
  remark!: string;
}

export class LogUserLoginUpdDto extends LogUserLoginInsDto {
  id!: number;
}
