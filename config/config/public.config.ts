import { getCurrentConfig } from "../index.js";
import { configProd } from "./public-prod.config.js";

export const APP_NAME = '数智交通全域调度系统'
export const currentVersion = '0.9.2.059';

export const currentConfig = () => {
  return getCurrentConfig(config) as unknown as typeof config.dev
}

const config = {
  dev: {
    mode: 'dev',
    fPort: 7947,
    bPort: 8937,
    bWsPort: 8938,
    scriptPort: 8939,
    staticRoot: '/static/file',
    docSwaggerPath: '/doc-swagger',
    SECRET_KEY: 'ajkfbdaJHG@Dk',
  },
  prod: configProd,
}

export const publicConfigDev = config.dev
export const publicConfigProd = config.prod
