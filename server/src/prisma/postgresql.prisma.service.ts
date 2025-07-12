import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UnknownException } from "../exception/unknown.exception";
import { AuthService } from "../module/auth/auth.service";
import { BaseContextService } from "../module/base-context/base-context.service";
import { PrismaoService } from "./prismao.service";
import { WinstonService } from "../module/winston/winston.service";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";

@Injectable()
export class PostgresqlPrismaService extends PrismaService {
  constructor(
      protected readonly authService: AuthService,
      protected readonly bcs: BaseContextService,
      protected readonly prismao: PrismaoService,
      protected readonly winston: WinstonService,
      private readonly pgprismao: PostgresqlPrismaoService,
  ) {
    super(authService, bcs, prismao, winston);
    this.pgprismao.$use(async (params, next) => {
      const result = await next(params);
      if (params.model && ['findMany', 'findFirst', 'create', 'update'].includes(params.action)) {
        return JSON.parse(JSON.stringify(result));
      }
      return result;
    })
  }

  protected getModel(model: string) {
    const modelInstance = this.pgprismao[model];
    if (!modelInstance) {
      throw new UnknownException(this.bcs.getUserData().reqId);
    }
    return modelInstance;
  }
}
