import { Injectable } from "@nestjs/common";
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { BaseContextService } from "../../../../infra/base-context/base-context.service";
import { AircraftTrackPointDto, AircraftTrackPointInsOneDto } from "./dto";
import { numberUtils } from "@dcts/common";

@Injectable()
export class AircraftTrackPointFacadeService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
  }

  async insMore(dtos: AircraftTrackPointInsOneDto[]) {
    const sqls = this.cPgsqlPrismao.genSql<AircraftTrackPointDto>({
      type: 'ins',
      tblName: 'aircraft_track_point',
      clas: new AircraftTrackPointDto(),
      datas: dtos,
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<AircraftTrackPointDto[]>(sql);
      res.push(re[0]);
    }
    return true
  }
}
