import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightGroupInfoDto, SignalLightGroupInfoSelListDto, SignalLightGroupInfoSelAllDto, SignalLightGroupInfoInsOneDto, SignalLightGroupInfoUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../../prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../../prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../../util/base";
import { PageVo } from "../../../../../common/vo/PageVo";

@Injectable()
export class SignalLightGroupInfoService {
  constructor(
      private readonly cpgprismao: CommonPostgresqlPrismaoService,
      private readonly pgprismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
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
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
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
    const datas: SignalLightGroupInfoDto[] = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const sqls2 = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'selCount',
      tblName: 'signal_light_group_info',
      selParam: dto,
    });
    const total: CountSqlReturnDto = await this.pgprismao.$queryRawUnsafe(sqls2[0]);
    const pageVo = new PageVo<SignalLightGroupInfoDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllSignalLightGroupInfo(dto: SignalLightGroupInfoSelAllDto): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'selAll',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selParam: dto,
    });
    const datas = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    return R.ok(datas);
  }

  async selOnesSignalLightGroupInfo(ids: number[]): Promise<R> {
    ids = Object.values(ids).map(Number);
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'selByIds',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    return R.ok(res);
  }

  async selOneSignalLightGroupInfo(id: number): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'selById',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selIds: [id],
    });
    const ress = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightGroupInfo(dto: SignalLightGroupInfoInsOneDto): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'ins',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      datas: [dto],
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdKey: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightGroupInfos(dtos: SignalLightGroupInfoInsOneDto[]): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'ins',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      datas: dtos,
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdKey: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgprismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async updSignalLightGroupInfo(dto: SignalLightGroupInfoUpdOneDto): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'upd',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      datas: [dto],
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdKey: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updSignalLightGroupInfos(dtos: SignalLightGroupInfoUpdOneDto[]): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'upd',
      tblName: 'signal_light_group_info',
      clas: new SignalLightGroupInfoDto(),
      datas: dtos,
      selfDefineSelKey: {
        location: 'concat(st_x(location)::text, \',\', st_y(location)::text)'
      },
      selfDefineInsUpdKey: {
        location: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgprismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async delSignalLightGroupInfo(ids: number[]): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'del',
      tblName: 'signal_light_group_info',
      delIds: ids,
    });
    await this.pgprismao.$queryRawUnsafe(sqls[0]);
    return R.ok(true);
  }

  async delSignalLightGroupInfoV2(ids: number[]): Promise<R> {
    // 删除信号灯组
    const sqls = this.cpgprismao.genSql<SignalLightGroupInfoDto>({
      type: 'del',
      tblName: 'signal_light_group_info',
      delIds: ids,
    });
    await this.pgprismao.$queryRawUnsafe(sqls[0]);
    // 删除子信号灯、信号灯组-子信号灯对应关联
    const defaultSelArg = this.cpgprismao.defaultSelArg();
    const defaultDelArg = this.cpgprismao.defaultDelArg();
    const slgcms = await this.pgprismao.signal_light_group_child_mapping.findMany({
      where: {
        group_id: {
          in: ids
        },
        ...defaultSelArg.where
      }
    });
    await this.pgprismao.signal_light_group_child_mapping.updateMany({
      data: {
        ...defaultDelArg.data
      },
      where: {
        id: {
          in: slgcms.map(item => item.id)
        },
        ...defaultDelArg.where
      }
    })
    await this.pgprismao.signal_light_info.updateMany({
      data: {
        ...defaultDelArg.data
      },
      where: {
        id: {
          in: slgcms.map(item => item.child_light_id)
        },
        ...defaultDelArg.where
      }
    })
    return R.ok(true);
  }
}
