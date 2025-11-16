import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightStrategyParamDto, SignalLightStrategyParamSelListDto, SignalLightStrategyParamSelAllDto, SignalLightStrategyParamInsOneDto, SignalLightStrategyParamUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { DctsCoreService } from "../../core/dcts-core.service";

@Injectable()
export class SignalLightStrategyParamService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly dctsCoreService: DctsCoreService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_param', {
      notNullKeys: ['name', 'description', 'lightType', 'round', 'duration', 'currentLight', 'ifDisabled', 'orderNum'],
      numberKeys: ['round', 'duration', 'orderNum'],
    });
  }

  async selSignalLightStrategyParam(dto: SignalLightStrategyParamSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightStrategyParamDto>('signal_light_strategy_param', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllSignalLightStrategyParam(dto: SignalLightStrategyParamSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightStrategyParamDto>('signal_light_strategy_param', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStrategyParam(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightStrategyParamDto>('signal_light_strategy_param', ids);
    return R.ok(res);
  }

  async selOneSignalLightStrategyParam(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightStrategyParamDto>('signal_light_strategy_param', id);
    return R.ok(res);
  }

  async insSignalLightStrategyParam(dto: SignalLightStrategyParamInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightStrategyParamDto>('signal_light_strategy_param', dto);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async insSignalLightStrategyParams(dtos: SignalLightStrategyParamInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightStrategyParamDto>('signal_light_strategy_param', dtos);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async updSignalLightStrategyParam(dto: SignalLightStrategyParamUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightStrategyParamDto>('signal_light_strategy_param', dto);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async updSignalLightStrategyParams(dtos: SignalLightStrategyParamUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightStrategyParamDto>('signal_light_strategy_param', dtos);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async delSignalLightStrategyParam(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightStrategyParamDto>('signal_light_strategy_param', ids);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }
}
