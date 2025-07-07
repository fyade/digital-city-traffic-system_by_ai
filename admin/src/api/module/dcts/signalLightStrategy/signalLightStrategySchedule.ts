import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";

export const signalLightStrategyScheduleApi: ApiConfig<SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/signal-light-strategy/signal-light-strategy-schedule/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/signal-light-strategy/signal-light-strategy-schedule/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule/s',
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
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule/s',
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
    url: '/dcts/signal-light-strategy/signal-light-strategy-schedule',
    method: 'DELETE',
    data: ids
  })
}
