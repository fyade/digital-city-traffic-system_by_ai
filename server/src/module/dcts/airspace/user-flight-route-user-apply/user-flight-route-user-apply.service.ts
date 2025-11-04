import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { UserFlightRouteUserApplyDto, UserFlightRouteUserApplySelListDto, UserFlightRouteUserApplySelAllDto, UserFlightRouteUserApplyInsOneDto, UserFlightRouteUserApplyUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";
import { SQL_TRUE } from "../../../../infra/prisma/base";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class UserFlightRouteUserApplyService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('flight_route_user_apply', {
      notNullKeys: ['aircraftId', 'taskName', 'path', 'startTime', 'endTime'],
      completeMatchingKeys: ['createRole', 'createBy'],
    });
  }

  async selUserFlightRouteUserApply(dto: UserFlightRouteUserApplySelListDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'selList',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: {
        ...dto,
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'selCount',
      tblName: 'flight_route_user_apply',
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: {
        ...dto,
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
    });
    const total = await this.pgsqlPrismao.$queryRawUnsafe<CountSqlReturnDto>(sqls2[0]);
    const pageVo = new PageVo<UserFlightRouteUserApplyDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllUserFlightRouteUserApply(dto: UserFlightRouteUserApplySelAllDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'selAll',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selfDefineSelValue: {
        aircraftId: value => value ? `aircraft_id @> array [${value}]` : SQL_TRUE
      },
      selParam: {
        ...dto,
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesUserFlightRouteUserApply(ids: number[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(ids, 'flight_route_user_apply');
    if (_ids.length === 0) {
      return R.ok([]);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'selByIds',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selIds: _ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneUserFlightRouteUserApply(id: number): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData([id], 'flight_route_user_apply');
    if (_ids.length === 0) {
      return R.ok(null);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'selById',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        path: 'replace(replace(replace(st_astext(path), \'LINESTRING Z (\', \'\'), \')\', \'\'), \',\', \', \')'
      },
      selIds: _ids,
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insUserFlightRouteUserApply(dto: UserFlightRouteUserApplyInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'ins',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
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
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insUserFlightRouteUserApplys(dtos: UserFlightRouteUserApplyInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'ins',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updUserFlightRouteUserApply(dto: UserFlightRouteUserApplyUpdOneDto): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData([dto.id], 'flight_route_user_apply');
    if (_ids.length === 0) {
      return R.ok(null);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'upd',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
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
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updUserFlightRouteUserApplys(dtos: UserFlightRouteUserApplyUpdOneDto[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(dtos.map(d => d.id), 'flight_route_user_apply');
    const _dtos = dtos.filter(d => _ids.includes(d.id));
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'upd',
      tblName: 'flight_route_user_apply',
      clas: new UserFlightRouteUserApplyDto(),
      datas: _dtos,
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRouteUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delUserFlightRouteUserApply(ids: number[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(ids, 'flight_route_user_apply');
    if (_ids.length === 0) {
      return R.ok(true);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRouteUserApplyDto>({
      type: 'del',
      tblName: 'flight_route_user_apply',
      delIds: _ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }
}
