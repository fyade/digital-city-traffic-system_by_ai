import { getCurrentConfig } from "../index.js";
// import { configProd } from "./server-prod.config.js";
import { currentVersion as cv, publicConfigDev } from './public.config.js'

export const currentVersion = `${cv}.server`;

export const currentConfig = () => {
  return getCurrentConfig(config) as unknown as typeof config.dev
}

const mysqlConnectParam = '';
const config = {
  dev: {
    mode: publicConfigDev.mode,
    port: publicConfigDev.bPort,
    wsPort: publicConfigDev.bWsPort,
    staticRoot: publicConfigDev.staticRoot,
    redis: {
      host: 'localhost',
      port: 6379,
      password: '123456',
      database: 19,
      databaseForQueue: 29,
    },
    mysql: {
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'proj_digital-city-traffic-system_by_ai',
      timezone: 'Asia/Shanghai',
    },
    postgresql: {
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'digital-city-traffic-system_by_ai',
      schema: 'public',
      timezone: 'Asia/Shanghai',
    },
    file: {
      uploadPath: '/home/fy/桌面/nestProjFilePath/digital-city-traffic-system_by_ai/',
      maxSizeOfFull: 1024 * 1024 * 10,
    },
    log: {
      logSavePath: '/home/fy/桌面/nestProjLogPath/digital-city-traffic-system_by_ai/',
      maxSizeOfKogFile: 1024 * 1024,
    },
    headerApiKeyName: 'dcts-api-key',
    ifShowSwagger: true,
    ifIgnoreVerificationCode: true,
    ifLogSQLExecutionTime: true,
    prismaLogLevel: ['query', 'info', 'warn', 'error'],
    jwtConstants: {
      secret: 'aodfhjASELFHJ@ad',
      expireTime: 60 * 60 * 24,
    },
    VERIFICATION_CODE_EXPIRE_TIME: 60 * 10,
    SECRET_KEY_HD_DB: 'almfdma@alkfmLNLK',
    SECRET_CON_PROJ_AUTH: 'aklsjKJB@san',
  },
  // prod: configProd,
};

export function getMysqlUrlFromEnv(env: typeof config.dev): string {
  return `mysql://${env.mysql.username}:${env.mysql.password}@${env.mysql.host}:${env.mysql.port}/${env.mysql.database}`;
}

export function getPostgresqlUrlFromEnv(env: typeof config.dev) {
  return `postgresql://${env.postgresql.username}:${env.postgresql.password}@${env.postgresql.host}:${env.postgresql.port}/${env.postgresql.database}?schema=${env.postgresql.schema}`
}
