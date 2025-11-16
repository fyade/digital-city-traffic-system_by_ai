import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightStrategyTypeStrategyScheduleMappingDto } from "./dto";

@Injectable()
export class SignalLightStrategyTypeStrategyScheduleMappingFacadeService {
  constructor(private readonly pgsqlPrisma: PostgresqlPrismaService,) {
  }

  async selBySTypeIds(STypeIds: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', {
      data: {
        strategyTypeId: {
          in: {
            value: STypeIds
          }
        }
      },
      orderBy: false,
    });
  }
}