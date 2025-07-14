import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScheduleService } from "../../../schedule/schedule.service";
import { WsService } from "../../../ws/ws.service";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";
import { base } from "../../../../util/base";
import { baseUtils } from "@dcts/common";
import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import { SignalLightGroupStrategyTypeMappingDto } from "../signal-light-strategy/signal-light-group-strategy-type-mapping/dto";
import { SignalLightStrategyTypeDto } from "../signal-light-strategy/signal-light-strategy-type/dto";
import { SignalLightChildStrategyScheduleMappingDto } from "../signal-light-strategy/signal-light-child-strategy-schedule-mapping/dto";
import { SignalLightStrategyTypeStrategyScheduleMappingDto } from "../signal-light-strategy/signal-light-strategy-type-strategy-schedule-mapping/dto";
import { SignalLightStrategyScheduleDto } from "../signal-light-strategy/signal-light-strategy-schedule/dto";
import { SignalLightStrategyScheduleStrategyParamMappingDto } from "../signal-light-strategy/signal-light-strategy-schedule-strategy-param-mapping/dto";
import { SignalLightStrategyParamDto } from "../signal-light-strategy/signal-light-strategy-param/dto";
import { PrismaoService } from "../../../../prisma/prismao.service";

@Injectable()
export class CoreService implements OnModuleInit {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly scheduleService: ScheduleService,
      private readonly wsService: WsService,
  ) {
    this.scheduleService.addScheduleFunc('sys:dcts:runCoreSchedule', this.runCoreSchedule.bind(this))
  }

  /**
   * 仅供框架调用，禁止外部调用
   */
  async onModuleInit() {
    await this.runCore()
  }

  private async runCore() {
    await this.calculateLight()
    const strings = this.wsService.addEventListener('test:test', async data => {
      console.log('===== ===== ===== ===== ===== ===== data', data);
      this.wsService.sendMsg(data.userInfo.loginRole, data.userInfo.userid, 'test:test2', 'hello too!')
      this.wsService.sendMsg(data.userInfo.loginRole, data.userInfo.userid, 'test:test3', 'hello too3!')
    });
    console.log('===== ===== ===== ===== ===== ===== strings', strings)
  }

  /**
   * 计算信号灯
   * @private
   */
  private async calculateLight() {
    const start = performance.now();
    const defaultSelArg = this.prismao.defaultSelArg();
    // 查询所有信号灯组
    const allSignalLightGroups = (await this.pgsqlPrismao.signal_light_group_info.findMany({
      where: {
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightGroupInfoDto>)
    // 查询信号灯组下的子信号灯
    const _signalLightGroup_signalLight = (await this.pgsqlPrismao.signal_light_group_child_mapping.findMany({
      where: {
        group_id: {
          in: allSignalLightGroups.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightGroupChildMappingDto>)
    const allSignalLights = (await this.pgsqlPrismao.signal_light_info.findMany({
      where: {
        id: {
          in: _signalLightGroup_signalLight.map(item => item.childLightId)
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightInfoDto>)
    // 查询信号灯组下的策略类型
    const _signalLightGroup_strategyType = (await this.pgsqlPrismao.signal_light_group_strategy_type_mapping.findMany({
      where: {
        group_id: {
          in: allSignalLightGroups.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightGroupStrategyTypeMappingDto>)
    const allStrategyTypes = (await this.pgsqlPrismao.signal_light_strategy_type.findMany({
      where: {
        id: {
          in: _signalLightGroup_strategyType.map(item => item.strategyTypeId)
        },
        if_disabled: base.N,
        ...defaultSelArg.where
      },
      orderBy: [
        {order_num: 'asc'},
        {create_time: 'desc'}
      ]
    })).map(baseUtils.objToCamelCase<SignalLightStrategyTypeDto>)
    // 查询子信号灯与策略类型下的策略调度
    const _signalLight_strategySchedule = (await this.pgsqlPrismao.signal_light_child_strategy_schedule_mapping.findMany({
      where: {
        child_light_id: {
          in: allSignalLights.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightChildStrategyScheduleMappingDto>)
    const _strategyType_strategySchedule = (await this.pgsqlPrismao.signal_light_strategy_type_strategy_schedule_mapping.findMany({
      where: {
        strategy_type_id: {
          in: allStrategyTypes.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightStrategyTypeStrategyScheduleMappingDto>)
    const allStrategySchedules = (await this.pgsqlPrismao.signal_light_strategy_schedule.findMany({
      where: {
        id: {
          in: [
            ..._signalLight_strategySchedule.map(item => item.strategyScheduleId),
            ..._strategyType_strategySchedule.map(item => item.strategyScheduleId)
          ]
        },
        if_disabled: base.N,
        ...defaultSelArg.where
      },
      orderBy: [
        {order_num: 'asc'},
        {create_time: 'desc'}
      ]
    })).map(baseUtils.objToCamelCase<SignalLightStrategyScheduleDto>)
    // 查询策略调度下的策略参数
    const _strategySchedule_strategyParam = (await this.pgsqlPrismao.signal_light_strategy_schedule_strategy_param_mapping.findMany({
      where: {
        strategy_schedule_id: {
          in: allStrategySchedules.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightStrategyScheduleStrategyParamMappingDto>)
    const allStrategyParams = (await this.pgsqlPrismao.signal_light_strategy_param.findMany({
      where: {
        id: {
          in: _strategySchedule_strategyParam.map(item => item.strategyParamId)
        },
        if_disabled: base.N,
        ...defaultSelArg.where
      },
      orderBy: [
        {order_num: 'asc'},
        {create_time: 'desc'}
      ]
    })).map(baseUtils.objToCamelCase<SignalLightStrategyParamDto>)

    const start2 = performance.now();
    for (const allSignalLightGroup of allSignalLightGroups) {
      console.log('===== ===== ===== ===== ===== ===== ===== ===== ===== =====')
      console.log('信号灯组id', allSignalLightGroup.id)
      // 该信号灯组下的子信号灯
      const lights = allSignalLights.filter(light => {
        return _signalLightGroup_signalLight.some(item => item.groupId === allSignalLightGroup.id && item.childLightId === light.id)
      })
      const lightIds = lights.map(item => item.id)
      console.log('子信号灯id', lightIds)
      // 该信号灯组下的策略类型
      const strategyTypes = allStrategyTypes.filter(type => {
        return _signalLightGroup_strategyType.some(item => item.groupId === allSignalLightGroup.id && item.strategyTypeId === type.id)
      })
      const strategyTypeIds = strategyTypes.map(item => item.id)
      console.log('策略类型id', strategyTypeIds)
      // 该子信号灯且该策略类型下的策略调度
      const strategySchedules = allStrategySchedules.filter(schedule => {
        return _signalLight_strategySchedule.some(item => lightIds.includes(item.childLightId) && item.strategyScheduleId === schedule.id)
            && _strategyType_strategySchedule.some(item => strategyTypeIds.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds = strategySchedules.map(item => item.id)
      console.log('策略调度id', strategyScheduleIds)
      // 该策略调度下的策略参数
      const strategyParams = allStrategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
      })
      const strategyParamIds = strategyParams.map(item => item.id)
      console.log('策略参数id', strategyParamIds)

      // 开始计算每秒钟每种灯的状态
      for (const light of lights) {
        // 该灯的策略调度
        const strategySchedulesOfThisLight = allStrategySchedules.filter(schedule => {
          return _signalLight_strategySchedule.some(item => item.strategyScheduleId === schedule.id && item.childLightId === light.id)
        });
        const strategyScheduleIdsOfThisLight = strategySchedulesOfThisLight.map(item => item.id);
        // 该灯的策略参数
        const strategyParamsOfThisLight = allStrategyParams.filter(param => {
          return _strategySchedule_strategyParam.some(item => strategyScheduleIdsOfThisLight.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
        })

        // 策略类型-策略调度-策略参数 关系
        const relation: [SignalLightStrategyTypeDto, SignalLightStrategyScheduleDto, SignalLightStrategyParamDto][] = []
        for (const strategyType of strategyTypes) {
          // 该子信号灯且该策略类型下的策略调度
          const strategySchedulesOfThisStrategyType = allStrategySchedules.filter(schedule => {
            return _signalLight_strategySchedule.some(item => item.strategyScheduleId === schedule.id && item.childLightId === light.id)
                && _strategyType_strategySchedule.some(item => item.strategyScheduleId === schedule.id && item.strategyTypeId === strategyType.id)
          })
          for (const strategySchedule of strategySchedulesOfThisStrategyType) {
            // 该策略调度下的策略参数
            const strategyParamsOfThisStrategySchedule = allStrategyParams.filter(param => {
              return _strategySchedule_strategyParam.some(item => item.strategyParamId === param.id && item.strategyScheduleId === strategySchedule.id)
            })
            for (const strategyParam of strategyParamsOfThisStrategySchedule) {
              relation.push([strategyType, strategySchedule, strategyParam])
            }
          }
        }

        console.log('----- ----- ----- ----- ----- -----')
        console.log('子信号灯id', light.id, '策略类型-策略调度-策略参数关系', relation.map(ar => [ar[0].id, ar[1].id, ar[2].id]))
      }
    }

    const end = performance.now();
    const t1 = Math.round(start2 - start);
    const t2 = Math.round(end - start2);
    console.info(`calculateLight查询所需时间 ${t1} ms，计算所需时间 ${t2} ms，共 ${t1 + t2} ms。`)
  }

  private async runCoreSchedule() {
    return true
  }
}
