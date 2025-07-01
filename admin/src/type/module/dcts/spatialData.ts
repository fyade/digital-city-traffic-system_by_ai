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
  points!: PolygonPointDto[]
}

export class SignalLightGroupsInPolygonVo {
}
