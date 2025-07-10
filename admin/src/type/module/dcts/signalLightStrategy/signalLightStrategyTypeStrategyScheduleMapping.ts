import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyTypeStrategyScheduleMappingDto extends BaseClass {
  id!: number;
  strategyTypeId!: number;
  strategyScheduleId!: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingSelDto extends PageDto {
}

export class SignalLightStrategyTypeStrategyScheduleMappingSelAllDto {
}

export class SignalLightStrategyTypeStrategyScheduleMappingInsDto {
  strategyTypeId!: number;
  strategyScheduleId!: number;
}

export class SignalLightStrategyTypeStrategyScheduleMappingUpdDto extends SignalLightStrategyTypeStrategyScheduleMappingInsDto {
  id!: number;
}
