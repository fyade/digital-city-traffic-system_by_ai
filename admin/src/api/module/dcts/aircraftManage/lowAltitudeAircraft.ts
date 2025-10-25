import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { LowAltitudeAircraftDto, LowAltitudeAircraftUpdDto } from "@/type/module/dcts/aircraftManage/lowAltitudeAircraft.ts";

export const lowAltitudeAircraftApi: ApiConfig<LowAltitudeAircraftDto, LowAltitudeAircraftUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/aircraft-manage/low-altitude-aircraft',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/aircraft-manage/low-altitude-aircraft/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/aircraft-manage/low-altitude-aircraft/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/aircraft-manage/low-altitude-aircraft/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/aircraft-manage/low-altitude-aircraft',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/aircraft-manage/low-altitude-aircraft',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/aircraft-manage/low-altitude-aircraft/s',
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
    url: '/dcts/aircraft-manage/low-altitude-aircraft/s',
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
    url: '/dcts/aircraft-manage/low-altitude-aircraft',
    method: 'DELETE',
    data: ids
  })
}
