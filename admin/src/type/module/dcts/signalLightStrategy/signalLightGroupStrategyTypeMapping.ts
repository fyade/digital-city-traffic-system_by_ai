import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightGroupStrategyTypeMappingDto extends BaseClass {
  id!: number;
  groupId!: number;
  strategyTypeId!: number;
}

export class SignalLightGroupStrategyTypeMappingSelDto extends PageDto {
}

export class SignalLightGroupStrategyTypeMappingSelAllDto {
}

export class SignalLightGroupStrategyTypeMappingInsDto {
  groupId!: number;
  strategyTypeId!: number;
}

export class SignalLightGroupStrategyTypeMappingUpdDto extends SignalLightGroupStrategyTypeMappingInsDto {
  id!: number;
}
