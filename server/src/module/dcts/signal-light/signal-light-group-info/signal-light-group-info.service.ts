import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightGroupInfoDto, SignalLightGroupInfoSelListDto, SignalLightGroupInfoSelAllDto, SignalLightGroupInfoInsOneDto, SignalLightGroupInfoUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";
import { SignalLightGroupChildMappingFacadeService } from "../signal-light-group-child-mapping/signal-light-group-child-mapping.facade.service";
import { SignalLightInfoFacadeService } from "../signal-light-info/signal-light-info.facade.service";

@Injectable()
export class SignalLightGroupInfoService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
      private readonly signalLightGroupChildMappingFacadeService: SignalLightGroupChildMappingFacadeService,
      private readonly signalLightInfoFacadeService: SignalLightInfoFacadeService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_group_info', {
      notNullKeys: ['name', 'location', 'description'],
    });
  }

  async selSignalLightGroupInfo(dto: SignalLightGroupInfoSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'selList',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'selCount',
      tblName: 'signal_light_group_info',
      selParam: dto,
    });
    const total = await this.pgsqlPrismao.$queryRawUnsafe<CountSqlReturnDto>(sqls2[0]);
    const pageVo = new PageVo<SignalLightGroupInfoDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllSignalLightGroupInfo(dto: SignalLightGroupInfoSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'selAll',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    return R.ok(datas);
  }

  async selOnesSignalLightGroupInfo(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'selByIds',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    return R.ok(res);
  }

  async selOneSignalLightGroupInfo(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'selById',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightGroupInfo(dto: SignalLightGroupInfoInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'ins',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      datas: [dto],
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdValue: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightGroupInfos(dtos: SignalLightGroupInfoInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'ins',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async updSignalLightGroupInfo(dto: SignalLightGroupInfoUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'upd',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      datas: [dto],
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdValue: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updSignalLightGroupInfos(dtos: SignalLightGroupInfoUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'upd',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
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
      const re = await this.pgsqlPrismao.$queryRawUnsafe<SignalLightGroupInfoDto[]>(sql);
      res.push(re[0]);
    }
    return R.ok(res);
  }

  async delSignalLightGroupInfo(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'del',
      tblName: 'signal_light_group_info',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    return R.ok(true);
  }

  async delSignalLightGroupInfoV2(ids: number[]): Promise<R> {
    // 删除信号灯组
    const sqls = this.cPgsqlPrismao.genSql<SignalLightGroupInfoDto>({
      type: 'del',
      tblName: 'signal_light_group_info',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe<null[]>(sqls[0]);
    // 删除子信号灯、信号灯组-子信号灯对应关联
    const slgcms = await this.signalLightGroupChildMappingFacadeService.selByGroupIds(ids);
    await this.signalLightGroupChildMappingFacadeService.delByIds(slgcms.map(item => item.id));
    await this.signalLightInfoFacadeService.delByIds(slgcms.map(item => item.childLightId));
    return R.ok(true);
  }
}
