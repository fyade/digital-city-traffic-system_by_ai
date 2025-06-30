import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightGroupInfoDto extends BaseClass {
  id!: number;
  name!: string;
  location!: string;
  description!: string;
}

export class SignalLightGroupInfoSelDto extends PageDto {
}

export class SignalLightGroupInfoSelAllDto {
}

export class SignalLightGroupInfoInsDto {
  name!: string;
  location!: string;
  description!: string;
}

export class SignalLightGroupInfoUpdDto extends SignalLightGroupInfoInsDto {
  id!: number;
}
