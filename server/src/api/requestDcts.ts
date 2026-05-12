import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { serverConfig } from "@dcts/config";
import { R } from "../common/R";

const currentConfig = serverConfig.currentConfig();

const DCTS_REQUEST_TIMEOUT = 1000 * 60 * 10;

export const axi = axios.create({
  baseURL: `http://${currentConfig.dctsHost}:${currentConfig.port}`,
  timeout: DCTS_REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    [currentConfig.headerApiKeyName]: currentConfig.dctsApiKey,
  }
});

axi.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error?.response?.data || error);
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
