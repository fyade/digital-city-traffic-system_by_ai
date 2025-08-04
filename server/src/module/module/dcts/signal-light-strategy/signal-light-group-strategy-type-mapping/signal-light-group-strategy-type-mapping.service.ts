import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightGroupStrategyTypeMappingDto, SignalLightGroupStrategyTypeMappingSelListDto, SignalLightGroupStrategyTypeMappingSelAllDto, SignalLightGroupStrategyTypeMappingInsOneDto, SignalLightGroupStrategyTypeMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";
import { PostgresqlPrismaoService } from "../../../../../prisma/postgresql.prismao.service";
import { PrismaoService } from "../../../../../prisma/prismao.service";
import { DctsCoreService } from "../../core/dcts-core.service";

@Injectable()
export class SignalLightGroupStrategyTypeMappingService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly dctsCoreService: DctsCoreService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_group_strategy_type_mapping', {
      notNullKeys: ['groupId', 'strategyTypeId'],
      numberKeys: ['groupId', 'strategyTypeId'],
    });
  }

  async selSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightGroupStrategyTypeMappingDto, SignalLightGroupStrategyTypeMappingSelListDto>('signal_light_group_strategy_type_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightGroupStrategyTypeMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightGroupStrategyTypeMapping(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingInsOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.create<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightGroupStrategyTypeMappings(dtos: SignalLightGroupStrategyTypeMappingInsOneDto[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.createMany<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingUpdOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.updateById<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightGroupStrategyTypeMappings(dtos: SignalLightGroupStrategyTypeMappingUpdOneDto[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.updateMany<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightGroupStrategyTypeMapping(ids: number[]): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    const res = await this.pgsqlPrisma.deleteById<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', ids);
    return R.ok(res);
  }

  async insSignalLightGroupStrategyTypeMappingV2(dto: SignalLightGroupStrategyTypeMappingInsOneDto): Promise<R> {
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    // 删除已有的信号灯组-信号灯策略类型关联
    const a = await this.pgsqlPrismao.signal_light_group_strategy_type_mapping.findMany({
      where: {
        group_id: dto.groupId,
        ...this.prismao.defaultSelArg().where
      }
    });
    if (a.length > 0) {
      const defaultDelArg = this.prismao.defaultDelArg();
      await this.pgsqlPrismao.signal_light_group_strategy_type_mapping.updateMany({
        data: {
          ...defaultDelArg.data
        },
        where: {
          id: {
            in: a.map(item => item.id)
          },
          ...defaultDelArg.where
        },
      })
      // 删除子信号灯-信号灯策略调度关联
      const groupIds = a.map(item => item.group_id);
      const slgcms = await this.pgsqlPrismao.signal_light_group_child_mapping.findMany({
        where: {
          group_id: {
            in: groupIds
          },
          ...this.prismao.defaultSelArg().where
        }
      });
      const childLightIds = slgcms.map(item => item.child_light_id);
      await this.pgsqlPrismao.signal_light_child_strategy_schedule_mapping.updateMany({
        data: {
          ...defaultDelArg.data
        },
        where: {
          child_light_id: {
            in: childLightIds
          },
          ...defaultDelArg.where
        }
      })
    }
    const res = await this.pgsqlPrisma.create<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dto);
    return R.ok(res);
  }
}
