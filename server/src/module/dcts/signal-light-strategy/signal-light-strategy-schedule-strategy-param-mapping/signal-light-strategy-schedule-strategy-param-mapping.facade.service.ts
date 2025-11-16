import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightStrategyScheduleStrategyParamMappingDto } from "./dto";

@Injectable()
export class SignalLightStrategyScheduleStrategyParamMappingFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async selBySSIds(ssids: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', {
      data: {
        strategyScheduleId: {
          in: {
            value: ssids
          }
        }
      },
      orderBy: false,
    });
  }
}