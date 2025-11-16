import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightGroupChildMappingDto } from "./dto";

@Injectable()
export class SignalLightGroupChildMappingFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async selByGroupIds(groupIds: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', {
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

  async delByIds(ids: number[]) {
    return this.pgsqlPrisma.deleteById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', ids);
  }

  async delByChildIds(childIds: number[]) {
    return this.pgsqlPrisma.delete<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', 'child_light_id', childIds)
  }
}
