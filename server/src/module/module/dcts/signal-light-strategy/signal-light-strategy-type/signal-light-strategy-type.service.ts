import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeSelListDto, SignalLightStrategyTypeSelAllDto, SignalLightStrategyTypeInsOneDto, SignalLightStrategyTypeUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../../prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../../prisma/postgresql.prismao.service";
import { PageVo } from "../../../../../common/vo/PageVo";
import { CountSqlReturnDto } from "../../../../../util/base";

@Injectable()
export class SignalLightStrategyTypeService {
  constructor(
      private readonly cpgprismao: CommonPostgresqlPrismaoService,
      private readonly pgprismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_type', {
      notNullKeys: ['name', 'description'],
    });
  }

  async selSignalLightStrategyType(dto: SignalLightStrategyTypeSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'selList',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas: SignalLightStrategyTypeDto[] = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const sqls2 = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'selCount',
      tblName: 'signal_light_strategy_type',
      selParam: dto,
    });
    const total: CountSqlReturnDto = await this.pgprismao.$queryRawUnsafe(sqls2[0]);
    const pageVo = new PageVo<SignalLightStrategyTypeDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllSignalLightStrategyType(dto: SignalLightStrategyTypeSelAllDto): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'selAll',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      selParam: dto,
    });
    const datas = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    return R.ok(datas);
  }

  async selOnesSignalLightStrategyType(ids: number[]): Promise<R> {
    ids = Object.values(ids).map(Number);
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'selByIds',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      selIds: ids,
    });
    const res = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    return R.ok(res);
  }

  async selOneSignalLightStrategyType(id: number): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'selById',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      selIds: [id],
    });
    const ress = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightStrategyType(dto: SignalLightStrategyTypeInsOneDto): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'ins',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      datas: [dto],
    });
    const ress = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insSignalLightStrategyTypes(dtos: SignalLightStrategyTypeInsOneDto[]): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'ins',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      datas: dtos,
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgprismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async updSignalLightStrategyType(dto: SignalLightStrategyTypeUpdOneDto): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'upd',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      datas: [dto],
    });
    const ress = await this.pgprismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updSignalLightStrategyTypes(dtos: SignalLightStrategyTypeUpdOneDto[]): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'upd',
      tblName: 'signal_light_strategy_type',
      clas: new SignalLightStrategyTypeDto(),
      datas: dtos,
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgprismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async delSignalLightStrategyType(ids: number[]): Promise<R> {
    const sqls = this.cpgprismao.genSql<SignalLightStrategyTypeDto>({
      type: 'del',
      tblName: 'signal_light_strategy_type',
      delIds: ids,
    });
    await this.pgprismao.$queryRawUnsafe(sqls[0]);
    return R.ok(true);
  }
}
