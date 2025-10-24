import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import {
  AdminResetDctsUserPsdDto,
  DctsUserDto,
  DctsUserRegistDto,
  DctsUserUpdDto
} from "@/type/module/dcts/user/dctsUser.ts";
import { encryptUtils } from "@dcts/common";

export const dctsUserApi: ApiConfig<DctsUserDto, DctsUserUpdDto> = {
  /**
   * 分页查询
   * @param params
   */
  selectList: (params) => request({
    url: '/dcts/user/dcts-user',
    method: 'GET',
    params: params
  }),
  /**
   * 查询所有
   * @param params
   */
  selectAll: (params) => request({
    url: '/dcts/user/dcts-user/all',
    method: 'GET',
    params: params
  }),
  /**
   * 查询单个
   * @param id
   */
  selectById: (id) => request({
    url: `/dcts/user/dcts-user/${id}`,
    method: 'GET'
  }),
  /**
   * 查询多个
   * @param ids
   */
  selectByIds: (ids) => request({
    url: `/dcts/user/dcts-user/ids`,
    method: 'GET',
    params: ids
  }),
  /**
   * 新增
   * @param obj
   */
  insertOne: (obj) => request({
    url: '/dcts/user/dcts-user',
    method: 'POST',
    data: obj
  }),
  /**
   * 修改
   * @param obj
   */
  updateOne: (obj) => request({
    url: '/dcts/user/dcts-user',
    method: 'PUT',
    data: obj
  }),
  /**
   * 新增多个
   * @param objs
   */
  insertMore: (objs) => request({
    url: '/dcts/user/dcts-user/s',
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
    url: '/dcts/user/dcts-user/s',
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
    url: '/dcts/user/dcts-user',
    method: 'DELETE',
    data: ids
  })
}

export function newDctsUser(params: DctsUserRegistDto) {
  return request({
    url: '/dcts/user/dcts-user/admin-new',
    method: 'POST',
    data: {
      ...params,
      password: encryptUtils.aes.encrypt(params.password),
      psdType: 'b'
    }
  })
}

export function resetDctsUserPsd(params: AdminResetDctsUserPsdDto) {
  return request({
    url: '/dcts/user/dcts-user/admin-reset-user-psd',
    method: 'POST',
    data: {
      ...params,
      password: encryptUtils.aes.encrypt(params.password),
      psdType: 'b'
    }
  })
}
