import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightStrategyScheduleDto } from "./dto";
import { final } from "../../../../util/base";

@Injectable()
export class SignalLightStrategyScheduleFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async forCalculate(ids: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', {
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