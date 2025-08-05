import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@dcts/prisma-generated/client'
import { serverConfig } from "@dcts/config";
import { baseUtils } from "@dcts/common";

const env = serverConfig.currentConfig();

@Injectable()
export class MysqlPrismaoService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: serverConfig.getMysqlUrlFromEnv(env),
        },
      },
      log: (env.prismaLogLevel && baseUtils.typeOf(env.prismaLogLevel) === 'array') ? (env.prismaLogLevel as Prisma.PrismaClientOptions['log']) : [],
    });
    // 使用中间件对查询结果中的 Bigint 类型进行序列化
    super.$use(async (params, next) => {
      const t1 = Date.now();
      const result = await next(params);
      const t2 = Date.now();
      if (env.ifLogSQLExecutionTime) {
        console.info(`Query ${params.model}.${params.action} took ${t2 - t1}ms`);
      }
      return this.serialize(result);
    });
  }

  private serialize(obj) {
    if (baseUtils.typeOf(obj) === 'bigint') {
      return parseInt(`${obj}`);
    } else if (baseUtils.typeOf(obj) === 'object') {
      return JSON.parse(
        JSON.stringify(obj, (key, value) => {
          if (baseUtils.typeOf(value) === 'bigint') {
            return parseInt(`${value}`);
          }
          return value;
        }),
      );
    } else if (baseUtils.typeOf(obj) === 'array') {
      return obj.map(item => {
        return this.serialize(item);
      });
    }
    return obj;
  }
}
