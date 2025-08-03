import { BaseContextService } from "../module/base-context/base-context.service";
import {
  baseInterfaceColumns,
  baseInterfaceColumns2
} from "../module/module/main/sys-util/code-generation/codeGeneration";
import { baseUtils, objectUtils } from "@dcts/common";
import { final } from "../util/base";
import { GenSqlDto, publicSqlSelectKey } from "./custom.dto";
import { Injectable } from "@nestjs/common";
import { PrismaoService } from "./prismao.service";

@Injectable()
export class CommonPostgresqlPrismaoService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly bcs: BaseContextService,
  ) {
  }

  /**
   * 生成sql
   * @param dto
   * - 查询时：type、tblName必填
   *   - 分页查时：clas、selParam、pageNum、pageSize必填
   *   - 查数量时：selParam必填
   *   - 查所有时：clas、selParam必填
   *   - 查单个/多个时：clas、selIds必填
   * - 新增时：type、tblName、clas、datas必填
   * - 修改时：type、tblName、clas、datas必填
   * - 删除时：type、tblName、delIds必填
   */
  genSql<T>(dto: GenSqlDto<T>) {
    const fieldSelectParam = this.bcs.getFieldSelectParam(dto.tblName);
    const notNullKeys = fieldSelectParam.notNullKeys;
    const numberKeys = fieldSelectParam.numberKeys;
    const completeMatchingKeys = fieldSelectParam.completeMatchingKeys;

    const notInsertKeys = ['createTime', 'updateTime'];
    const notSampleSelParam = {
      createTime: publicSqlSelectKey.kvs.createTime,
      updateTime: publicSqlSelectKey.kvs.updateTime
    }

    const sql_select_keys = !dto.clas ? '' : Object.keys(dto.clas)
        .map(key => {
          const as1 = notSampleSelParam[key] || dto?.selfDefineSelKey?.[key] || baseUtils.toSnakeCase(key)
          return ` ${as1} as "${key}" `
        })
        .join(',');
    let sql = '';
    const sqls: string[] = [];
    // 操作
    if (this._ifSel(dto.type)) {
      sql += ` select `;
      if (dto.type === 'selCount') {
        sql += ` count(*) as "count" `
      } else {
        sql += sql_select_keys;
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
      const defaultSelArg1 = this.prismao.defaultSelArg({ifDeleted: fieldSelectParam.ifDeleted});
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
            sql += ` and ${baseUtils.toSnakeCase(key)} like '%${dto.selParam[key]}%' `
          }
        }
      }
    } else if (this._ifIns(dto.type)) {
      // 插入数据的拼接
      const defaultInsArg1 = this.prismao.defaultInsArg({
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
          keys.push(baseUtils.toSnakeCase(key))
          const _ = dto.selfDefineInsUpdKey[key];
          if (_) {
            values.push(_(data[key]))
          } else {
            values.push(data[key])
          }
        }
        for (const key of Object.keys(defaultInsArg1.data)) {
          if (notInsertKeys.includes(baseUtils.toCamelCase(key))) {
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
                      !numberKeys.includes(baseUtils.toCamelCase(keys[index]))
                      && !Object.keys(dto.selfDefineInsUpdKey).includes(baseUtils.toCamelCase(keys[index]))
                  ) {
                    return `'${val}'`;
                  }
                  return val
                })
                .join(',')
        }) `;
        const s2 = ` ${_sql} RETURNING ${sql_select_keys} `;
        _sqlsOfInsUpd.push(s2)
      }
    } else if (this._ifUpd(dto.type)) {
      // 修改数据的拼接
      const defaultUpdArg1 = this.prismao.defaultUpdArg({
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
        if (notInsertKeys.includes(baseUtils.toCamelCase(key))) {
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
        allVals.push(final.Y)
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
            _allCols.push(baseUtils.toSnakeCase(key))
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
                !numberKeys.includes(baseUtils.toCamelCase(key))
                && !Object.keys(dto.selfDefineInsUpdKey).includes(baseUtils.toCamelCase(key))
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
          const s3 = ` ${_sqls[i]} ${_sql} and id = ${dto.datas[i]['id']} RETURNING ${sql_select_keys} `;
          _sqlsOfInsUpd.push(s3)
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
      param += ` and ${baseUtils.toSnakeCase(key)} like '%${dto[key]}%' `
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
