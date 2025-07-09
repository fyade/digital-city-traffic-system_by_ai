import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { SignalLightInfoDto, SignalLightInfoUpdDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";

export const signalLightInfoApi: ApiConfig<SignalLightInfoDto, SignalLightInfoUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/signal-light/signal-light-info',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/signal-light/signal-light-info/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/signal-light/signal-light-info/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/signal-light/signal-light-info/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/signal-light/signal-light-info',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/signal-light/signal-light-info',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/signal-light/signal-light-info/s',
    method: 'POST',
    data: {
      items: objs,
    }
  }),
  /**
   * 修改多个
   * @param objs
   */
  updateMore: (objs) => request({
    url: '/dcts/signal-light/signal-light-info/s',
    method: 'PUT',
    data: {
      items: objs,
    }
  }),
  /**
   * 删除
   * @param ids
   */
  deleteList: (...ids) => request({
    url: '/dcts/signal-light/signal-light-info',
    method: 'DELETE',
    data: ids
  })
}

export function signalLightInfoDelV2(...ids: number[]) {
  return request({
    url: '/dcts/signal-light/signal-light-info/v2',
    method: 'DELETE',
    data: ids
  })
}
