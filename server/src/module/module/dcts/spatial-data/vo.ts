import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";

export class NodesWithWaysInPolygonVo {
  allNodes: { id: string, lon: number, lat: number, tags: any }[]
  allRoads: { osm_id: string, name: string | null, highway: string | null, motorcar: null, way: string }[]
}

export class SignalLightGroupsInPolygonVo {
  signalLightGroupInfos: SignalLightGroupInfoDto[]
  signalLightGroupChildMappings: SignalLightGroupChildMappingDto[]
  signalLightInfos: SignalLightInfoDto[]
}
