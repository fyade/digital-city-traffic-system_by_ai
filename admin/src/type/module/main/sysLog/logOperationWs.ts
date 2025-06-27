import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class LogOperationWsDto extends BaseClass {
  id!: number;
  socketId!: string;
  callIp!: string;
  hostName!: string;
  wsPerms!: string;
  userId!: string;
  loginRole!: string;
  ifSuccess!: string;
  remark!: string;
}

export class LogOperationWsSelDto extends PageDto {
}

export class LogOperationWsSelAllDto {
}

export class LogOperationWsInsDto {
  socketId!: string;
  callIp!: string;
  hostName!: string;
  wsPerms!: string;
  userId!: string;
  loginRole!: string;
  ifSuccess!: string;
  remark!: string;
}

export class LogOperationWsUpdDto extends LogOperationWsInsDto {
  id!: number;
}
