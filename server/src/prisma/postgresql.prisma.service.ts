import { Injectable } from "@nestjs/common";
import { AuthService } from "../module/auth/auth.service";
import { BaseContextService } from "../module/base-context/base-context.service";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";

@Injectable()
export class PostgresqlPrismaService {
  constructor(
      private readonly authService: AuthService,
      private readonly bcs: BaseContextService,
      private readonly prismao: PostgresqlPrismaoService
  ) {
  }
}
