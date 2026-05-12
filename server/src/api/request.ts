import axios, { AxiosRequestConfig } from 'axios';

export const axi = axios.create();

/**
 * 请求
 * @param config
 */
export async function serverRequest<T>(config: AxiosRequestConfig) {
  return new Promise<T>(async (resolve, reject) => {
    try {
      const ret = await axi({
        baseURL: config.baseURL,
        url: config.url,
        method: config.method || 'POST',
        params: config.params,
        data: config.data,
        timeout: config.timeout || 1000 * 60 * 10,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      resolve(ret.data);
    } catch (e) {
      reject(e)
    }
  });
}

/**
 * 算法请求
 * @param config
 */
export async function requestSF<T = any>(config: AxiosRequestConfig): Promise<T> {
  const ret = await axi({
    baseURL: config.baseURL,
    url: config.url,
    method: config.method || 'POST',
    params: config.params,
    data: config.data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return ret.data;
}
