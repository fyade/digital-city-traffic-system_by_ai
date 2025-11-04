import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { FlightRouteUserApplyDto, FlightRouteUserApplySelListDto, FlightRouteUserApplySelAllDto, FlightRouteUserApplyInsOneDto, FlightRouteUserApplyUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";
import { SQL_TRUE } from "../../../../infra/prisma/base";

@Injectable()
export class FlightRouteUserApplyService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('flight_route_user_apply', {
      notNullKeys: ['aircraftId', 'taskName', 'path', 'startTime', 'endTime'],
      completeMatchingKeys: ['createRole', 'createBy'],
    });
  }

  async selFlightRouteUserApply(dto: FlightRouteUserApplySelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'selList',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'selCount',
      tblName: 'flight_route_user_apply',
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: dto,
    });
    const total = await this.pgsqlPrismao.$queryRawUnsafe<CountSqlReturnDto>(sqls2[0]);
    const pageVo = new PageVo<FlightRouteUserApplyDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllFlightRouteUserApply(dto: FlightRouteUserApplySelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'selAll',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesFlightRouteUserApply(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'selByIds',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneFlightRouteUserApply(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'selById',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRouteUserApply(dto: FlightRouteUserApplyInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'ins',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      datas: [dto],
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRouteUserApplys(dtos: FlightRouteUserApplyInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'ins',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      datas: dtos,
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updFlightRouteUserApply(dto: FlightRouteUserApplyUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'upd',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      datas: [dto],
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updFlightRouteUserApplys(dtos: FlightRouteUserApplyUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'upd',
      tblName: 'flight_route_user_apply',
      clas: new FlightRouteUserApplyDto(),
      datas: dtos,
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<FlightRouteUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delFlightRouteUserApply(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteUserApplyDto>({
      type: 'del',
      tblName: 'flight_route_user_apply',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }
}
