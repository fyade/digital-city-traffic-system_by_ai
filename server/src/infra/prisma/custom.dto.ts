/**
 * @param type 生成的sql类型
 * @param tblName 表名
 * @param clas 类型
 * @param datas 新增或修改的数据
 * @param selfDefineSelKey 自定义查询的as前的字符串
 * @param selfDefineInsUpdKey 自定义新增和修改的数据
 * @param selIds 根据id查询
 * @param delIds 根据id删除
 * @param selParam 查询参数
 * @param pageNum
 * @param pageSize
 * @param orderBy
 */
export class GenSqlDto<T> {
  type: 'selList' | 'selCount' | 'selAll' | 'selById' | 'selByIds' | 'ins' | 'upd' | 'del'
  tblName: string
  clas?: T
  datas?: Partial<T>[]
  selfDefineSelKey?: { [P in keyof T]?: string }
  selfDefineInsUpdKey?: { [P in keyof T]?: (str: string) => string }
  selIds?: (string | number)[]
  delIds?: (string | number)[]
  selParam?: { [P in keyof T]?: T[P] }
  pageNum?: number
  pageSize?: number
  orderBy?: boolean | object
}

export const publicSqlSelectKey = {
  kvs: {
    createRole: ' create_role ',
    updateRole: ' update_role ',
    createBy: ' create_by ',
    updateBy: ' update_by ',
    createTime: ' to_char(create_time, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') ',
    updateTime: ' to_char(update_time, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') ',
    deleted: ' deleted ',
  },
  get toString() {
    return Object.keys(this.kvs)
        .map(key => ` ${this.kvs[key]} as "${key}" `)
        .join(', ')
  }
}
