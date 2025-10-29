import { Injectable } from '@nestjs/common';
import { PageDto } from '../../common/dto/PageDto';
import { PageVo } from '../../common/vo/PageVo';
import { deepClone } from '../../util/ObjectUtils';
import { PrismaParam, PrismaParamAll, SelectParamObj } from './dto';
import { PrismaoService } from "./prismao.service";
import { AuthService } from '../auth/auth.service';
import { BaseContextService } from '../base-context/base-context.service';
import { WinstonService } from "../winston/winston.service";
import { baseUtils, objectUtils } from "@dcts/common";

enum RowPermissionEnum {
  all = 'all',
  self = 'self',
}

class RowPermissionRet {
  types: RowPermissionEnum[];
  ids: (string | number)[];

  constructor() {
    this.types = [];
    this.ids = [];
  }
}

type _BaseClass = { id: string | number };

@Injectable()
export class PrismaService {
  constructor(
      protected readonly prismao: PrismaoService,
      protected readonly authService: AuthService,
      protected readonly bcs: BaseContextService,
      protected readonly winston: WinstonService,
  ) {
  }

  // /**
  //  * 数据表行级别权限控制
  //  * @param model
  //  * @param arg
  //  * @private
  //  */
  // private async tableRowPermission<T>({
  //                                       model,
  //                                       arg,
  //                                     }: {
  //                                       model: string,
  //                                       arg: PrismaParam
  //                                     },
  // ): Promise<RowPermissionRet> {
  //   const rowPermissionRet = new RowPermissionRet();
  //   const userData = this.bcs.getUserData();
  //   const permissionData = await this.mysqlPrismao.sys_menu.findFirst({
  //     where: {
  //       perms: userData.perms,
  //       type: 'mb',
  //       ...this.defaultSelArg().where,
  //     },
  //   });
  //   if (!permissionData) {
  //     this.winston.error(`不存在的权限：${userData.perms}`);
  //     throw new UnknownException(userData.reqId);
  //   }
  //   const ifTopAdmin = userData.topAdmin;
  //   if (ifTopAdmin) {
  //     rowPermissionRet.types.push(RowPermissionEnum.all);
  //   }
  //   // 用户的角色/部门
  //   const {allRoleIds, allDeptIds} = await this.authService.rolesAndDeptsOfUser(userData.userId, userData.loginRole);
  //   const trpsRole = await this.mysqlPrismao.sys_table_row_permission.findMany({
  //     where: {
  //       action_type: UTDPTypeEnum.T_ROLE,
  //       action_id: {
  //         in: allRoleIds.map(_ => `${_}`),
  //       },
  //       permission_id: permissionData.id,
  //       ...this.defaultSelArg().where,
  //     },
  //   });
  //   const trpsDept = await this.mysqlPrismao.sys_table_row_permission.findMany({
  //     where: {
  //       action_type: UTDPTypeEnum.T_DEPT,
  //       action_id: {
  //         in: allDeptIds.map(_ => `${_}`),
  //       },
  //       permission_id: permissionData.id,
  //       ...this.defaultSelArg().where,
  //     },
  //   });
  //   const trps = [...trpsRole, ...trpsDept];
  //   if (trps.length === 0) {
  //     rowPermissionRet.types.push(RowPermissionEnum.all);
  //   }
  //   const dataTypes = trps.map(item => item.data_type);
  //   if (dataTypes.includes('ALL')) {
  //     rowPermissionRet.types.push(RowPermissionEnum.all);
  //   }
  //   if (dataTypes.includes('SELF_DEPT')) {
  //   }
  //   if (dataTypes.includes('DEPT_ONE_SON')) {
  //   }
  //   if (dataTypes.includes('DEPT_ALL_SON')) {
  //   }
  //   if (dataTypes.includes('SELF_ROLE')) {
  //   }
  //   if (dataTypes.includes('SELF')) {
  //     rowPermissionRet.types.push(RowPermissionEnum.self);
  //   }
  //   return rowPermissionRet;
  // }

  protected getModel(model: string): any {
    return null;
  }

  private genSelParams<T>({
                                        data,
                                        orderBy,
                                        range = {},
                                        selKeys = [],
                                        notNullKeys = [],
                                        numberKeys = [],
                                        completeMatchingKeys = [],
                                        ifDeleted = true,
                                      }: {
                                        data?: {[P in keyof T]?: T[P] | string | Partial<SelectParamObj>},
                                        orderBy?: boolean | object,
                                        range?: object,
                                        selKeys?: string[],
                                        notNullKeys?: string[],
                                        numberKeys?: string[],
                                        completeMatchingKeys?: string[],
                                        ifDeleted?: boolean,
                                      } = {},
  ) {
    const data_ = baseUtils.objToSnakeCase(data as object);
    const publicData = this.prismao.defaultSelArg({selKeys, ifDeleted}).where;
    const ret = {
      AND: [
        ...Object.keys(publicData).reduce((obj, item) => [
          ...obj,
          {
            [item]: publicData[item],
          },
        ], []),
        ...Object.keys(data_).reduce((obj, item) => {
          let datum: any = '';
          try {
            datum = JSON.parse(data_[item]);
            if (typeof datum === 'number') {
              datum = data_[item];
            }
          } catch (e) {
            datum = data_[item];
          }
          // 开始拼接查询条件
          const obj2 = {
            OR: [],
          };
          // 如果这个字段接收到的是对象类型
          if (baseUtils.typeOf(datum) === 'object') {
            const items = {[item]: {}};
            const datum_ = new SelectParamObj(datum as unknown as SelectParamObj);
            for (const itm of Object.keys(datum_)) {
              // 如果指定为数值类型
              if (datum_[itm].type === 'number') {
                switch (baseUtils.typeOf(datum_[itm].value)) {
                  case 'array':
                    items[item][itm] = datum_[itm].value.map(n => Number(n));
                    break;
                    // case 'object':
                    //   items[item][itm] = Object.keys(datum_[itm].value)
                    //     .reduce((obj, key) => ({ ...obj, [key]: Number(datum_[itm].value[key]) }), {});
                    //   break;
                  case 'string':
                    items[item][itm] = Number(datum_[itm].value);
                    break;
                  default:
                    items[item][itm] = datum_[itm].value;
                    break;
                }
              }
              // 如果指定为日期类型
              if (datum_[itm].type === 'date') {
                switch (baseUtils.typeOf(datum_[itm].value)) {
                  case 'array':
                    items[item][itm] = datum_[itm].value.map((n) => new Date(n));
                    break;
                    // case 'object':
                    //   items[item][itm] = Object.keys(datum_[itm].value)
                    //     .reduce((obj, key) => ({ ...obj, [key]: Number(datum_[itm].value[key]) }), {});
                    //   break;
                  case 'string':
                    items[item][itm] = new Date(datum_[itm].value);
                    break;
                  default:
                    items[item][itm] = datum_[itm].value;
                    break;
                }
              }
              // 未指定类型，原样返回
              else {
                items[item][itm] = datum_[itm].value;
              }
              if (itm === 'between') {
                delete items[item][itm];
                const valid0 = objectUtils.ifValid(datum_[itm].value[0]);
                if (valid0) {
                  items[item]['gte'] = datum_[itm].value[0];
                }
                const valid1 = objectUtils.ifValid(datum_[itm].value[1]);
                if (valid1) {
                  items[item]['lte'] = datum_[itm].value[1];
                }
                if (!valid0 && !valid1) {
                  delete items[item];
                }
              }
            }
            if (Object.keys(items).length > 0) {
              obj2.OR.push(items);
            }
          } else {
            if (objectUtils.ifValid(datum)) {
              // 数字
              if (baseUtils.toSnakeCases(numberKeys).includes(item)) {
                obj2.OR.push({[item]: Number(datum)});
              }
              // 字符串完整匹配
              else if (baseUtils.toSnakeCases(completeMatchingKeys).includes(item) && !!datum) {
                obj2.OR.push({[item]: `${datum}`});
              }
              // 字符串模糊匹配
              else {
                obj2.OR.push({[item]: {contains: `${datum}`}});
              }
            }
            // 可以为空
            if (!baseUtils.toSnakeCases(notNullKeys).includes(item)) {
              obj2.OR.push({[item]: null});
            }
          }
          if (obj2.OR.length > 0) {
            return [...obj, obj2];
          } else {
            return [...obj];
          }
        }, []),
        ...Object.keys(range).map(item => {
          const retObj = {
            [baseUtils.toSnakeCase(item)]: {
              gte: range[item].gte,
              lte: range[item].lte,
            },
          };
          const gteNotValid = objectUtils.ifNotValid(range[item].gte);
          if (gteNotValid) {
            delete retObj[baseUtils.toSnakeCase(item)].gte
          }
          const lteNotValid = objectUtils.ifNotValid(range[item].lte);
          if (lteNotValid) {
            delete retObj[baseUtils.toSnakeCase(item)].lte
          }
          if (gteNotValid && lteNotValid) {
            return null;
          }
          return retObj
        }).filter(item => item),
      ],
    };
    return ret;
  }

  public genSelParamSql<T>(
      param1: {
        tblName?: string,
        type?: 'selList' | 'selCount' | 'selAll',
        clas?: T
        selfDefineSelKey?: { [P in keyof T]?: string }
        orderBy?: boolean | object,
        pageNum?: number
        pageSize?: number
      },
      ...params: Parameters<typeof this.genSelParams<T>>
  ) {
    let sql = ''
    const arg: Partial<PrismaParam> = {
      where: this.genSelParams<T>(...params)
    }
    if (param1.type === 'selList' || param1.type === 'selAll') {
      const publicData = this.prismao.defaultSelArg({
        model: param1.tblName,
        selKeys: params[0].selKeys,
        ifDeleted: params[0].ifDeleted,
      });
      if (publicData.select) {
        arg['select'] = publicData.select
      }
      this.__(arg, param1.orderBy)
    }
    if (param1.type === 'selList') {
      const skipAndTakeFromPNS = this._(param1.pageNum, param1.pageSize);
      arg['skip'] = skipAndTakeFromPNS.skip
      arg['take'] = skipAndTakeFromPNS.take
    }
    sql += ` select `
    if (param1.type === 'selList' || param1.type === 'selAll') {
      sql += Object.keys(param1.clas)
          .map(key => ` ${baseUtils.toSnakeCase(key)} as ${key} `)
          .join(', ')
    } else if (param1.type === 'selCount') {
      sql += ` count(*) as "count" `
    }
    sql += ` from ${param1.tblName} `
    sql += ` where 1=1 `
    sql += arg.where.AND
        .map(obj => {
          if (obj.OR) {
            let ret = ' ('
            if (typeof obj.OR !== 'string' && typeof obj.OR !== 'number') {
              ret += obj.OR
                  .map(o => {
                    const key = Object.keys(o)[0];
                    const value = Object.values(o)[0];
                    if (typeof value === 'string') {
                      return ` ${key} = '${value}' `
                    }
                    if (typeof value === 'number') {
                      return ` ${key} = ${value} `
                    }
                    const key2 = Object.keys(value)[0];
                    const value2 = Object.values(value)[0];
                    if (key2 === 'contains') {
                      return ` ${key} like '%${value2}%' `
                    }
                    if (key2 === 'in') {
                      const val = value2.map(_ => typeof _ === 'number' ? _ : `'${_}'`).join(', ');
                      return ` ${key} in (${val}) `
                    }
                    if (key2 === 'gte' || key2 === 'lte') {
                      const b = typeof value['gte'] === 'number';
                      if (b) {
                        return ` ${key} between ${value['gte']} and ${value['lte']} `
                      } else {
                        return ` ${key} between '${value['gte']}' and '${value['lte']}' `
                      }
                    }
                  })
                  .join(' or ')
            }
            ret += ') '
            return ret
          } else {
            const b1 = typeof Object.values(obj)[0] === 'number';
            if (b1) {
              return ` ( ${Object.keys(obj)[0]} = ${Object.values(obj)[0]} ) `
            } else {
              return ` ( ${Object.keys(obj)[0]} = '${Object.values(obj)[0]}' ) `
            }
          }
        })
        .map(_ => ` and ${_} `)
        .join('')
    if (param1.type === 'selList' || param1.type === 'selAll') {
      if (typeof param1.orderBy === 'boolean' && param1.orderBy) {
        sql += ' order by order_num asc, create_time desc '
      } else if (param1.orderBy) {
        sql += ' order by '
        sql += Object.keys(param1.orderBy)
            .map((_, index) => ` ${baseUtils.toSnakeCase(Object.keys(param1.orderBy)[index])} ${Object.values(param1.orderBy)[index]} `)
            .map(_ => `${_}, `)
            .join('')
        sql += ' create_time desc '
      } else {
        sql += ' order by create_time desc '
      }
    }
    if (param1.type === 'selList') {
      sql += ` limit ${param1.pageSize} offset ${(param1.pageNum - 1) * param1.pageSize} `;
    }
    return sql
  }

  /**
   * 分页查询
   * @param model
   * @param data
   * @param orderBy
   * @param range
   * @param selKeys
   */
  public async findPage<T>(model: string, {
                                                data,
                                                orderBy,
                                                range = {},
                                                selKeys = [],
                                              }: {
                                                data?: {[P in keyof T]?: T[P] | string | Partial<SelectParamObj>} & PageDto,
                                                orderBy?: boolean | object,
                                                range?: object,
                                                selKeys?: string[],
                                              } = {},
  ): Promise<PageVo<T>> {
    const pageNum = Number(data.pageNum);
    const pageSize = Number(data.pageSize);
    const data2 = deepClone(data);
    delete data2.pageNum;
    delete data2.pageSize;
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.prismao.defaultSelArg({
      model,
      selKeys,
      ifDeleted: fieldSelectParam.ifDeleted,
    });
    const skipAndTakeFromPNS = this._(pageNum, pageSize);
    const arg: PrismaParam = {
      where: this.genSelParams<T>({
        data: data2,
        orderBy,
        range,
        selKeys,
        notNullKeys: fieldSelectParam.notNullKeys,
        numberKeys: fieldSelectParam.numberKeys,
        completeMatchingKeys: fieldSelectParam.completeMatchingKeys,
        ifDeleted: fieldSelectParam.ifDeleted,
      }),
      ...(publicData.select ? {select: publicData.select} : {}),
      skip: skipAndTakeFromPNS.skip,
      take: skipAndTakeFromPNS.take,
    };
    this.__(arg, orderBy)
    const model1 = this.getModel(model);
    const list = await model1.findMany(arg);
    const list1 = list.map((item: object) => baseUtils.objToCamelCase(item));
    const arg2 = {
      where: arg.where,
    };
    const count = await model1.count(arg2);
    return new Promise((resolve) => {
      resolve({
        pageNum,
        pageSize,
        list: list1,
        total: count,
        ifFirst: pageNum === 1,
        ifLast: Math.ceil(count / pageSize) === pageNum,
      });
    });
  }

  /**
   * 查询所有
   * @param model
   * @param data
   * @param orderBy
   * @param range
   * @param selKeys
   */
  public async findAll<T>(model: string, {
                                        data,
                                        orderBy,
                                        range = {},
                                        selKeys = [],
                                      }: {
                                        data?: {[P in keyof T]?: T[P] | string | Partial<SelectParamObj>},
                                        orderBy?: boolean | object,
                                        range?: object,
                                        selKeys?: string[],
                                      } = {},
  ): Promise<T[]> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.prismao.defaultSelArg({
      model,
      selKeys,
      ifDeleted: fieldSelectParam.ifDeleted,
    });
    const arg: PrismaParamAll = {
      where: this.genSelParams<T>({
        data,
        orderBy,
        range,
        selKeys,
        notNullKeys: fieldSelectParam.notNullKeys,
        numberKeys: fieldSelectParam.numberKeys,
        completeMatchingKeys: fieldSelectParam.completeMatchingKeys,
        ifDeleted: fieldSelectParam.ifDeleted,
      }),
      ...(publicData.select ? {select: publicData.select} : {}),
    };
    this.__(arg, orderBy)
    const res2 = await this.getModel(model).findMany(arg);
    const res3 = res2.map((item: object) => baseUtils.objToCamelCase(item));
    return new Promise(resolve => resolve(res3));
  }

  /**
   * 查询首个
   * @param model
   * @param args
   * @param selKeys
   */
  public async findFirst<T>(model: string, args?: Partial<T> & Partial<_BaseClass>, {
                                       selKeys = [],
                                     }: {
                                       selKeys?: string[],
                                     } = {},
  ): Promise<T> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.prismao.defaultSelArg({
      model,
      selKeys,
      ifDeleted: fieldSelectParam.ifDeleted,
    });
    const arg = {
      where: {
        ...publicData.where,
        ...(baseUtils.objToSnakeCase(args) || {}),
      },
      ...(publicData.select ? {select: publicData.select} : {}),
    };
    const first = await this.getModel(model).findFirst(arg);
    const objToCamelCase1 = baseUtils.objToCamelCase<T>(first);
    return new Promise(resolve => resolve(objToCamelCase1));
  }

  /**
   * 查询单个
   * @param model
   * @param id
   * @param selKeys
   */
  public async findById<T>(model: string, id: string | number, {
                             selKeys = [],
                           }: {
                             selKeys?: string[],
                           } = {},
  ): Promise<T> {
    return this.findFirst<T>(model, {id: id} as Partial<T> & Partial<_BaseClass>, {selKeys});
  }

  /**
   * 查询多个（根据id）
   * @param model
   * @param ids
   * @param selKeys
   */
  public async findByIds<T>(model: string, ids: string[] | number[], {
                              selKeys = [],
                            }: {
                              selKeys?: string[],
                            } = {},
  ): Promise<T[]> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.prismao.defaultSelArg({
      model,
      selKeys,
      ifDeleted: fieldSelectParam.ifDeleted,
    });
    const arg = {
      where: {
        ...publicData.where,
        id: {
          in: ids,
        },
      },
      ...(publicData.select ? {select: publicData.select} : {}),
    };
    const list = await this.getModel(model).findMany(arg);
    const list2 = ids.map((id) => baseUtils.objToCamelCase<T>(list.find(item => item.id === id)));
    return new Promise(resolve => resolve(list2));
  }

  /**
   * 数量
   * @param model
   * @param data
   * @param range
   */
  public async count<T>(model: string, {
                                      data,
                                      range = {},
                                    }: {
                                      data?: Partial<T>,
                                      range?: object,
                                    } = {},
  ): Promise<number> {
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const arg: PrismaParamAll = {
      where: this.genSelParams<T>({
        data,
        range,
        notNullKeys: fieldSelectParam.notNullKeys,
        numberKeys: fieldSelectParam.numberKeys,
        completeMatchingKeys: fieldSelectParam.completeMatchingKeys,
        ifDeleted: fieldSelectParam.ifDeleted,
      }),
    };
    const count = await this.getModel(model).count(arg);
    return new Promise(resolve => resolve(count));
  }

  /**
   * 新增
   * @param model
   * @param data
   * @param ifCustomizeId
   */
  public async create<T>(model: string, data: Partial<T> & Partial<_BaseClass>, {
                           ifCustomizeId = false,
                         }: {
                           ifCustomizeId?: boolean,
                         } = {},
  ): Promise<T> {
    const data2 = deepClone(data);
    if (!ifCustomizeId) {
      delete data2.id;
    }
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.prismao.defaultInsArg({
      ifCreateRole: fieldSelectParam.ifCreateRole,
      ifUpdateRole: fieldSelectParam.ifUpdateRole,
      ifCreateBy: fieldSelectParam.ifCreateBy,
      ifUpdateBy: fieldSelectParam.ifUpdateBy,
      ifCreateTime: fieldSelectParam.ifCreateTime,
      ifUpdateTime: fieldSelectParam.ifUpdateTime,
      ifDeleted: fieldSelectParam.ifDeleted,
    }).data;
    const arg = {
      data: {
        ...(baseUtils.objToSnakeCase(data2) || {}),
        ...publicData,
      },
    };
    const retData = await this.getModel(model).create(arg);
    return new Promise(resolve => resolve(baseUtils.objToCamelCase(retData)));
  }

  /**
   * 批量新增
   * @param model
   * @param data
   * @param ifCustomizeId
   */
  public async createMany<T>(model: string, data: Partial<T>[], {
                               ifCustomizeId = false,
                             }: {
                               ifCustomizeId?: boolean,
                             } = {},
  ): Promise<T[]> {
    const retArr: T[] = [];
    for (let i = 0; i < data.length; i++) {
      const ret = await this.create<T>(model, data[i], {
        ifCustomizeId,
      });
      retArr.push(ret);
    }
    return new Promise(resolve => resolve(retArr));
  }

  /**
   * 修改
   * @param model
   * @param data
   */
  public async updateById<T>(model: string, data: Partial<T> & Partial<_BaseClass>): Promise<T> {
    const id = data.id;
    const data2 = deepClone(data);
    delete data2.id;
    const fieldSelectParam = this.bcs.getFieldSelectParam(model);
    const publicData = this.prismao.defaultUpdArg({
      ifUpdateRole: fieldSelectParam.ifUpdateRole,
      ifUpdateBy: fieldSelectParam.ifUpdateBy,
      ifUpdateTime: fieldSelectParam.ifUpdateTime,
      ifDeleted: fieldSelectParam.ifDeleted,
    });
    const arg = {
      where: {
        ...publicData.where,
        id: id,
      },
      data: {
        ...baseUtils.objToSnakeCase(data2),
        ...publicData.data,
      },
    };
    const retData = await this.getModel(model).update(arg);
    return new Promise(resolve => resolve(baseUtils.objToCamelCase(retData)));
  }

  /**
   * 批量修改
   * @param model
   * @param data
   */
  public async updateMany<T>(model: string, data: Partial<T>[]): Promise<T[]> {
    const retArr: T[] = [];
    for (let i = 0; i < data.length; i++) {
      const ret = await this.updateById<T>(model, data[i]);
      retArr.push(ret);
    }
    return new Promise(resolve => resolve(retArr));
  }

  /**
   * 批量删除
   * @param model
   * @param ids
   */
  public async deleteById<T>(model: string, ids: string[] | number[]): Promise<boolean> {
    const publicData = this.prismao.defaultDelArg();
    const arg = {
      where: {
        ...publicData.where,
        id: {
          in: ids,
        },
      },
      data: {
        ...publicData.data,
      },
    };
    await this.getModel(model).updateMany(arg);
    return new Promise(resolve => resolve(true));
  }

  /**
   * 条件删除
   * @param model
   * @param key
   * @param values
   */
  public async delete<T>(model: string, key: string, values: string[] | number[]): Promise<boolean> {
    const publicData = this.prismao.defaultDelArg();
    const arg = {
      where: {
        ...publicData.where,
        [key]: {
          in: values,
        },
      },
      data: {
        ...publicData.data,
      },
    };
    await this.getModel(model).updateMany(arg);
    return new Promise(resolve => resolve(true));
  }

  private _(pageNum: number, pageSize: number) {
    return {
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    };
  }

  private __(arg: object, orderBy?: boolean | object) {
    if (typeof orderBy === 'boolean' && orderBy) {
      arg['orderBy'] = [
        {
          order_num: 'asc',
        },
        {
          create_time: 'desc',
        }
      ];
    } else if (orderBy) {
      arg['orderBy'] = [
        ...Object.keys(orderBy).map((_, index) => {
          return {
            [baseUtils.toSnakeCase(Object.keys(orderBy)[index])]: Object.values(orderBy)[index],
          }
        }),
        {
          create_time: 'desc',
        }
      ];
    } else {
      arg['orderBy'] = {
        create_time: 'desc',
      };
    }
  }
}
