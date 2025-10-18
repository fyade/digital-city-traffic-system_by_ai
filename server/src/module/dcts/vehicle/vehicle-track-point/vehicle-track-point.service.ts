import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import {
  VehicleTrackPointDto,
  VehicleTrackPointSelListDto,
  VehicleTrackPointSelAllDto,
  VehicleTrackPointInsOneDto,
  VehicleTrackPointUpdOneDto
} from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";

@Injectable()
export class VehicleTrackPointService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('vehicle_track_point', {
      notNullKeys: ['vehicleId', 'point', 'heading'],
      numberKeys: ['vehicleId', 'heading'],
    });
  }

  async selVehicleTrackPoint(dto: VehicleTrackPointSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'selList',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas: VehicleTrackPointDto[] = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'selCount',
      tblName: 'vehicle_track_point',
      selParam: dto,
    });
    const total: CountSqlReturnDto = await this.pgsqlPrismao.$queryRawUnsafe(sqls2[0]);
    const pageVo = new PageVo<VehicleTrackPointDto>(pageNum, pageSize, total[0].count, datas)
    return R.ok(pageVo);
  }

  async selAllVehicleTrackPoint(dto: VehicleTrackPointSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'selAll',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(datas);
  }

  async selOnesVehicleTrackPoint(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'selByIds',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(res);
  }

  async selOneVehicleTrackPoint(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'selById',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insVehicleTrackPoint(dto: VehicleTrackPointInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'ins',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      datas: [dto],
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdKey: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insVehicleTrackPoints(dtos: VehicleTrackPointInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'ins',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      datas: dtos,
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdKey: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async updVehicleTrackPoint(dto: VehicleTrackPointUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'upd',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      datas: [dto],
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdKey: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updVehicleTrackPoints(dtos: VehicleTrackPointUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'upd',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      datas: dtos,
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdKey: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async delVehicleTrackPoint(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'del',
      tblName: 'vehicle_track_point',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(true);
  }
}
