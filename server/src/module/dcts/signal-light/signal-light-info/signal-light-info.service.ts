import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightInfoDto, SignalLightInfoSelListDto, SignalLightInfoSelAllDto, SignalLightInfoInsOneDto, SignalLightInfoUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";
import { SignalLightGroupChildMappingFacadeService } from "../signal-light-group-child-mapping/signal-light-group-child-mapping.facade.service";

@Injectable()
export class SignalLightInfoService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
      private readonly signalLightGroupChildMappingFacadeService: SignalLightGroupChildMappingFacadeService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_info', {
      notNullKeys: ['name', 'location', 'description'],
    });
  }

  async selSignalLightInfo(dto: SignalLightInfoSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'selList',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'selCount',
      tblName: 'signal_light_info',
      selParam: dto,
    });
    const total = await this.pgsqlPrismao.$queryRawUnsafe<CountSqlReturnDto>(sqls2[0]);
    const pageVo = new PageVo<SignalLightInfoDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllSignalLightInfo(dto: SignalLightInfoSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'selAll',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesSignalLightInfo(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'selByIds',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneSignalLightInfo(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'selById',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightInfo(dto: SignalLightInfoInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'ins',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      datas: [dto],
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdValue: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightInfos(dtos: SignalLightInfoInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'ins',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      datas: dtos,
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdValue: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updSignalLightInfo(dto: SignalLightInfoUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'upd',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      datas: [dto],
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdValue: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updSignalLightInfos(dtos: SignalLightInfoUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'upd',
      tblName: 'signal_light_info',
      clas: new SignalLightInfoDto(),
      datas: dtos,
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdValue: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const re = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightInfoDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delSignalLightInfo(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'del',
      tblName: 'signal_light_info',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }

  async delSignalLightInfoV2(ids: number[]): Promise<R> {
    // 删除子信号灯
    const sqls = this.cPgsqlPrismao.genSql<SignalLightInfoDto>({
      type: 'del',
      tblName: 'signal_light_info',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    // 删除信号灯组-子信号灯对应关联
    await this.signalLightGroupChildMappingFacadeService.delByChildIds(ids);
    return R.ok(true);
  }
}
