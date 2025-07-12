import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyParamDto extends BaseClass {
  id!: number;
  redDuration!: number;
  yellowDuration!: number;
  greenDuration!: number;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyParamSelDto extends PageDto {
}

export class SignalLightStrategyParamSelAllDto {
}

export class SignalLightStrategyParamInsDto {
  redDuration!: number;
  yellowDuration!: number;
  greenDuration!: number;
  ifDisabled!: string;
  orderNum!: number;
  remark!: string;
}

export class SignalLightStrategyParamUpdDto extends SignalLightStrategyParamInsDto {
  id!: number;
}
