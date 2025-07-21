import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyParamDto extends BaseClass {
  id!: number;
  lightType!: string;
  round!: number;
  duration!: number;
  currentLight!: string;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyParamSelDto extends PageDto {
}

export class SignalLightStrategyParamSelAllDto {
}

export class SignalLightStrategyParamInsDto {
  lightType!: string;
  round!: number;
  duration!: number;
  currentLight!: string;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyParamUpdDto extends SignalLightStrategyParamInsDto {
  id!: number;
}
