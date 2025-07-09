import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightGroupStrategyTypeMappingDto, SignalLightGroupStrategyTypeMappingSelListDto, SignalLightGroupStrategyTypeMappingSelAllDto, SignalLightGroupStrategyTypeMappingInsOneDto, SignalLightGroupStrategyTypeMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";
import { CommonPostgresqlPrismaoService } from "../../../../../prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../../prisma/postgresql.prismao.service";

@Injectable()
export class SignalLightGroupStrategyTypeMappingService {
  constructor(
      private readonly cpgprismao: CommonPostgresqlPrismaoService,
      private readonly pgprismao: PostgresqlPrismaoService,
      private readonly pgprisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_group_strategy_type_mapping', {
      notNullKeys: ['groupId', 'strategyTypeId'],
      numberKeys: ['groupId', 'strategyTypeId'],
    });
  }

  async selSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingSelListDto): Promise<R> {
    const res = await this.pgprisma.findPage<SignalLightGroupStrategyTypeMappingDto, SignalLightGroupStrategyTypeMappingSelListDto>('signal_light_group_strategy_type_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingSelAllDto): Promise<R> {
    const res = await this.pgprisma.findAll<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightGroupStrategyTypeMapping(ids: number[]): Promise<R> {
    const res = await this.pgprisma.findByIds<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightGroupStrategyTypeMapping(id: number): Promise<R> {
    const res = await this.pgprisma.findById<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingInsOneDto): Promise<R> {
    const res = await this.pgprisma.create<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightGroupStrategyTypeMappings(dtos: SignalLightGroupStrategyTypeMappingInsOneDto[]): Promise<R> {
    const res = await this.pgprisma.createMany<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightGroupStrategyTypeMapping(dto: SignalLightGroupStrategyTypeMappingUpdOneDto): Promise<R> {
    const res = await this.pgprisma.updateById<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightGroupStrategyTypeMappings(dtos: SignalLightGroupStrategyTypeMappingUpdOneDto[]): Promise<R> {
    const res = await this.pgprisma.updateMany<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightGroupStrategyTypeMapping(ids: number[]): Promise<R> {
    const res = await this.pgprisma.deleteById<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', ids);
    return R.ok(res);
  }

  async insSignalLightGroupStrategyTypeMappingV2(dto: SignalLightGroupStrategyTypeMappingInsOneDto): Promise<R> {
    // 删除已有的信号灯组-信号灯策略类型关联
    const a = await this.pgprismao.getOrigin().signal_light_group_strategy_type_mapping.findMany({
      where: {
        group_id: dto.groupId,
        ...this.cpgprismao.defaultSelArg().where
      }
    });
    if (a.length > 0) {
      const defaultDelArg = this.cpgprismao.defaultDelArg();
      await this.pgprismao.getOrigin().signal_light_group_strategy_type_mapping.updateMany({
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
      const slgcms = await this.pgprismao.getOrigin().signal_light_group_child_mapping.findMany({
        where: {
          group_id: {
            in: groupIds
          },
          ...this.cpgprismao.defaultSelArg().where
        }
      });
      const childLightIds = slgcms.map(item => item.child_light_id);
      await this.pgprismao.getOrigin().signal_light_child_strategy_schedule_mapping.updateMany({
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
    const res = await this.pgprisma.create<SignalLightGroupStrategyTypeMappingDto>('signal_light_group_strategy_type_mapping', dto);
    return R.ok(res);
  }
}
