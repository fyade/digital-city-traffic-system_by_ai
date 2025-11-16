import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightStrategyParamDto } from "./dto";
import { final } from "../../../../util/base";

@Injectable()
export class SignalLightStrategyParamFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async forCalculate(ids: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightStrategyParamDto>('signal_light_strategy_param', {
      data: {
        id: {
          in: {
            value: ids
          }
        },
        ifDisabled: final.N
      },
      orderBy: {
        orderNum: 'asc',
        create_time: 'desc'
      },
    });
  }
}