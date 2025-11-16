import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { SignalLightStyleDto } from "./dto";

@Injectable()
export class SignalLightStyleFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async selByIds(ids: number[]) {
    return this.pgsqlPrisma.findByIds<SignalLightStyleDto>('signal_light_style', ids);
  }
}