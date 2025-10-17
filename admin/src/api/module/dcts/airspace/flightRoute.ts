import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { FlightRouteDto, FlightRouteUpdDto } from "@/type/module/dcts/airspace/flightRoute.ts";

export const flightRouteApi: ApiConfig<FlightRouteDto, FlightRouteUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/airspace/flight-route',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/airspace/flight-route/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/airspace/flight-route/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/airspace/flight-route/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/airspace/flight-route',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/airspace/flight-route',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/airspace/flight-route/s',
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
    url: '/dcts/airspace/flight-route/s',
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
    url: '/dcts/airspace/flight-route',
    method: 'DELETE',
    data: ids
  })
}
