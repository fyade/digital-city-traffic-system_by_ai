import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightChildStrategyScheduleMappingDto, SignalLightChildStrategyScheduleMappingSelListDto, SignalLightChildStrategyScheduleMappingSelAllDto, SignalLightChildStrategyScheduleMappingInsOneDto, SignalLightChildStrategyScheduleMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { PrismaoService } from "../../../../infra/prisma/prismao.service";
import { DctsCoreService } from "../../core/dcts-core.service";

@Injectable()
export class SignalLightChildStrategyScheduleMappingService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly dctsCoreService: DctsCoreService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_child_strategy_schedule_mapping', {
      notNullKeys: ['childLightId', 'strategyScheduleId'],
      numberKeys: ['childLightId', 'strategyScheduleId'],
    });
  }

  async selSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightChildStrategyScheduleMappingDto, SignalLightChildStrategyScheduleMappingSelListDto>('signal_light_child_strategy_schedule_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightChildStrategyScheduleMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightChildStrategyScheduleMapping(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingInsOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.create<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightChildStrategyScheduleMappings(dtos: SignalLightChildStrategyScheduleMappingInsOneDto[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.createMany<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingUpdOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.updateById<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightChildStrategyScheduleMappings(dtos: SignalLightChildStrategyScheduleMappingUpdOneDto[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.updateMany<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightChildStrategyScheduleMapping(ids: number[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.deleteById<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', ids);
    return R.ok(res);
  }

  async insSignalLightChildStrategyScheduleMappingV2(dto: SignalLightChildStrategyScheduleMappingInsOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    // 删除已有的子信号灯-信号灯策略调度关联
    const a = await this.pgsqlPrismao.signal_light_child_strategy_schedule_mapping.findMany({
      where: {
        child_light_id: dto.childLightId,
        ...this.prismao.defaultDelArg().where
      }
    })
    if (a.length > 0) {
      const defaultDelArg = this.prismao.defaultDelArg();
      await this.pgsqlPrismao.signal_light_child_strategy_schedule_mapping.updateMany({
        data: {
          ...defaultDelArg.data
        },
        where: {
          id: {
            in: a.map(item => item.id)
          },
          ...defaultDelArg.where
        }
      })
    }
    const res = await this.pgsqlPrisma.create<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dto);
    return R.ok(res);
  }
}
