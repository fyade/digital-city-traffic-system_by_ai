import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { AircraftTrackPointDto, AircraftTrackPointSelListDto, AircraftTrackPointSelAllDto, AircraftTrackPointInsOneDto, AircraftTrackPointUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";

@Injectable()
export class AircraftTrackPointService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('aircraft_track_point', {
      notNullKeys: ['aircraftId', 'point', 'height', 'heading'],
      numberKeys: ['aircraftId', 'height', 'heading'],
    });
  }

  async selAircraftTrackPoint(dto: AircraftTrackPointSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'selList',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'selCount',
      tblName: 'aircraft_track_point',
      selParam: dto,
    });
    const total = await this.pgsqlPrismao.$queryRawUnsafe<CountSqlReturnDto>(sqls2[0]);
    const pageVo = new PageVo<AircraftTrackPointDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllAircraftTrackPoint(dto: AircraftTrackPointSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'selAll',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesAircraftTrackPoint(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'selByIds',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneAircraftTrackPoint(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'selByIds',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insAircraftTrackPoint(dto: AircraftTrackPointInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'ins',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      datas: [dto],
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdValue: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insAircraftTrackPoints(dtos: AircraftTrackPointInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'ins',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      datas: dtos,
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdValue: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updAircraftTrackPoint(dto: AircraftTrackPointUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'upd',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      datas: [dto],
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdValue: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updAircraftTrackPoints(dtos: AircraftTrackPointUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'upd',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      datas: dtos,
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdValue: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delAircraftTrackPoint(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'del',
      tblName: 'aircraft_track_point',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }
}
