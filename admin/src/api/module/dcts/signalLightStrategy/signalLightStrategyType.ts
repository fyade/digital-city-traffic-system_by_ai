import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";

export const signalLightStrategyTypeApi: ApiConfig<SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-type',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-type/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/signal-light-strategy/signal-light-strategy-type/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/signal-light-strategy/signal-light-strategy-type/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-type',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-type',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-type/s',
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
    url: '/dcts/signal-light-strategy/signal-light-strategy-type/s',
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
    url: '/dcts/signal-light-strategy/signal-light-strategy-type',
    method: 'DELETE',
    data: ids
  })
}
