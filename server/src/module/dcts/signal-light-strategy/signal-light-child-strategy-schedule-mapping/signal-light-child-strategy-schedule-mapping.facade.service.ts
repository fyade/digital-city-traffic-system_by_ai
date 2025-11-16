import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightChildStrategyScheduleMappingDto } from "./dto";

@Injectable()
export class SignalLightChildStrategyScheduleMappingFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async selByChildIds(childIds: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', {
      data: {
        childLightId: {
          in: {
            value: childIds
          }
        }
      },
      orderBy: false,
    });
  }

  async delByChildIds(childIds: number[]) {
    return this.pgsqlPrisma.delete<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', 'child_light_id', childIds);
  }
}
