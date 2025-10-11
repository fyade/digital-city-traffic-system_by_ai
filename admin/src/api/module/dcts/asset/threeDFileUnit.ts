import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { ThreeDFileUnitDto, ThreeDFileUnitUpdDto } from "@/type/module/dcts/asset/threeDFileUnit.ts";

export const threeDFileUnitApi: ApiConfig<ThreeDFileUnitDto, ThreeDFileUnitUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/asset/three-d-file-unit',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/asset/three-d-file-unit/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/asset/three-d-file-unit/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/asset/three-d-file-unit/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/asset/three-d-file-unit',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/asset/three-d-file-unit',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/asset/three-d-file-unit/s',
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
    url: '/dcts/asset/three-d-file-unit/s',
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
    url: '/dcts/asset/three-d-file-unit',
    method: 'DELETE',
    data: ids
  })
}
