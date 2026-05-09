import { getCurrentConfig } from '../index.js'
// import { configProd } from "./admin-prod.config.js";
import { currentVersion as cv, publicConfigDev } from './public.config.js'

export const currentVersion = `${cv}.front`

export const currentConfig = () => {
  return getCurrentConfig(config) as unknown as typeof config.dev
}

const config = {
  dev: {
    VITE_MODE: publicConfigDev.mode,
    VITE_BASEURL: `http://localhost:${publicConfigDev.bPort}`,
    VITE_FILE_BASEURL: `http://localhost:${publicConfigDev.bPort}${publicConfigDev.staticRoot}/`,
    VITE_API_PREFIX: '/api-dev',
    VITE_API_FILE_PREFIX: '/api-file-dev',
    VITE_API_WS_PREFIX: '/api-ws-dev',
    CHUNK_SIZE: 1024 * 1024 * 2,
  },
  // prod: configProd,
}
