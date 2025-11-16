import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import {
  NodesWithWaysInPolygonDto,
  SignalLightGroupsInPolygonDto,
  CalculateLightsInPolygonDto,
  GetVehiclesInPolygonDto,
  QueryVehicleTrajectoryDto, GetAirspaceInPolygonDto,
} from "./dto";
import { PostgresqlPrismaoService } from "../../../infra/prisma/postgresql.prismao.service";
import {
  getAirspaceInPolygon,
  getVehiclesInPolygon,
  nodesWithWaysInPolygon, queryVehicleTrajectory,
  signalLightGroupsInPolygon,
  signalLightGroupsInPolygon2,
  signalLightGroupsInPolygon3
} from "./sqls";
import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import { GetAirspaceInPolygonVo, NodesWithWaysInPolygonVo, SignalLightGroupsInPolygonVo } from "./vo";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";
import { DctsCoreService } from "../core/dcts-core.service";
import { BaseContextService } from "../../../infra/base-context/base-context.service";
import { PrismaoService } from "../../../infra/prisma/prismao.service";
import { arrayUtils, baseUtils } from "@dcts/common";
import { WsService } from "../../../infra/ws/ws.service";
import { VehicleTrackPointDto } from "../vehicle/vehicle-track-point/dto";
import { Exception } from "../../../exception/exception";
import { SignalLightChildStyleMappingFacadeService } from "../signal-light/signal-light-child-style-mapping/signal-light-child-style-mapping.facade.service";
import { SignalLightStyleFacadeService } from "../signal-light/signal-light-style/signal-light-style.facade.service";
import { VehicleInfoFacadeService } from "../vehicle/vehicle-info/vehicle-info.facade.service";

@Injectable()
export class SpatialDataService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly dctsCoreService: DctsCoreService,
      private readonly bcs: BaseContextService,
      private readonly wsService: WsService,
      private readonly signalLightChildStyleMappingFacadeService: SignalLightChildStyleMappingFacadeService,
      private readonly signalLightStyleFacadeService: SignalLightStyleFacadeService,
      private readonly vehicleInfoFacadeService: VehicleInfoFacadeService,
  ) {
  }

  async nodesWithWaysInPolygon(dto: NodesWithWaysInPolygonDto): Promise<R<NodesWithWaysInPolygonVo>> {
    const polygon = nodesWithWaysInPolygon(dto);
    const allRoads = await this.pgsqlPrismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['allRoads']>(polygon.selAllRoadsSql);
    const allNodes = await this.pgsqlPrismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['allNodes']>(polygon.selAllNodesSql);
    const allRelation = await this.pgsqlPrismao.$queryRawUnsafe<NodesWithWaysInPolygonVo['relation']>(polygon.relation(allRoads.map(item => item.osm_id)));
    const vo = new NodesWithWaysInPolygonVo();
    vo.allRoads = allRoads
    vo.allNodes = allNodes
    vo.relation = allRelation
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
          const childStyleMappings = await this.signalLightChildStyleMappingFacadeService.selByChildIds(dtos1.map(item => item.id));
          ret.signalLightChildStyleMappings = childStyleMappings
          const styles = await this.signalLightStyleFacadeService.selByIds(childStyleMappings.map(item => item.styleId));
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
    const ret = await this.dctsCoreService.calculateLightsInPolygon(
        {
          signalLightGroupIds: ids,
          timeRange: dto.timeRange,
        },
        userData.loginRole, userData.userId, !dto.ifReturn);
    if (dto.ifReturn) {
      return R.ok(ret)
    } else {
      return R.ok(true)
    }
  }

  async getVehiclesInPolygon(dto: GetVehiclesInPolygonDto): Promise<R> {
    const sql = getVehiclesInPolygon(dto);
    const ret = await this.pgsqlPrismao.$queryRawUnsafe<VehicleTrackPointDto[]>(sql);
    const rett: { vehicleId: number, points: VehicleTrackPointDto[] }[] = []
    const allVIds = arrayUtils.arrNoRepeat(ret.map(tem => tem.vehicleId));
    for (const vid of allVIds) {
      rett.push({
        vehicleId: vid,
        points: ret.filter(item => item.vehicleId === vid)
      })
    }
    const userData = this.bcs.getUserData();
    const rettt = {data: rett}
    this.wsService.sendMsg(userData.loginRole, userData.userId, 'dcts:spatialData:getVehiclesInPolygon', JSON.stringify(rettt))
    return R.ok(true)
  }

  async queryVehicleTrajectory(dto: QueryVehicleTrajectoryDto): Promise<R> {
    const vehicles = await this.vehicleInfoFacadeService.selByPlateNumber(dto.plateNumber);
    if (vehicles.length === 0) {
      throw new Exception('车辆不存在')
    }
    const sql = queryVehicleTrajectory(dto, vehicles[0].id);
    const s = await this.pgsqlPrismao.$queryRawUnsafe(sql);
    return R.ok(s)
  }

  async getAirspaceInPolygon(dto: GetAirspaceInPolygonDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const sqls = getAirspaceInPolygon(dto, userData.loginRole, userData.userId);
    const s1 = await this.pgsqlPrismao.$queryRawUnsafe<GetAirspaceInPolygonVo['flightRestrictionZones']>(sqls.sql1);
    const s2 = await this.pgsqlPrismao.$queryRawUnsafe<GetAirspaceInPolygonVo['flightRoutes']>(sqls.sql2);
    const s3 = await this.pgsqlPrismao.$queryRawUnsafe<GetAirspaceInPolygonVo['selfFlightRestrictionZones']>(sqls.sql3);
    const s4 = await this.pgsqlPrismao.$queryRawUnsafe<GetAirspaceInPolygonVo['selfFlightRoutes']>(sqls.sql4);
    const ret = new GetAirspaceInPolygonVo()
    ret.flightRestrictionZones = s1
    ret.flightRoutes = s2
    ret.selfFlightRestrictionZones = s3
    ret.selfFlightRoutes = s4
    return R.ok(ret)
  }
}
