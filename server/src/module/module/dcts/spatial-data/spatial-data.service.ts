import { Injectable } from '@nestjs/common';
import { R } from "../../../../common/R";
import { NodesWithWaysInPolygonDto, SignalLightGroupsInPolygonDto } from "./dto";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";
import { nodesWithWaysInPolygon, signalLightGroupsInPolygon } from "./sqls";

@Injectable()
export class SpatialDataService {
  constructor(
      private readonly pgprismao: PostgresqlPrismaoService
  ) {
  }

  async nodesWithWaysInPolygon(dto: NodesWithWaysInPolygonDto): Promise<R> {
    const polygon = nodesWithWaysInPolygon(dto);
    const allRoads = await this.pgprismao.$queryRawUnsafe(polygon.selAllRoadsSql);
    const allNodes = await this.pgprismao.$queryRawUnsafe(polygon.selAllNodesSql);
    return R.ok({
      allRoads,
      allNodes
    });
  }

  async signalLightGroupsInPolygon(dto: SignalLightGroupsInPolygonDto): Promise<R> {
    const s = signalLightGroupsInPolygon(dto);
    const slgs = await this.pgprismao.$queryRawUnsafe(s);
    return R.ok(slgs)
  }
}
