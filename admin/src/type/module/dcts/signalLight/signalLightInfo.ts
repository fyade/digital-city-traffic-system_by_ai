import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightInfoDto extends BaseClass {
  id!: number;
  name!: string;
  location!: string;
  description!: string;
}

export class SignalLightInfoSelDto extends PageDto {
}

export class SignalLightInfoSelAllDto {
}

export class SignalLightInfoInsDto {
  name!: string;
  location!: string;
  description!: string;
}

export class SignalLightInfoUpdDto extends SignalLightInfoInsDto {
  id!: number;
}
