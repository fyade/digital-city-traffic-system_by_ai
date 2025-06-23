import { BaseContextService } from "../module/base-context/base-context.service";
import {
  baseInterfaceColumns,
  baseInterfaceColumns2
} from "../module/module/main/sys-util/code-generation/codeGeneration";
import { baseUtils, objectUtils } from "@dcts/common";
import { base } from "../util/base";
import { GenSqlDto } from "./custom.dto";
import { toCamelCase, toSnakeCase } from "@dcts/common/dist/util/base-utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CommonPostgresqlPrismaoService {
  constructor(
      private readonly bcs: BaseContextService,
  ) {
  }

  protected getUserId() {
    return this.bcs.getUserData().userId || '???';
  }

  protected getLoginRole() {
    return this.bcs.getUserData().loginRole || '???';
  }

  defaultSelArg = ({
                     selKeys = [],
                     ifDeleted = true,
                     ifUseSelfData = false,
                   }: {
                     selKeys?: string[],
                     ifDeleted?: boolean,
                     ifUseSelfData?: boolean,
                   } = {},
  ) => {
    const retObj = {
      ...(selKeys.length > 0 ? {
        select: [...selKeys, ...baseInterfaceColumns2].reduce((o, a) => ({
          ...o,
          [baseUtils.toSnakeCase(a)]: true,
        }), {}),
      } : {}),
      where: {},
    };
    if (ifUseSelfData) {
      retObj.where['create_role'] = this.getLoginRole();
      retObj.where['create_by'] = this.getUserId();
    }
    if (ifDeleted) retObj.where['deleted'] = base.N;
    return retObj;
  };
  defaultInsArg = ({
                     ifCreateRole = true,
                     ifUpdateRole = true,
                     ifCreateBy = true,
                     ifUpdateBy = true,
                     ifCreateTime = true,
                     ifUpdateTime = true,
                     ifDeleted = true,
                   }: {
                     ifCreateRole?: boolean,
                     ifUpdateRole?: boolean,
                     ifCreateBy?: boolean,
                     ifUpdateBy?: boolean,
                     ifCreateTime?: boolean,
                     ifUpdateTime?: boolean,
                     ifDeleted?: boolean,
                   } = {},
  ) => {
    const userid = this.getUserId();
    const time1 = new Date();
    const retObj = {
      data: {
        create_role: this.getLoginRole(),
        update_role: this.getLoginRole(),
        create_by: userid,
        update_by: userid,
        create_time: time1,
        update_time: time1,
        deleted: base.N,
      },
    };
    if (!ifCreateRole) delete retObj.data.create_role;
    if (!ifUpdateRole) delete retObj.data.update_role;
    if (!ifCreateBy) delete retObj.data.create_by;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifCreateTime) delete retObj.data.create_time;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.data.deleted;
    return retObj;
  };
  defaultUpdArg = ({
                     ifUpdateRole = true,
                     ifUpdateBy = true,
                     ifUpdateTime = true,
                     ifDeleted = true,
                     ifUseSelfData = false,
                   }: {
                     ifUpdateRole?: boolean,
                     ifUpdateBy?: boolean,
                     ifUpdateTime?: boolean,
                     ifDeleted?: boolean,
                     ifUseSelfData?: boolean,
                   } = {},
  ) => {
    const retObj = {
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: base.N,
      },
      data: {
        update_role: this.getLoginRole(),
        update_by: this.getUserId(),
        update_time: new Date(),
      },
    };
    if (!ifUpdateRole) delete retObj.data.update_role;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.where.deleted;
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };
  defaultDelArg = ({
                     ifUseSelfData = false,
                   }: {
                     ifUseSelfData?: boolean
                   } = {},
  ) => {
    const retObj = {
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: base.N,
      },
      data: {
        update_role: this.getLoginRole(),
        update_by: this.getUserId(),
        update_time: new Date(),
        deleted: base.Y,
      },
    };
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };

  /**
   * 生成sql
   * @param dto
   * - 查询时：type、tblName必填
   *   - 分页查时：clas、selParam、pageNum、pageSize必填
   *   - 查数量时：selParam必填
   *   - 查所有时：clas、selParam必填
   *   - 查单个/多个时：clas、selIds必填
   * - 新增时：type、tblName、datas必填
   * - 修改时：type、tblName、datas必填
   * - 删除时：type、tblName、delIds必填
   */
  genSql<T>(dto: GenSqlDto<T>) {
    const fieldSelectParam = this.bcs.getFieldSelectParam(dto.tblName);
    const notNullKeys = fieldSelectParam.notNullKeys;
    const numberKeys = fieldSelectParam.numberKeys;
    const completeMatchingKeys = fieldSelectParam.completeMatchingKeys;

    const notInsertKeys = ['createTime', 'updateTime'];

    let sql = '';
    const sqls: string[] = [];
    // 操作
    if (this._ifSel(dto.type)) {
      sql += ` select `;
      if (dto.type === 'selCount') {
        sql += ` count(*) as count `
      } else {
        sql += Object.keys(dto.clas)
            .map(key => {
              const as1 = dto.selfDefineSelKey[key] || toSnakeCase(key)
              return ` ${as1} as "${key}" `
            })
            .join(',');
      }
    } else if (this._ifIns(dto.type)) {
      sql += ' insert ';
    } else if (this._ifUpd(dto.type)) {
      sql += ` update `;
    }

    // 表名
    if (this._ifSel(dto.type)) {
      sql += ` from ${dto.tblName} `;
    } else if (this._ifIns(dto.type)) {
      sql += ` into ${dto.tblName} `;
    } else if (this._ifUpd(dto.type)) {
      sql += ` ${dto.tblName} `;
    }

    const _sqlsOfInsUpd: string[] = [];
    if (this._ifSel(dto.type)) {
      // 查询条件
      const defaultSelArg1 = this.defaultSelArg({ifDeleted: fieldSelectParam.ifDeleted});
      sql += ` where `
      for (const key of Object.keys(defaultSelArg1.where)) {
        sql += ` ${key} = '${defaultSelArg1.where[key]}' `
      }
      if (dto.type === 'selById') {
        sql += ` and id = ${dto.selIds[0]} `
      } else if (dto.type === 'selByIds') {
        sql += ` and id in (${dto.selIds.join(',')}) `
      } else {
        for (const key of Object.keys(dto.selParam)) {
          if (dto.selParam[key]) {
            sql += ` and ${toSnakeCase(key)} like '%${dto.selParam[key]}%' `
          }
        }
      }
    } else if (this._ifIns(dto.type)) {
      // 插入数据的拼接
      const defaultInsArg1 = this.defaultInsArg({
        ifCreateRole: fieldSelectParam.ifCreateRole,
        ifUpdateRole: fieldSelectParam.ifUpdateRole,
        ifCreateBy: fieldSelectParam.ifCreateBy,
        ifUpdateBy: fieldSelectParam.ifUpdateBy,
        ifCreateTime: fieldSelectParam.ifCreateTime,
        ifUpdateTime: fieldSelectParam.ifUpdateTime,
        ifDeleted: fieldSelectParam.ifDeleted,
      });
      for (const data of dto.datas) {
        for (const col of baseInterfaceColumns2) {
          delete data[col];
        }
        const keys: string[] = []
        const values: (string | number)[] = []
        for (const key of Object.keys(data)) {
          keys.push(toSnakeCase(key))
          const _ = dto.selfDefineInsUpdKey[key];
          if (_) {
            values.push(_(data[key]))
          } else {
            values.push(data[key])
          }
        }
        for (const key of Object.keys(defaultInsArg1.data)) {
          if (notInsertKeys.includes(toCamelCase(key))) {
            continue
          }
          keys.push(key)
          values.push(defaultInsArg1.data[key])
        }
        let _sql = ''
        _sql += ` (${keys.join(',')}) `;
        _sql += ` values `;
        _sql += ` (${
            values
                .map((val, index) => {
                  if (
                      !numberKeys.includes(toCamelCase(keys[index]))
                      && !Object.keys(dto.selfDefineInsUpdKey).includes(toCamelCase(keys[index]))
                  ) {
                    return `'${val}'`;
                  }
                  return val
                })
                .join(',')
        }) `;
        _sqlsOfInsUpd.push(_sql)
      }
    } else if (this._ifUpd(dto.type)) {
      // 修改数据的拼接
      const defaultUpdArg1 = this.defaultUpdArg({
        ifUpdateRole: fieldSelectParam.ifUpdateRole,
        ifUpdateBy: fieldSelectParam.ifUpdateBy,
        ifUpdateTime: fieldSelectParam.ifUpdateTime,
        ifDeleted: fieldSelectParam.ifDeleted,
      });
      let _sql = '';
      // 公共的修改字段
      const allCols: string[] = [];
      const allVals: (string | number)[] = [];
      for (const key of Object.keys(defaultUpdArg1.data)) {
        if (notInsertKeys.includes(toCamelCase(key))) {
          continue
        }
        allCols.push(key)
        allVals.push(defaultUpdArg1.data[key])
      }

      const _sqls: string[] = []
      // 拼接 set
      if (dto.type === 'del') {
        // 如果是删除，只需要修改逻辑删除字段
        allCols.push('deleted')
        allVals.push(base.Y)
        _sql += ' set '
        _sql += ' update_time = CURRENT_TIMESTAMP '
        for (let i = 0; i < allCols.length; i++) {
          _sql += `,${allCols[i]} = '${allVals[i]}' `
        }
      } else {
        // 不是删除，则需要修改所传入的所有字段
        for (const data of dto.datas) {
          // 每条数据单独的修改字段
          const _allCols = [...allCols]
          const _allVals = [...allVals]
          for (const col of baseInterfaceColumns) {
            delete data[col];
          }
          for (const key of Object.keys(data)) {
            if (key === 'id') {
              continue
            }
            _allCols.push(toSnakeCase(key))
            const _ = dto.selfDefineInsUpdKey[key]
            if (_) {
              _allVals.push(_(data[key]))
            } else {
              _allVals.push(data[key])
            }
          }
          let s = ''
          s += ' set '
          s += ' update_time = CURRENT_TIMESTAMP '
          for (let index = 0; index < _allCols.length; index++) {
            const key = _allCols[index]
            let val = _allVals[index]
            if (
                !numberKeys.includes(toCamelCase(key))
                && !Object.keys(dto.selfDefineInsUpdKey).includes(toCamelCase(key))
            ) {
              val = `'${val}'`
            }
            const s1 = ` ,${key} = ${val} `;
            s += s1
          }
          _sqls.push(s)
        }
      }

      // 拼接 where
      _sql += ' where 1=1 '
      for (const key of Object.keys(defaultUpdArg1.where)) {
        _sql += ` and ${key} = '${defaultUpdArg1.where[key]}' `
      }

      if (dto.type === 'del') {
        // 如果是删除，只需要传入id数组
        _sql += ` and id in (${dto.delIds.join(',')}) `
        _sqlsOfInsUpd.push(_sql)
      } else {
        // 不是删除，就传入当前数据的id
        for (let i = 0; i < dto.datas.length; i++) {
          _sqlsOfInsUpd.push(` ${_sqls[i]} ${_sql} and id = ${dto.datas[i]['id']} `)
        }
      }
    }

    // 分页
    if (dto.type === 'selList') {
      sql += ` limit ${dto.pageSize} offset ${(dto.pageNum - 1) * dto.pageSize} `;
    }

    // 返回
    if (this._ifIns(dto.type)) {
      for (const string of _sqlsOfInsUpd) {
        sqls.push(`${sql} ${string} ;`)
      }
    } else if (this._ifUpd(dto.type)) {
      for (const string of _sqlsOfInsUpd) {
        sqls.push(`${sql} ${string} ;`)
      }
    } else if (this._ifSel(dto.type)) {
      sql += ';';
      sqls.push(sql);
    }
    return sqls
        .map(sql => sql
            .trim()
            .replace(/ +/g, ' ')
            .replace(/ ,/g, ',')
            .replace(/ ;/g, ';')
        );
  }

  /**
   * 生成查询参数sql
   * @param dto
   */
  genSelParam(dto: object) {
    let param = '';
    for (const key of Object.keys(dto)) {
      const ifUndefined = objectUtils.ifUndefined(dto[key]);
      if (ifUndefined) {
        continue;
      }
      param += ` and ${toSnakeCase(key)} like '%${dto[key]}%' `
    }
    return param;
  }

  private _ifSel(type: GenSqlDto<any>['type']) {
    return type === 'selList' || type === 'selCount' || type === 'selAll' || type === 'selById' || type === 'selByIds'
  }

  private _ifIns(type: GenSqlDto<any>['type']) {
    return type === 'ins'
  }

  private _ifUpd(type: GenSqlDto<any>['type']) {
    return type === 'upd' || type === 'del'
  }
}
