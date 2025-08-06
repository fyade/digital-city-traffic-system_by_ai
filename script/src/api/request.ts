import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { serverConfig } from "@dcts/config";
import { Res } from "../common/Res";

const currentConfig = serverConfig.currentConfig();

export const axi = axios.create({
  baseURL: `http://localhost:${currentConfig.port}`,
  timeout: 1000 * 60 * 10,
  headers: {
    'Content-Type': 'application/json',
    [currentConfig.headerApiKeyName]: 'xt6jjinic2y93fbb_1754479138269',
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
export async function request<T>(config: AxiosRequestConfig): Promise<Res<T>> {
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
