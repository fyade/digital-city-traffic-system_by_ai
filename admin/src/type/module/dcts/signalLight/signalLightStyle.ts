import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightStyleDto extends BaseClass {
  id!: number;
  name!: string;
  style!: string;
}

export class SignalLightStyleSelDto extends PageDto {
}

export class SignalLightStyleSelAllDto {
}

export class SignalLightStyleInsDto {
  name!: string;
  style!: string;
}

export class SignalLightStyleUpdDto extends SignalLightStyleInsDto {
  id!: number;
}
