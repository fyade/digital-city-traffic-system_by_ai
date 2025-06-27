import { getCurrentConfig } from '../index.js'
import { configProd } from "./admin-prod.config.js";
import { currentVersion as cv, currentConfig as publicCurrentConfig } from './public.config.js'

const config1 = publicCurrentConfig();

export const APP_NAME = '数字孪生城市交通管理系统'
export const currentVersion = `${cv}.1`

export const currentConfig = () => {
  return getCurrentConfig(config) as unknown as typeof config.dev
}

const config = {
  dev: {
    VITE_MODE: config1.mode,
    VITE_BASEURL: `http://localhost:${config1.bPort}`,
    VITE_FILE_BASEURL: `http://localhost:${config1.bPort}${config1.staticRoot}/`,
    VITE_API_PREFIX: '/api-dev',
    VITE_API_FILE_PREFIX: '/api-file-dev',
    VITE_API_WS_PREFIX: '/api-ws-dev',
    CHUNK_SIZE: 1024 * 1024 * 2,
  },
  prod: configProd,
}
