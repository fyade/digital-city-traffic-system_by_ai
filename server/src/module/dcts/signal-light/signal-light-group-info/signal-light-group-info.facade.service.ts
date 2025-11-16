import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { SignalLightGroupInfoDto } from "./dto";

@Injectable()
export class SignalLightGroupInfoFacadeService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {
  }

  async selByIds(ids: number[]) {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'selByIds',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    return res
  }
}