import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingSelListDto, SignalLightStrategyTypeStrategyScheduleMappingSelAllDto, SignalLightStrategyTypeStrategyScheduleMappingInsOneDto, SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";

@Injectable()
export class SignalLightStrategyTypeStrategyScheduleMappingService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_type_strategy_schedule_mapping', {
      notNullKeys: ['strategyTypeId', 'strategyScheduleId'],
      numberKeys: ['strategyTypeId', 'strategyScheduleId'],
    });
  }

  async selSignalLightStrategyTypeStrategyScheduleMapping(dto: SignalLightStrategyTypeStrategyScheduleMappingSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingSelListDto>('signal_light_strategy_type_strategy_schedule_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightStrategyTypeStrategyScheduleMapping(dto: SignalLightStrategyTypeStrategyScheduleMappingSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStrategyTypeStrategyScheduleMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightStrategyTypeStrategyScheduleMapping(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightStrategyTypeStrategyScheduleMapping(dto: SignalLightStrategyTypeStrategyScheduleMappingInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightStrategyTypeStrategyScheduleMappings(dtos: SignalLightStrategyTypeStrategyScheduleMappingInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightStrategyTypeStrategyScheduleMapping(dto: SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightStrategyTypeStrategyScheduleMappings(dtos: SignalLightStrategyTypeStrategyScheduleMappingUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightStrategyTypeStrategyScheduleMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightStrategyTypeStrategyScheduleMappingDto>('signal_light_strategy_type_strategy_schedule_mapping', ids);
    return R.ok(res);
  }
}
