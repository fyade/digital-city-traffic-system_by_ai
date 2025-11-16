import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightGroupStrategyTypeMappingDto } from "./dto";

@Injectable()
export class SignalLightGroupStrategyTypeMappingFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  selByGroupIds(groupIds: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', {
      data: {
        groupId: {
          in: {
            value: groupIds
          }
        }
      },
      orderBy: false,
    });
  }
}