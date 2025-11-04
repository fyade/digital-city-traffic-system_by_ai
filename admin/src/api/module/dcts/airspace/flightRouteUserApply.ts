import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto } from "@/type/module/dcts/airspace/flightRouteUserApply.ts";

export const flightRouteUserApplyApi: ApiConfig<FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/airspace/flight-route-user-apply',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/airspace/flight-route-user-apply/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/airspace/flight-route-user-apply/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/airspace/flight-route-user-apply/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/airspace/flight-route-user-apply',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/airspace/flight-route-user-apply',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/airspace/flight-route-user-apply/s',
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
    url: '/dcts/airspace/flight-route-user-apply/s',
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
    url: '/dcts/airspace/flight-route-user-apply',
    method: 'DELETE',
    data: ids
  })
}
