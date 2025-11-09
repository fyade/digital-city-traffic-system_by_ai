import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { UserFlightRestrictionZoneUserApplyDto, UserFlightRestrictionZoneUserApplySelListDto, UserFlightRestrictionZoneUserApplySelAllDto, UserFlightRestrictionZoneUserApplyInsOneDto, UserFlightRestrictionZoneUserApplyUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";
import { SQL_TRUE } from "../../../../infra/prisma/base";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { base } from "@dcts/common";

@Injectable()
export class UserFlightRestrictionZoneUserApplyService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('flight_restriction_zone_user_apply', {
      notNullKeys: ['aircraftId', 'taskName', 'geometry', 'startTime', 'endTime', 'applyStatus', 'applyOpinion', 'files'],
      completeMatchingKeys: ['createRole', 'createBy'],
    });
  }

  async selUserFlightRestrictionZoneUserApply(dto: UserFlightRestrictionZoneUserApplySelListDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'selList',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
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
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'selCount',
      tblName: 'flight_restriction_zone_user_apply',
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
    const pageVo = new PageVo<UserFlightRestrictionZoneUserApplyDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllUserFlightRestrictionZoneUserApply(dto: UserFlightRestrictionZoneUserApplySelAllDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'selAll',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
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
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesUserFlightRestrictionZoneUserApply(ids: number[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(ids, 'flight_restriction_zone_user_apply');
    if (_ids.length === 0) {
      return R.ok([]);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'selByIds',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selIds: _ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneUserFlightRestrictionZoneUserApply(id: number): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData([id], 'flight_restriction_zone_user_apply');
    if (_ids.length === 0) {
      return R.ok(null);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'selById',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
      selfDefineSelKey: {
        aircraftId: 'array_to_string(aircraft_id, \',\')',
        geometry: 'replace(replace(replace(st_astext(geometry), \'POLYGON((\', \'\'), \'))\', \'\'), \',\', \', \')'
      },
      selIds: _ids,
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insUserFlightRestrictionZoneUserApply(dto: UserFlightRestrictionZoneUserApplyInsOneDto): Promise<R> {
    dto.applyStatus = base.AFRASTypeEnum.aaa;
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'ins',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
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
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insUserFlightRestrictionZoneUserApplys(dtos: UserFlightRestrictionZoneUserApplyInsOneDto[]): Promise<R> {
    for (const dto of dtos) {
      dto.applyStatus = base.AFRASTypeEnum.aaa;
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'ins',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updUserFlightRestrictionZoneUserApply(dto: UserFlightRestrictionZoneUserApplyUpdOneDto): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData([dto.id], 'flight_restriction_zone_user_apply');
    if (_ids.length === 0) {
      return R.ok(null);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'upd',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
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
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updUserFlightRestrictionZoneUserApplys(dtos: UserFlightRestrictionZoneUserApplyUpdOneDto[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(dtos.map(d => d.id), 'flight_restriction_zone_user_apply');
    const _dtos = dtos.filter(d => _ids.includes(d.id));
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'upd',
      tblName: 'flight_restriction_zone_user_apply',
      clas: new UserFlightRestrictionZoneUserApplyDto(),
      datas: _dtos,
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<UserFlightRestrictionZoneUserApplyDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delUserFlightRestrictionZoneUserApply(ids: number[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(ids, 'flight_restriction_zone_user_apply');
    if (_ids.length === 0) {
      return R.ok(true);
    }
    const sqls = this.cPgsqlPrismao.genSql<UserFlightRestrictionZoneUserApplyDto>({
      type: 'del',
      tblName: 'flight_restriction_zone_user_apply',
      delIds: _ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }
}
