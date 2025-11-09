import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class WsOnlineUserDto extends BaseClass {
  id!: string;
  userid!: string;
  username!: string;
  loginRole!: string;
  loginTime!: string;
  loginIp!: string;
  loginOs!: string;
  loginBrowser!: string;
  expireTimeStamp!: number;
  pageContext!: string;
}

export class WsOnlineUserSelDto extends PageDto {}

export class WsOnlineUserSelAllDto {}

export class WsOnlineUserInsDto {
  userid!: string;
  username!: string;
  loginRole!: string;
  loginTime!: string;
  loginIp!: string;
  loginOs!: string;
  loginBrowser!: string;
  expireTimeStamp!: number;
  pageContext!: string;
}

export class WsOnlineUserUpdDto extends WsOnlineUserInsDto {
  id!: string;
}
