import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightStrategyScheduleDto, SignalLightStrategyScheduleSelListDto, SignalLightStrategyScheduleSelAllDto, SignalLightStrategyScheduleInsOneDto, SignalLightStrategyScheduleUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";

@Injectable()
export class SignalLightStrategyScheduleService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_schedule', {
      notNullKeys: ['name', 'description', 'ifDisabled', 'orderNum'],
      numberKeys: ['orderNum'],
    });
  }

  async selSignalLightStrategySchedule(dto: SignalLightStrategyScheduleSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightStrategyScheduleDto, SignalLightStrategyScheduleSelListDto>('signal_light_strategy_schedule', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllSignalLightStrategySchedule(dto: SignalLightStrategyScheduleSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStrategySchedule(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightStrategySchedule(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', Number(id));
    return R.ok(res);
  }

  async insSignalLightStrategySchedule(dto: SignalLightStrategyScheduleInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', dto);
    return R.ok(res);
  }

  async insSignalLightStrategySchedules(dtos: SignalLightStrategyScheduleInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', dtos);
    return R.ok(res);
  }

  async updSignalLightStrategySchedule(dto: SignalLightStrategyScheduleUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', dto);
    return R.ok(res);
  }

  async updSignalLightStrategySchedules(dtos: SignalLightStrategyScheduleUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', dtos);
    return R.ok(res);
  }

  async delSignalLightStrategySchedule(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightStrategyScheduleDto>('signal_light_strategy_schedule', ids);
    return R.ok(res);
  }
}
