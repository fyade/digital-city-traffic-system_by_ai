import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeSelListDto, SignalLightStrategyTypeSelAllDto, SignalLightStrategyTypeInsOneDto, SignalLightStrategyTypeUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { DctsCoreService } from "../../core/dcts-core.service";

@Injectable()
export class SignalLightStrategyTypeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly dctsCoreService: DctsCoreService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_type', {
      notNullKeys: ['name', 'description', 'strategyType', 'scheduleType', 'startTime', 'endTime', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
  }

  async selSignalLightStrategyType(dto: SignalLightStrategyTypeSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightStrategyTypeDto>('signal_light_strategy_type', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllSignalLightStrategyType(dto: SignalLightStrategyTypeSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightStrategyTypeDto>('signal_light_strategy_type', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStrategyType(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightStrategyTypeDto>('signal_light_strategy_type', ids);
    return R.ok(res);
  }

  async selOneSignalLightStrategyType(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightStrategyTypeDto>('signal_light_strategy_type', id);
    return R.ok(res);
  }

  async insSignalLightStrategyType(dto: SignalLightStrategyTypeInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightStrategyTypeDto>('signal_light_strategy_type', dto);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async insSignalLightStrategyTypes(dtos: SignalLightStrategyTypeInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightStrategyTypeDto>('signal_light_strategy_type', dtos);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async updSignalLightStrategyType(dto: SignalLightStrategyTypeUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightStrategyTypeDto>('signal_light_strategy_type', dto);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async updSignalLightStrategyTypes(dtos: SignalLightStrategyTypeUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightStrategyTypeDto>('signal_light_strategy_type', dtos);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async delSignalLightStrategyType(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightStrategyTypeDto>('signal_light_strategy_type', ids);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }
}
