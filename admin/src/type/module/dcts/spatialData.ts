import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { SignalLightGroupChildMappingDto } from "@/type/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { SignalLightColorEnum, SLSPLTTypeEnum } from "@/utils/base.ts";
import { SignalLightChildStyleMappingDto } from "@/type/module/dcts/signalLight/signalLightChildStyleMapping.ts";
import { SignalLightStyleDto } from "@/type/module/dcts/signalLight/signalLightStyle.ts";

class PolygonPointDto {
  lon!: number;
  lat!: number;
}

export class NodesWithWaysInPolygonDto {
  version!: string
  points!: PolygonPointDto[]
}

export class NodesWithWaysInPolygonVo {
  allNodes!: { id: string, lon: number, lat: number, tags: any }[]
  allRoads!: { osm_id: string, name: string | null, highway: string | null, motorcar: null, way: string }[]
}

export class SignalLightGroupsInPolygonDto {
  version!: string
  ifChild!: boolean
  points!: PolygonPointDto[]
}

export class SignalLightGroupsInPolygonVo {
  signalLightGroupInfos!: SignalLightGroupInfoDto[]
  signalLightGroupChildMappings!: SignalLightGroupChildMappingDto[]
  signalLightInfos!: SignalLightInfoDto[]
  signalLightChildStyleMappings!: SignalLightChildStyleMappingDto[]
  signalLightStyles!: SignalLightStyleDto[]
}

export class CalculateLightsInPolygonDto {
  version!: string
  points!: PolygonPointDto[]
}

class CalculateLightsInPolygonVoDParam {
  start!: number
  end!: number
  color!: SignalLightColorEnum
  lightType!: SLSPLTTypeEnum[]
}

export class CalculateLightsInPolygonVo {
  signalLightGroupId!: number
  signalLightChildId!: number
  runParam!: CalculateLightsInPolygonVoDParam[]
}
