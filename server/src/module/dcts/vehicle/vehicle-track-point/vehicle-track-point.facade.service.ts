import { Injectable } from "@nestjs/common";
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { VehicleTrackPointDto, VehicleTrackPointInsOneDto } from "./dto";
import { numberUtils } from "@dcts/common";

@Injectable()
export class VehicleTrackPointFacadeService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {
  }

  async insMore(datas: VehicleTrackPointInsOneDto[]) {
    const sqls = this.cPgsqlPrismao.genSql<VehicleTrackPointDto>({
      type: 'ins',
      tblName: 'vehicle_track_point',
      clas: new VehicleTrackPointDto(),
      datas: datas,
      selfDefineSelKey: {
        point: 'concat(st_x(point)::text, \',\', st_y(point)::text)'
      },
      selfDefineInsUpdValue: {
        point: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`,
        createTime: value => {
          const date = new Date(value);
          return `'${date.getFullYear()}-${numberUtils.addZero(date.getMonth() + 1)}-${numberUtils.addZero(date.getDate())} ${numberUtils.addZero(date.getHours())}:${numberUtils.addZero(date.getMinutes())}:${date.getSeconds()}.000000 +08:00'`
        },
        updateTime: value => {
          const date = new Date(value);
          return `'${date.getFullYear()}-${numberUtils.addZero(date.getMonth() + 1)}-${numberUtils.addZero(date.getDate())} ${numberUtils.addZero(date.getHours())}:${numberUtils.addZero(date.getMinutes())}:${date.getSeconds()}.000000 +08:00'`
        },
      }
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(re[0]);
    }
    return true
  }
}