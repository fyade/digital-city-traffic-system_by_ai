import { getCurrentConfig } from "../index.js";
import { configProd } from "./script-prod.config.js";
import { currentVersion as cv, publicConfigDev } from './public.config.js'

export const currentVersion = `${cv}.1`;

export const currentConfig = () => {
  return getCurrentConfig(config) as unknown as typeof config.dev
}

const config = {
  dev: {
    mode: publicConfigDev.mode,
    port: publicConfigDev.scriptPort
  },
  prod: configProd
}
