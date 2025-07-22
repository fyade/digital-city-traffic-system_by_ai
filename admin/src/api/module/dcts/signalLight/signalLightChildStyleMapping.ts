import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import {
  SignalLightChildStyleMappingDto,
  SignalLightChildStyleMappingInsDto,
  SignalLightChildStyleMappingUpdDto
} from "@/type/module/dcts/signalLight/signalLightChildStyleMapping.ts";

export const signalLightChildStyleMappingApi: ApiConfig<SignalLightChildStyleMappingDto, SignalLightChildStyleMappingUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/signal-light/signal-light-child-style-mapping',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/signal-light/signal-light-child-style-mapping/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/signal-light/signal-light-child-style-mapping/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/signal-light/signal-light-child-style-mapping/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/signal-light/signal-light-child-style-mapping',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/signal-light/signal-light-child-style-mapping',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/signal-light/signal-light-child-style-mapping/s',
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
    url: '/dcts/signal-light/signal-light-child-style-mapping/s',
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
    url: '/dcts/signal-light/signal-light-child-style-mapping',
    method: 'DELETE',
    data: ids
  })
}

export function signalLightChildStyleMappingInsV2(obj: SignalLightChildStyleMappingInsDto) {
  return request({
    url: '/dcts/signal-light/signal-light-child-style-mapping/v2',
    method: 'POST',
    data: obj
  })
}
