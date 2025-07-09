import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightChildStrategyScheduleMappingDto extends BaseClass {
  id!: number;
  childLightId!: number;
  strategyScheduleId!: number;
}

export class SignalLightChildStrategyScheduleMappingSelDto extends PageDto {
}

export class SignalLightChildStrategyScheduleMappingSelAllDto {
}

export class SignalLightChildStrategyScheduleMappingInsDto {
  childLightId!: number;
  strategyScheduleId!: number;
}

export class SignalLightChildStrategyScheduleMappingUpdDto extends SignalLightChildStrategyScheduleMappingInsDto {
  id!: number;
}
