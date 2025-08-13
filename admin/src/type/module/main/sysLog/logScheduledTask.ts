import { BaseClass2, PageDto } from "@/type/tablePage.ts";

export class LogScheduledTaskDto extends BaseClass2 {
  id!: number;
  taskTarget!: string;
  operateType!: string;
  ifSuccess!: string;
  remark!: string;
}

export class LogScheduledTaskSelDto extends PageDto {
}

export class LogScheduledTaskSelAllDto {
}

export class LogScheduledTaskInsDto {
  taskTarget!: string;
  operateType!: string;
  ifSuccess!: string;
  remark!: string;
}

export class LogScheduledTaskUpdDto extends LogScheduledTaskInsDto {
  id!: number;
}
