import { Injectable } from '@nestjs/common';
import { R } from "../../../../common/R";
import { NodesWithWaysInPolygonDto, SignalLightGroupsInPolygonDto } from "./dto";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";
import {
  nodesWithWaysInPolygon,
  signalLightGroupsInPolygon,
  signalLightGroupsInPolygon2,
  signalLightGroupsInPolygon3
} from "./sqls";
import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import { NodesWithWaysInPolygonVo, SignalLightGroupsInPolygonVo } from "./vo";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";

@Injectable()
export class SpatialDataService {
  constructor(
      private readonly pgprismao: PostgresqlPrismaoService
  ) {
  }

  async nodesWithWaysInPolygon(dto: NodesWithWaysInPolygonDto): Promise<R> {
    const polygon = nodesWithWaysInPolygon(dto);
    const allRoads = await this.pgprismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['allRoads']>(polygon.selAllRoadsSql);
    const allNodes = await this.pgprismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['allNodes']>(polygon.selAllNodesSql);
    const vo = new NodesWithWaysInPolygonVo();
    vo.allRoads = allRoads
    vo.allNodes = allNodes
    return R.ok(vo);
  }

  async signalLightGroupsInPolygon(dto: SignalLightGroupsInPolygonDto): Promise<R> {
    const s = signalLightGroupsInPolygon(dto);
    const slgs = await this.pgprismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(s);
    const ret = new SignalLightGroupsInPolygonVo()
    ret.signalLightGroupInfos = slgs
    if (dto.ifChild) {
      ret.signalLightGroupChildMappings = []
      ret.signalLightInfos = []
      if (slgs.length > 0) {
        const s1 = signalLightGroupsInPolygon2(slgs.map(item => item.id));
        const slgcmds = await this.pgprismao.$queryRawUnsafe<SignalLightGroupChildMappingDto[]>(s1);
        ret.signalLightGroupChildMappings = slgcmds
        if (slgcmds.length > 0) {
          const s2 = signalLightGroupsInPolygon3(slgcmds.map(item => item.childLightId));
          const dtos1 = await this.pgprismao.$queryRawUnsafe<SignalLightInfoDto[]>(s2);
          ret.signalLightInfos = dtos1
        }
      }
    }
    return R.ok(ret)
  }
}
