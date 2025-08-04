import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { SignalLightGroupChildMappingDto } from "@/type/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { SignalLightChildStyleMappingDto } from "@/type/module/dcts/signalLight/signalLightChildStyleMapping.ts";
import { SignalLightStyleDto } from "@/type/module/dcts/signalLight/signalLightStyle.ts";
import { base } from "@dcts/common";

class PolygonPointDto {
  lon!: number;
  lat!: number;
}

export class NodesWithWaysInPolygonDto {
  version?: string
  points!: PolygonPointDto[]
}

class NodesWithWaysInPolygonVoTags {
}

export class NodesWithWaysInPolygonVo {
  allNodes!: { id: string, lon: number, lat: number, tags: NodesWithWaysInPolygonVoTags | null }[]
  allRoads!: { osm_id: string, name: string | null, highway: string | null, motorcar: null, way: string }[]
  relation!: { id: string, nodes: string[], tags: NodesWithWaysInPolygonVoTags | null }[]
}

export class SignalLightGroupsInPolygonDto {
  version?: string
  ifChild?: boolean
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
  version?: string
  ifReturn?: boolean;
  groupIds?: number[]
  points?: PolygonPointDto[]
}

class SignalLightRunParamDParam {
  id!: string
  start!: number
  end!: number
  color!: base.SignalLightColorEnum
  lightType!: base.SLSPLTTypeEnum[]
}

export class CalculateLightsInPolygonVo {
  signalLightGroupId!: number
  signalLightChildId!: number
  runParam!: SignalLightRunParamDParam[]
}
