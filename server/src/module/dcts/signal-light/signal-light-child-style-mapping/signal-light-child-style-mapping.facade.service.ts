import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightChildStyleMappingDto } from "./dto";

@Injectable()
export class SignalLightChildStyleMappingFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async selByChildIds(childIds: number[]) {
    return this.pgsqlPrisma.findAll<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', {
      data: {
        childId: {
          in: {
            value: childIds
          }
        }
      },
      orderBy: false,
    });
  }
}