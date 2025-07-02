import { BaseClass, PageDto } from "@/type/tablePage.ts";

export class SignalLightGroupChildMappingDto extends BaseClass {
  id!: number;
  groupId!: number;
  childLightId!: number;
}

export class SignalLightGroupChildMappingSelDto extends PageDto {
}

export class SignalLightGroupChildMappingSelAllDto {
}

export class SignalLightGroupChildMappingInsDto {
  groupId!: number;
  childLightId!: number;
}

export class SignalLightGroupChildMappingUpdDto extends SignalLightGroupChildMappingInsDto {
  id!: number;
}
