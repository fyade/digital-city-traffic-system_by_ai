import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightStrategyTypeDto } from "./dto";
import { final } from "../../../../util/base";

@Injectable()
export class SignalLightStrategyTypeFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async forCalculate(ids: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightStrategyTypeDto>('signal_light_strategy_type', {
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
        createTime: 'desc'
      },
    });
  }
}