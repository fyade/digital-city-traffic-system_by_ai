export class NodesWithWaysInPolygonDto_point {
  lon!: number;
  lat!: number;
}

export class NodesWithWaysInPolygonDto {
  version!: string
  points!: NodesWithWaysInPolygonDto_point[]
}
