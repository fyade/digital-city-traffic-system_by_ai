import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { SignalLightChildStrategyScheduleMappingDto, SignalLightChildStrategyScheduleMappingSelListDto, SignalLightChildStrategyScheduleMappingSelAllDto, SignalLightChildStrategyScheduleMappingInsOneDto, SignalLightChildStrategyScheduleMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../../prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../../prisma/postgresql.prismao.service";
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";

@Injectable()
export class SignalLightChildStrategyScheduleMappingService {
  constructor(
      private readonly cpgprismao: CommonPostgresqlPrismaoService,
      private readonly pgprismao: PostgresqlPrismaoService,
      private readonly pgprisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_child_strategy_schedule_mapping', {
      notNullKeys: ['childLightId', 'strategyScheduleId'],
      numberKeys: ['childLightId', 'strategyScheduleId'],
    });
  }

  async selSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingSelListDto): Promise<R> {
    const res = await this.pgprisma.findPage<SignalLightChildStrategyScheduleMappingDto, SignalLightChildStrategyScheduleMappingSelListDto>('signal_light_child_strategy_schedule_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingSelAllDto): Promise<R> {
    const res = await this.pgprisma.findAll<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightChildStrategyScheduleMapping(ids: number[]): Promise<R> {
    const res = await this.pgprisma.findByIds<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightChildStrategyScheduleMapping(id: number): Promise<R> {
    const res = await this.pgprisma.findById<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingInsOneDto): Promise<R> {
    const res = await this.pgprisma.create<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightChildStrategyScheduleMappings(dtos: SignalLightChildStrategyScheduleMappingInsOneDto[]): Promise<R> {
    const res = await this.pgprisma.createMany<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightChildStrategyScheduleMapping(dto: SignalLightChildStrategyScheduleMappingUpdOneDto): Promise<R> {
    const res = await this.pgprisma.updateById<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightChildStrategyScheduleMappings(dtos: SignalLightChildStrategyScheduleMappingUpdOneDto[]): Promise<R> {
    const res = await this.pgprisma.updateMany<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightChildStrategyScheduleMapping(ids: number[]): Promise<R> {
    const res = await this.pgprisma.deleteById<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', ids);
    return R.ok(res);
  }

  async insSignalLightChildStrategyScheduleMappingV2(dto: SignalLightChildStrategyScheduleMappingInsOneDto): Promise<R> {
    // 删除已有的子信号灯-信号灯策略调度关联
    const a = await this.pgprismao.getOrigin().signal_light_child_strategy_schedule_mapping.findMany({
      where: {
        child_light_id: dto.childLightId,
        ...this.cpgprismao.defaultDelArg().where
      }
    })
    if (a.length > 0) {
      const defaultDelArg = this.cpgprismao.defaultDelArg();
      await this.pgprismao.getOrigin().signal_light_child_strategy_schedule_mapping.updateMany({
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
    const res = await this.pgprisma.create<SignalLightChildStrategyScheduleMappingDto>('signal_light_child_strategy_schedule_mapping', dto);
    return R.ok(res);
  }
}
