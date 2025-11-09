import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";
import { SignalLightChildStyleMappingDto } from "../signal-light/signal-light-child-style-mapping/dto";
import { SignalLightStyleDto } from "../signal-light/signal-light-style/dto";
import { FlightRestrictionZoneDto } from "../airspace/flight-restriction-zone/dto";
import { FlightRouteDto } from "../airspace/flight-route/dto";
import { FlightRestrictionZoneUserApplyDto } from "../airspace/flight-restriction-zone-user-apply/dto";
import { FlightRouteUserApplyDto } from "../airspace/flight-route-user-apply/dto";

class NodesWithWaysInPolygonVoTags {
}

export class NodesWithWaysInPolygonVo {
  allNodes: { id: string, lon: number, lat: number, tags: NodesWithWaysInPolygonVoTags | null }[]
  allRoads: { osm_id: string, name: string | null, highway: string | null, motorcar: null, way: string }[]
  relation: { id: string, nodes: string[], tags: NodesWithWaysInPolygonVoTags | null }[]
}

export class SignalLightGroupsInPolygonVo {
  signalLightGroupInfos: SignalLightGroupInfoDto[]
  signalLightGroupChildMappings: SignalLightGroupChildMappingDto[]
  signalLightInfos: SignalLightInfoDto[]
  signalLightChildStyleMappings: SignalLightChildStyleMappingDto[]
  signalLightStyles: SignalLightStyleDto[]

  constructor() {
    this.signalLightGroupInfos = []
    this.signalLightGroupChildMappings = []
    this.signalLightInfos = []
    this.signalLightChildStyleMappings = []
    this.signalLightStyles = []
  }
}

export class GetAirspaceInPolygonVo {
  flightRestrictionZones: FlightRestrictionZoneDto[]
  flightRoutes: FlightRouteDto[]
  selfFlightRestrictionZones: FlightRestrictionZoneUserApplyDto[]
  selfFlightRoutes: FlightRouteUserApplyDto[]

  constructor() {
    this.flightRestrictionZones = []
    this.flightRoutes = []
    this.selfFlightRestrictionZones = []
    this.selfFlightRoutes = []
  }
}
