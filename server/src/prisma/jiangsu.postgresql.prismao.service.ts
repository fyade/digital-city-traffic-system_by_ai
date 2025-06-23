import { PrismaClient } from '@dcts/prisma-generated/client-postgresql-jiangsu'
import { Injectable } from "@nestjs/common";
import { serverConfig } from "@dcts/config";
import { baseUtils } from "@dcts/common";
import { Prisma } from "@prisma/client";

const env = serverConfig.currentConfig()

@Injectable()
export class JiangsuPostgresqlPrismaoService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        dbPostgresqlJiangsu: {
          url: serverConfig.getPostgresqlUrl2FromEnv(env)
        }
      },
      log: (env.prismaLogLevel && baseUtils.typeOf(env.prismaLogLevel) === 'array') ? (env.prismaLogLevel as Prisma.PrismaClientOptions['log']) : [],
    });
  }

  public getOrigin() {
    return this as unknown as PrismaClient;
  }
}
