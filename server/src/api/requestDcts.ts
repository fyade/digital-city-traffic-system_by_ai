import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { serverConfig } from "@dcts/config";
import { R } from "../common/R";

const currentConfig = serverConfig.currentConfig();

let apiKey = ''
if (currentConfig.mode === 'dev') {
  apiKey = 'xt6jjinic2y93fbb_1754479138269'
} else if (currentConfig.mode === 'prod') {
  apiKey = 'kexm4wmlr9zvvw87_1760019751694'
}

export const axi = axios.create({
  baseURL: `http://localhost:${currentConfig.port}`,
  timeout: 1000 * 60 * 10,
  headers: {
    'Content-Type': 'application/json',
    [currentConfig.headerApiKeyName]: apiKey,
  }
});

axi.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error.response.data);
    }
)

/**
 * 请求
 * @param config
 */
export async function request<T>(config: AxiosRequestConfig): Promise<R<T>> {
  return new Promise((resolve, reject) => {
    axi({
      url: config.url,
      method: config.method || 'POST',
      params: config.params,
      data: config.data,
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
