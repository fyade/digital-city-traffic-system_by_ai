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
    super.$use(async (params, next) => {
      const t1 = Date.now();
      const result = await next(params);
      const t2 = Date.now();
      if (env.ifLogSQLExecutionTime) {
        console.info(`Query ${params.model}.${params.action} took ${t2 - t1}ms`);
      }
      return this.serializeBigInt(result);
    });
    super.$use(async (params, next) => {
      const result = await next(params);
      if (params.model && ['findMany', 'findFirst', 'create', 'update'].includes(params.action)) {
        return JSON.parse(JSON.stringify(result));
      }
      return result;
    })
  }

  private serializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'bigint') {
      return obj.toString();
    }

    if (Array.isArray(obj)) {
      return obj.map(this.serializeBigInt.bind(this));
    }

    if (typeof obj === 'object') {
      const serializedObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          serializedObj[key] = this.serializeBigInt(obj[key]);
        }
      }
      return serializedObj;
    }

    return obj;
  }
}
