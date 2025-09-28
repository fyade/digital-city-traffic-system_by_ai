import { Injectable } from "@nestjs/common";
import { PrismaClient, Prisma } from '@dcts/prisma-generated/client-postgresql'
import { serverConfig } from "@dcts/config";
import { baseUtils } from "@dcts/common";

const env = serverConfig.currentConfig()

@Injectable()
export class PostgresqlPrismaoService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        dbPostgresql: {
          url: serverConfig.getPostgresqlUrlFromEnv(env)
        }
      },
      log: (env.prismaLogLevel && baseUtils.typeOf(env.prismaLogLevel) === 'array') ? (env.prismaLogLevel as Prisma.PrismaClientOptions['log']) : [],
    });
  }
}
