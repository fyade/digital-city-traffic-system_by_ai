import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightChildStyleMappingDto extends BaseClass {
  id!: number;
  childId!: number;
  styleId!: number;
}

export class SignalLightChildStyleMappingSelDto extends PageDto {
}

export class SignalLightChildStyleMappingSelAllDto {
}

export class SignalLightChildStyleMappingInsDto {
  childId!: number;
  styleId!: number;
}

export class SignalLightChildStyleMappingUpdDto extends SignalLightChildStyleMappingInsDto {
  id!: number;
}
