import { PrismaClient } from '../../../prisma-generated/client-postgresql'
import { serverConfig } from "@dcts/config";
import { Injectable } from "@nestjs/common";
import { BaseContextService } from "../module/base-context/base-context.service";
import { baseUtils } from "@dcts/common";
import { Prisma } from "@prisma/client";

const env = serverConfig.currentConfig()

@Injectable()
export class PostgresqlPrismaoService extends PrismaClient {
  constructor(
      private readonly bcs: BaseContextService,
  ) {
    super({
      datasources: {
        dbPostgresql: {
          url: serverConfig.getPostgresqlFromEnv(env)
        }
      },
      log: (env.prismaLogLevel && baseUtils.typeOf(env.prismaLogLevel) === 'array') ? (env.prismaLogLevel as Prisma.PrismaClientOptions['log']) : [],
    });
  }

  public getOrigin() {
    return this as unknown as PrismaClient;
  }

  protected getUserId() {
    return this.bcs.getUserData().userId || '???';
  }

  protected getLoginRole() {
    return this.bcs.getUserData().loginRole || '???';
  }
}
