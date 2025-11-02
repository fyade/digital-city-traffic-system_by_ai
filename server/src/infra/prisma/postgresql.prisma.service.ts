import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { AuthService } from "../auth/auth.service";
import { BaseContextService } from "../base-context/base-context.service";
import { WinstonService } from "../winston/winston.service";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";
import { PrismaoService } from "./prismao.service";
import { UnknownException } from "../../exception/unknown.exception";

@Injectable()
export class PostgresqlPrismaService extends PrismaService {
  constructor(
      protected readonly prismao: PrismaoService,
      protected readonly authService: AuthService,
      protected readonly bcs: BaseContextService,
      protected readonly winston: WinstonService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {
    super(prismao, authService, bcs, winston);
  }

  protected getModel(model: string): any {
    const modelInstance = this.pgsqlPrismao[model];
    if (!modelInstance) {
      throw new UnknownException(this.bcs.getUserData().reqId);
    }
    return modelInstance;
  }

  public async getUserAccessibleData<T = number | string>(ids: T[], tblName: string,
                                                          {
                                                            idKey = 'id'
                                                          }: {
                                                            idKey?: string
                                                          } = {}
  ): Promise<T[]> {
    if (ids.length === 0) {
      return [];
    }
    const sql = super.getUserAccessibleDataSql<T>(ids, tblName, {idKey});
    const rows = await this.pgsqlPrismao.$queryRawUnsafe<{ id: T }[]>(sql);
    return rows.map((row) => row.id);
  }
}
