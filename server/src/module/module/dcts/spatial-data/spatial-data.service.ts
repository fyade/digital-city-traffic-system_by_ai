import { Injectable } from '@nestjs/common';
import { R } from "../../../../common/R";
import { CalculateLightsInPolygonDto, NodesWithWaysInPolygonDto, SignalLightGroupsInPolygonDto } from "./dto";
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
import { DctsCoreService } from "../core/dcts-core.service";
import { BaseContextService } from "../../../base-context/base-context.service";
import { PrismaoService } from "../../../../prisma/prismao.service";
import { baseUtils } from "@dcts/common";
import { SignalLightChildStyleMappingDto } from "../signal-light/signal-light-child-style-mapping/dto";
import { SignalLightStyleDto } from "../signal-light/signal-light-style/dto";

@Injectable()
export class SpatialDataService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly dctsCoreService: DctsCoreService,
      private readonly bcs: BaseContextService,
  ) {
  }

  async nodesWithWaysInPolygon(dto: NodesWithWaysInPolygonDto): Promise<R> {
    const polygon = nodesWithWaysInPolygon(dto);
    const allRoads = await this.pgsqlPrismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['allRoads']>(polygon.selAllRoadsSql);
    const allNodes = await this.pgsqlPrismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['allNodes']>(polygon.selAllNodesSql);
    const vo = new NodesWithWaysInPolygonVo();
    vo.allRoads = allRoads
    vo.allNodes = allNodes
    return R.ok(vo);
  }

  async signalLightGroupsInPolygon(dto: SignalLightGroupsInPolygonDto): Promise<R> {
    const s = signalLightGroupsInPolygon(dto.points);
    const slgs = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(s);
    const ret = new SignalLightGroupsInPolygonVo()
    ret.signalLightGroupInfos = slgs
    if (dto.ifChild) {
      ret.signalLightGroupChildMappings = []
      ret.signalLightInfos = []
      if (slgs.length > 0) {
        const s1 = signalLightGroupsInPolygon2(slgs.map(item => item.id));
        const slgcmds = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupChildMappingDto[]>(s1);
        ret.signalLightGroupChildMappings = slgcmds
        if (slgcmds.length > 0) {
          const s2 = signalLightGroupsInPolygon3(slgcmds.map(item => item.childLightId));
          const dtos1 = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(s2);
          ret.signalLightInfos = dtos1
          const defaultSelArg = this.prismao.defaultSelArg();
          const childStyleMappings = (await this.pgsqlPrismao.signal_light_child_style_mapping.findMany({
            where: {
              child_id: {
                in: dtos1.map(item => item.id)
              },
              ...defaultSelArg.where
            }
          })).map(baseUtils.objToCamelCase<SignalLightChildStyleMappingDto>);
          ret.signalLightChildStyleMappings = childStyleMappings
          const styles = (await this.pgsqlPrismao.signal_light_style.findMany({
            where: {
              id: {
                in: childStyleMappings.map(item => item.styleId)
              },
              ...defaultSelArg.where
            }
          })).map(baseUtils.objToCamelCase<SignalLightStyleDto>);
          ret.signalLightStyles = styles
        }
      }
    }
    return R.ok(ret)
  }

  async calculateLightsInPolygon(dto: CalculateLightsInPolygonDto): Promise<R> {
    const ids: number[] = []
    if (dto.groupIds) {
      ids.push(...dto.groupIds)
    } else {
      const s = signalLightGroupsInPolygon(dto.points);
      const slgs = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(s);
      const slgIds = slgs.map(item => item.id);
      ids.push(...slgIds)
    }
    const userData = this.bcs.getUserData();
    const ret = await this.dctsCoreService.calculateLightsInPolygon(ids, userData.loginRole, userData.userId);
    if (dto.ifReturn) {
      return R.ok(ret)
    } else {
      return R.ok(true)
    }
  }
}
