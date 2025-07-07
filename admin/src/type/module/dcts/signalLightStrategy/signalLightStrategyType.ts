import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStrategyTypeDto extends BaseClass {
  id!: number;
  name!: string;
  description!: string;
}

export class SignalLightStrategyTypeSelDto extends PageDto {
}

export class SignalLightStrategyTypeSelAllDto {
}

export class SignalLightStrategyTypeInsDto {
  name!: string;
  description!: string;
}

export class SignalLightStrategyTypeUpdDto extends SignalLightStrategyTypeInsDto {
  id!: number;
}
