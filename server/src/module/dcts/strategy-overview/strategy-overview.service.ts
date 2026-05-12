import { Injectable } from '@nestjs/common';
import { PostgresqlPrismaService } from '../../../infra/prisma/postgresql.prisma.service';
import { R } from '../../../common/R';
import { StrategyOverviewGroupVo, StrategyParamVo, StrategyScheduleVo, StrategyTypeVo } from './dto';
import { SignalLightGroupInfoDto } from '../signal-light/signal-light-group-info/dto';
import { SignalLightStrategyTypeDto } from '../signal-light-strategy/signal-light-strategy-type/dto';
import { SignalLightStrategyScheduleDto } from '../signal-light-strategy/signal-light-strategy-schedule/dto';
import { SignalLightStrategyParamDto } from '../signal-light-strategy/signal-light-strategy-param/dto';
import { SignalLightGroupStrategyTypeMappingDto } from '../signal-light-strategy/signal-light-group-strategy-type-mapping/dto';
import { SignalLightStrategyTypeStrategyScheduleMappingDto } from '../signal-light-strategy/signal-light-strategy-type-strategy-schedule-mapping/dto';
import { SignalLightStrategyScheduleStrategyParamMappingDto } from '../signal-light-strategy/signal-light-strategy-schedule-strategy-param-mapping/dto';

interface GroupItem { id: number; name: string }
interface StrategyTypeItem { id: number; name: string; strategyType: string; scheduleType: string }
interface ScheduleItem { id: number; name: string }
interface ParamItem { id: number; name: string; lightType: string; round: number; duration: number; currentLight: string }
interface GroupTypeMapping { groupId: number; strategyTypeId: number }
interface TypeScheduleMapping { strategyTypeId: number; strategyScheduleId: number }
interface ScheduleParamMapping { strategyScheduleId: number; strategyParamId: number }

@Injectable()
export class StrategyOverviewService {
  constructor(
    private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {}

  async getOverview(): Promise<R> {
    // 1. 并行查询所有基础表
    const [groups, allStrategyTypes, allSchedules, allParams] = await Promise.all([
      this.pgsqlPrisma.findAll('signal_light_group_info', {}) as Promise<GroupItem[]>,
      this.pgsqlPrisma.findAll('signal_light_strategy_type', {}) as Promise<StrategyTypeItem[]>,
      this.pgsqlPrisma.findAll('signal_light_strategy_schedule', {}) as Promise<ScheduleItem[]>,
      this.pgsqlPrisma.findAll('signal_light_strategy_param', {}) as Promise<ParamItem[]>,
    ]);

    // 2. 并行查询所有关联映射表
    const [groupTypeMappings, typeScheduleMappings, scheduleParamMappings] = await Promise.all([
      this.pgsqlPrisma.findAll('signal_light_group_strategy_type_mapping', {}) as Promise<GroupTypeMapping[]>,
      this.pgsqlPrisma.findAll('signal_light_strategy_type_strategy_schedule_mapping', {}) as Promise<TypeScheduleMapping[]>,
      this.pgsqlPrisma.findAll('signal_light_strategy_schedule_strategy_param_mapping', {}) as Promise<ScheduleParamMapping[]>,
    ]);

    // 构建参数索引: paramId → param
    const paramById = new Map<number, ParamItem>();
    for (const p of allParams) paramById.set(p.id, p);

    // 构建: scheduleId → params[]
    const scheduleParamMap = new Map<number, StrategyParamVo[]>();
    for (const spm of scheduleParamMappings) {
      const param = paramById.get(spm.strategyParamId);
      if (!param) continue;
      if (!scheduleParamMap.has(spm.strategyScheduleId)) {
        scheduleParamMap.set(spm.strategyScheduleId, []);
      }
      scheduleParamMap.get(spm.strategyScheduleId)!.push({
        paramId: param.id,
        name: param.name,
        lightType: param.lightType,
        round: param.round,
        duration: param.duration,
        currentLight: param.currentLight,
      });
    }

    // 构建调度索引: scheduleId → schedule
    const scheduleById = new Map<number, ScheduleItem>();
    for (const s of allSchedules) scheduleById.set(s.id, s);

    // 构建: typeId → schedules[]
    const typeScheduleMap = new Map<number, StrategyScheduleVo[]>();
    for (const tsm of typeScheduleMappings) {
      const schedule = scheduleById.get(tsm.strategyScheduleId);
      if (!schedule) continue;
      if (!typeScheduleMap.has(tsm.strategyTypeId)) {
        typeScheduleMap.set(tsm.strategyTypeId, []);
      }
      typeScheduleMap.get(tsm.strategyTypeId)!.push({
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        params: scheduleParamMap.get(schedule.id) || [],
      });
    }

    // 构建策略类型索引: typeId → type
    const typeById = new Map<number, StrategyTypeItem>();
    for (const t of allStrategyTypes) typeById.set(t.id, t);

    // 构建: groupId → strategyTypes[]
    const groupTypeMap = new Map<number, StrategyTypeVo[]>();
    for (const gtm of groupTypeMappings) {
      const type = typeById.get(gtm.strategyTypeId);
      if (!type) continue;
      if (!groupTypeMap.has(gtm.groupId)) {
        groupTypeMap.set(gtm.groupId, []);
      }
      groupTypeMap.get(gtm.groupId)!.push({
        typeId: type.id,
        typeName: type.name,
        strategyType: type.strategyType,
        scheduleType: type.scheduleType,
        schedules: typeScheduleMap.get(type.id) || [],
      });
    }

    // 组装最终结果
    const result: StrategyOverviewGroupVo[] = groups.map(g => ({
      groupId: g.id,
      groupName: g.name,
      strategyTypes: groupTypeMap.get(g.id) || [],
    }));

    return R.ok(result);
  }
}
