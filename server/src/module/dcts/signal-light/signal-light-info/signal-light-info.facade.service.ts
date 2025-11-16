import { Injectable } from "@nestjs/common";
import { SignalLightInfoDto } from "./dto";
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";

@Injectable()
export class SignalLightInfoFacadeService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {
  }

  async selByIds(ids: number[]) {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'selByIds',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    return res
  }

  async delByIds(ids: number[]) {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'del',
      tblName: 'signal_light_info',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return true
  }
}