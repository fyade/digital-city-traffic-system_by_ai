import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class LogUserLoginWsDto extends BaseClass {
  id!: number;
  userId!: string;
  loginRole!: string;
  loginIp!: string;
  loginPosition!: string;
  loginBrowser!: string;
  loginOs!: string;
  ifSuccess!: string;
  failType!: string;
  remark!: string;
}

export class LogUserLoginWsSelDto extends PageDto {
}

export class LogUserLoginWsSelAllDto {
}

export class LogUserLoginWsInsDto {
  userId!: string;
  loginRole!: string;
  loginIp!: string;
  loginPosition!: string;
  loginBrowser!: string;
  loginOs!: string;
  ifSuccess!: string;
  failType!: string;
  remark!: string;
}

export class LogUserLoginWsUpdDto extends LogUserLoginWsInsDto {
  id!: number;
}
