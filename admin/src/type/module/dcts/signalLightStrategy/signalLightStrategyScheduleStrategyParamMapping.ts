import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyScheduleStrategyParamMappingDto extends BaseClass {
  id!: number;
  strategyScheduleId!: number;
  strategyParamId!: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingSelDto extends PageDto {
}

export class SignalLightStrategyScheduleStrategyParamMappingSelAllDto {
}

export class SignalLightStrategyScheduleStrategyParamMappingInsDto {
  strategyScheduleId!: number;
  strategyParamId!: number;
}

export class SignalLightStrategyScheduleStrategyParamMappingUpdDto extends SignalLightStrategyScheduleStrategyParamMappingInsDto {
  id!: number;
}
