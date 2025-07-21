import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyScheduleDto extends BaseClass {
  id!: number;
  name!: string;
  description!: string;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyScheduleSelDto extends PageDto {
}

export class SignalLightStrategyScheduleSelAllDto {
}

export class SignalLightStrategyScheduleInsDto {
  name!: string;
  description!: string;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyScheduleUpdDto extends SignalLightStrategyScheduleInsDto {
  id!: number;
}
