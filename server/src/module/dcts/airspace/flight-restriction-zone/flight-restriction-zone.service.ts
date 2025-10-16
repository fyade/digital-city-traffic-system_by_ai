import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { FlightRestrictionZoneDto, FlightRestrictionZoneSelListDto, FlightRestrictionZoneSelAllDto, FlightRestrictionZoneInsOneDto, FlightRestrictionZoneUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PrismaoService } from "../../../../infra/prisma/prismao.service";
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";

@Injectable()
export class FlightRestrictionZoneService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('flight_restriction_zone', {
      notNullKeys: ['name', 'code', 'type', 'geometry', 'descr'],
    });
  }

  async selFlightRestrictionZone(dto: FlightRestrictionZoneSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'selList',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas: FlightRestrictionZoneDto[] = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'selCount',
      tblName: 'flight_restriction_zone',
      selParam: dto,
    });
    const total: CountSqlReturnDto = await this.pgsqlPrismao.$queryRawUnsafe(sqls2[0]);
    const pageVo = new PageVo<FlightRestrictionZoneDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllFlightRestrictionZone(dto: FlightRestrictionZoneSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'selAll',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(datas);
  }

  async selOnesFlightRestrictionZone(ids: number[]): Promise<R> {
    ids = Object.values(ids).map(Number);
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'selByIds',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(res);
  }

  async selOneFlightRestrictionZone(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'selById',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRestrictionZone(dto: FlightRestrictionZoneInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'ins',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      datas: [dto],
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRestrictionZones(dtos: FlightRestrictionZoneInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'ins',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      datas: dtos,
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async updFlightRestrictionZone(dto: FlightRestrictionZoneUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'upd',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      datas: [dto],
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updFlightRestrictionZones(dtos: FlightRestrictionZoneUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'upd',
      tblName: 'flight_restriction_zone',
      clas: new FlightRestrictionZoneDto(),
      datas: dtos,
      selfDefineSelKey: {
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        geometry: value => `ST_GeomFromText('POLYGON((${value}))', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async delFlightRestrictionZone(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRestrictionZoneDto>({
      type: 'del',
      tblName: 'flight_restriction_zone',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(true);
  }
}
