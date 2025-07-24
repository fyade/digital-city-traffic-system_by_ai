import { getCurrentConfig } from "../index.js";
import { configProd } from "./public-prod.config.js";

export const APP_NAME = '数智交通全域调度系统(测试版)'
export const currentVersion = '0.7.2';

export const currentConfig = () => {
  return getCurrentConfig(config) as unknown as typeof config.dev
}

const config = {
  dev: {
    mode: 'dev',
    fPort: 7947,
    bPort: 8937,
    bWsPort: 8938,
    staticRoot: '/static/file',
    SECRET_KEY: 'ajkfbdaJHG@Dk',
  },
  prod: configProd,
}

export const publicConfigDev = config.dev
export const publicConfigProd = config.prod
