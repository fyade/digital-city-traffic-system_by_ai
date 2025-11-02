import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplySelListDto, FlightRestrictionZoneUserApplySelAllDto, FlightRestrictionZoneUserApplyInsOneDto, FlightRestrictionZoneUserApplyUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";
import { SQL_TRUE } from "../../../../infra/prisma/base";

@Injectable()
export class FlightRestrictionZoneUserApplyService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('flight_restriction_zone_user_apply', {
      notNullKeys: ['aircraftId', 'taskName', 'geometry', 'startTime', 'endTime'],
      completeMatchingKeys: ['createRole', 'createBy'],
    });
  }

  async selFlightRestrictionZoneUserApply(dto: FlightRestrictionZoneUserApplySelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'selList',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'selCount',
      tblName: 'flight_restriction_zone_user_apply',
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: dto,
    });
    const total = await this.pgsqlPrismao.$queryRawUnsafe<CountSqlReturnDto>(sqls2[0]);
    const pageVo = new PageVo<FlightRestrictionZoneUserApplyDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllFlightRestrictionZoneUserApply(dto: FlightRestrictionZoneUserApplySelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'selAll',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesFlightRestrictionZoneUserApply(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'selByIds',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneFlightRestrictionZoneUserApply(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'selById',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRestrictionZoneUserApply(dto: FlightRestrictionZoneUserApplyInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'ins',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      datas: [dto],
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRestrictionZoneUserApplys(dtos: FlightRestrictionZoneUserApplyInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'ins',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      datas: dtos,
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updFlightRestrictionZoneUserApply(dto: FlightRestrictionZoneUserApplyUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'upd',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      datas: [dto],
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updFlightRestrictionZoneUserApplys(dtos: FlightRestrictionZoneUserApplyUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'upd',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new FlightRestrictionZoneUserApplyDto(),
      datas: dtos,
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdValue: {
        aircraftId: value => `array [${value}]`,
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<FlightRestrictionZoneUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delFlightRestrictionZoneUserApply(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneUserApplyDto>({
      type: 'del',
      tblName: 'flight_restriction_zone_user_apply',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }
}
