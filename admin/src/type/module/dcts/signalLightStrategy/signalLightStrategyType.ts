import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyTypeDto extends BaseClass {
  id!: number;
  name!: string;
  description!: string;
  strategyType!: string;
  scheduleType!: string;
  startTime!: string;
  endTime!: string;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyTypeSelDto extends PageDto {
}

export class SignalLightStrategyTypeSelAllDto {
}

export class SignalLightStrategyTypeInsDto {
  name!: string;
  description!: string;
  strategyType!: string;
  scheduleType!: string;
  startTime!: string;
  endTime!: string;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyTypeUpdDto extends SignalLightStrategyTypeInsDto {
  id!: number;
}
