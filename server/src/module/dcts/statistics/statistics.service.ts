import { Injectable } from '@nestjs/common';
import { PostgresqlPrismaoService } from '../../../infra/prisma/postgresql.prismao.service';
import { MysqlPrismaoService } from '../../../infra/prisma/mysql.prismao.service';
import { DctsCalculateService } from '../core/dcts-calculate.service';
import { R } from '../../../common/R';
import {
  SignalLightStatusDistributionDto,
  VehicleFlowStatisticsDto,
} from './dto';
import { activeVehiclesLast5MinSql, vehicleFlowSql } from './sqls';
import { final } from '../../../util/base';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly pgsqlPrismao: PostgresqlPrismaoService,
    private readonly mysqlPrismao: MysqlPrismaoService,
    private readonly dctsCalculateService: DctsCalculateService,
  ) {}

  async vehicleFlow(dto: VehicleFlowStatisticsDto): Promise<R> {
    const sql = vehicleFlowSql(dto);
    const rows = await this.pgsqlPrismao.$queryRawUnsafe<
      { timeBucket: string; vehicleCount: number }[]
    >(sql);
    return R.ok(rows.map(r => ({
      timeBucket: r.timeBucket,
      vehicleCount: Number(r.vehicleCount),
    })));
  }

  async signalLightStatus(dto: SignalLightStatusDistributionDto): Promise<R> {
    const runParams = await this.dctsCalculateService.calculateLight(
      dto.groupIds,
      dto.timeRange,
    );
    const results: {
      signalLightGroupId: number;
      signalLightChildId: number;
      color: string;
      totalDurationMs: number;
    }[] = [];
    for (const rp of runParams) {
      const colorDurations = new Map<string, number>();
      for (const param of rp.runParam) {
        if (param.start >= dto.timeRange[0] && param.end <= dto.timeRange[1]) {
          const duration = param.end - param.start;
          colorDurations.set(
            param.color,
            (colorDurations.get(param.color) || 0) + duration,
          );
        }
      }
      for (const [color, totalDurationMs] of colorDurations) {
        results.push({
          signalLightGroupId: rp.signalLightGroupId,
          signalLightChildId: rp.signalLightChildId,
          color,
          totalDurationMs,
        });
      }
    }
    return R.ok(results);
  }

  async overview(): Promise<R> {
    const [totalVehiclesResult, totalGroupsResult, activeVehiclesResult] =
      await Promise.all([
        this.mysqlPrismao.$queryRawUnsafe<{ total: number }[]>(
          `SELECT COUNT(*) AS "total" FROM vehicle_info WHERE deleted = '${final.N}'`,
        ),
        this.pgsqlPrismao.$queryRawUnsafe<{ total: number }[]>(
          `SELECT COUNT(*) AS "total" FROM signal_light_group_info WHERE deleted = '${final.N}'`,
        ),
        this.pgsqlPrismao.$queryRawUnsafe<{ activeCount: number }[]>(
          activeVehiclesLast5MinSql(),
        ),
      ]);
    return R.ok({
      totalVehicles: Number(totalVehiclesResult[0]?.total || 0),
      totalSignalLightGroups: Number(totalGroupsResult[0]?.total || 0),
      activeVehiclesLast5Min: Number(
        activeVehiclesResult[0]?.activeCount || 0,
      ),
    });
  }
}
