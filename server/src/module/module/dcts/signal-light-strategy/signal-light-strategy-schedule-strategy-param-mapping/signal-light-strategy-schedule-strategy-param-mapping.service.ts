import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightStrategyScheduleStrategyParamMappingDto, SignalLightStrategyScheduleStrategyParamMappingSelListDto, SignalLightStrategyScheduleStrategyParamMappingSelAllDto, SignalLightStrategyScheduleStrategyParamMappingInsOneDto, SignalLightStrategyScheduleStrategyParamMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";
import { DctsCoreService } from "../../core/dcts-core.service";

@Injectable()
export class SignalLightStrategyScheduleStrategyParamMappingService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly dctsCoreService: DctsCoreService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_schedule_strategy_param_mapping', {
      notNullKeys: ['strategyScheduleId', 'strategyParamId'],
      numberKeys: ['strategyScheduleId', 'strategyParamId'],
    });
  }

  async selSignalLightStrategyScheduleStrategyParamMapping(dto: SignalLightStrategyScheduleStrategyParamMappingSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightStrategyScheduleStrategyParamMappingDto, SignalLightStrategyScheduleStrategyParamMappingSelListDto>('signal_light_strategy_schedule_strategy_param_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightStrategyScheduleStrategyParamMapping(dto: SignalLightStrategyScheduleStrategyParamMappingSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStrategyScheduleStrategyParamMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightStrategyScheduleStrategyParamMapping(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightStrategyScheduleStrategyParamMapping(dto: SignalLightStrategyScheduleStrategyParamMappingInsOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.create<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightStrategyScheduleStrategyParamMappings(dtos: SignalLightStrategyScheduleStrategyParamMappingInsOneDto[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.createMany<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightStrategyScheduleStrategyParamMapping(dto: SignalLightStrategyScheduleStrategyParamMappingUpdOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.updateById<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightStrategyScheduleStrategyParamMappings(dtos: SignalLightStrategyScheduleStrategyParamMappingUpdOneDto[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.updateMany<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightStrategyScheduleStrategyParamMapping(ids: number[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.deleteById<SignalLightStrategyScheduleStrategyParamMappingDto>('signal_light_strategy_schedule_strategy_param_mapping', ids);
    return R.ok(res);
  }
}
