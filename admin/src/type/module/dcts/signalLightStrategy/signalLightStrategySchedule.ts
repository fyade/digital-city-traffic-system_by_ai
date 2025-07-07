import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyScheduleDto extends BaseClass {
  id!: number;
  typeId!: number;
  scheduleType!: string;
  startTime!: string;
  endTime!: string;
  cronExpression!: string;
}

export class SignalLightStrategyScheduleSelDto extends PageDto {
}

export class SignalLightStrategyScheduleSelAllDto {
}

export class SignalLightStrategyScheduleInsDto {
  typeId!: number;
  scheduleType!: string;
  startTime!: string;
  endTime!: string;
  cronExpression!: string;
}

export class SignalLightStrategyScheduleUpdDto extends SignalLightStrategyScheduleInsDto {
  id!: number;
}
