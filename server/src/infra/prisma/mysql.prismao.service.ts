import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@dcts/prisma-generated/client-mysql'
import { serverConfig } from "@dcts/config";
import { baseUtils } from "@dcts/common";

const env = serverConfig.currentConfig();

@Injectable()
export class MysqlPrismaoService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        dbMysql: {
          url: serverConfig.getMysqlUrlFromEnv(env),
        },
      },
      log: (env.prismaLogLevel && baseUtils.typeOf(env.prismaLogLevel) === 'array') ? (env.prismaLogLevel as Prisma.PrismaClientOptions['log']) : [],
    });
  }
}
