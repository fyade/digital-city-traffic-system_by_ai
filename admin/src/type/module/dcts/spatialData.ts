class NodesWithWaysInPolygonDto_point {
  lon!: number;
  lat!: number;
}

export class NodesWithWaysInPolygonDto {
  version!: string
  points!: NodesWithWaysInPolygonDto_point[]
}

export class NodesWithWaysInPolygonVo {
  allNodes!: { id: string, lon: number, lat: number, tags: any }[]
  allRoads!: { osm_id: string, name: string | null, highway: string | null, motorcar: null, way: string }[]
}
