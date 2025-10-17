import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { FlightRouteDto, FlightRouteSelListDto, FlightRouteSelAllDto, FlightRouteInsOneDto, FlightRouteUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";

@Injectable()
export class FlightRouteService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('flight_route', {
      notNullKeys: ['name', 'path'],
    });
  }

  async selFlightRoute(dto: FlightRouteSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'selList',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas: FlightRouteDto[] = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'selCount',
      tblName: 'flight_route',
      selParam: dto,
    });
    const total: CountSqlReturnDto = await this.pgsqlPrismao.$queryRawUnsafe(sqls2[0]);
    const pageVo = new PageVo<FlightRouteDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllFlightRoute(dto: FlightRouteSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'selAll',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(datas);
  }

  async selOnesFlightRoute(ids: number[]): Promise<R> {
    ids = Object.values(ids).map(Number);
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'selByIds',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(res);
  }

  async selOneFlightRoute(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'selById',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRoute(dto: FlightRouteInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'ins',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      datas: [dto],
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insFlightRoutes(dtos: FlightRouteInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'ins',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      datas: dtos,
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async updFlightRoute(dto: FlightRouteUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'upd',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      datas: [dto],
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updFlightRoutes(dtos: FlightRouteUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'upd',
      tblName: 'flight_route',
      clas: new FlightRouteDto(),
      datas: dtos,
      selfDefineSelKey: {
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineInsUpdKey: {
        path: value => `ST_GeomFromText('LINESTRING(${value})', 4326)`
      },
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async delFlightRoute(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<FlightRouteDto>({
      type: 'del',
      tblName: 'flight_route',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(true);
  }
}
