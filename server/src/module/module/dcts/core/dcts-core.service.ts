import { Injectable } from '@nestjs/common';
import { ScheduleService } from "../../../schedule/schedule.service";
import { WsService } from "../../../ws/ws.service";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";
import { base, SLSSTTypeEnum, SLSTTTypeEnum } from "../../../../util/base";
import { baseUtils, objectUtils, timeUtils } from "@dcts/common";
import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import {
  SignalLightGroupStrategyTypeMappingDto
} from "../signal-light-strategy/signal-light-group-strategy-type-mapping/dto";
import { SignalLightStrategyTypeDto } from "../signal-light-strategy/signal-light-strategy-type/dto";
import {
  SignalLightChildStrategyScheduleMappingDto
} from "../signal-light-strategy/signal-light-child-strategy-schedule-mapping/dto";
import {
  SignalLightStrategyTypeStrategyScheduleMappingDto
} from "../signal-light-strategy/signal-light-strategy-type-strategy-schedule-mapping/dto";
import { SignalLightStrategyScheduleDto } from "../signal-light-strategy/signal-light-strategy-schedule/dto";
import {
  SignalLightStrategyScheduleStrategyParamMappingDto
} from "../signal-light-strategy/signal-light-strategy-schedule-strategy-param-mapping/dto";
import { SignalLightStrategyParamDto } from "../signal-light-strategy/signal-light-strategy-param/dto";
import { PrismaoService } from "../../../../prisma/prismao.service";
import { SignalLightRunParam, SignalLightRunParamDParam } from "./dto";
import { CalculateLightsInPolygonDto } from "../spatial-data/dto";

@Injectable()
export class DctsCoreService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly scheduleService: ScheduleService,
      private readonly wsService: WsService,
  ) {
    this.scheduleService.addScheduleFunc('sys:dcts:runCoreSchedule', this.runCoreSchedule.bind(this))
  }

  public async calculateLightsInPolygon(dto: CalculateLightsInPolygonDto, loginRole: string, userId: string) {
    const signalLightRunParams = await this.calculateLight();
    this.wsService.sendMsg(loginRole, userId, 'dcts:spatialData:calculateLightsInPolygon', JSON.stringify(signalLightRunParams))
  }

  /**
   * 计算信号灯
   * @private
   */
  private async calculateLight() {
    const start = performance.now();
    const defaultSelArg = this.prismao.defaultSelArg();
    // 查询信号灯组下的子信号灯、策略类型、策略调度、策略参数
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
    const allSignalLightRunParam: SignalLightRunParam[] = []
    for (const allSignalLightGroup of allSignalLightGroups) {
      // 查询所有子信号灯下的策略调度、策略参数
      // 该信号灯组下的子信号灯
      const lights = allSignalLights.filter(light => {
        return _signalLightGroup_signalLight.some(item => item.groupId === allSignalLightGroup.id && item.childLightId === light.id)
      })
      const lightIds = lights.map(item => item.id)
      // 该信号灯组下的策略类型
      const strategyTypes = allStrategyTypes.filter(type => {
        return _signalLightGroup_strategyType.some(item => item.groupId === allSignalLightGroup.id && item.strategyTypeId === type.id)
      })
      const strategyTypeIds = strategyTypes.map(item => item.id)
      // 该子信号灯且该策略类型下的策略调度
      const strategySchedules = allStrategySchedules.filter(schedule => {
        return _signalLight_strategySchedule.some(item => lightIds.includes(item.childLightId) && item.strategyScheduleId === schedule.id)
            && _strategyType_strategySchedule.some(item => strategyTypeIds.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds = strategySchedules.map(item => item.id)
      // 该策略调度下的策略参数
      const strategyParams = allStrategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
      })
      const strategyParamIds = strategyParams.map(item => item.id)

      // 开始计算每秒钟每种灯的状态
      const now0 = Math.floor(Date.now() / 1000) * 1000

      // 策略类型为固定策略的
      const strategyTypes_custom = strategyTypes.filter(item => item.strategyType === SLSTTTypeEnum.T_CUSTOM)
      const strategyTypeIds_custom = strategyTypes_custom.map(item => item.id)
      // 这些策略类型下的策略调度
      const strategySchedules_custom = strategySchedules.filter(schedule => {
        return _strategyType_strategySchedule.some(item => strategyTypeIds_custom.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds_custom = strategySchedules_custom.map(item => item.id)

      // 根据策略调度，计算时间段及偏移量

      // [strategyScheduleId, startTime, endTime][]
      const modifiedStartEndTime: [number, number, number][] = []
      for (const schedule_custom of strategySchedules_custom) {
        let startDate = new Date(0).getTime()
        let endDate = new Date(0).getTime()
        if (schedule_custom.scheduleType === SLSSTTypeEnum.T_DAY) {
          startDate = new Date(schedule_custom.startTime).getTime()
          endDate = new Date(schedule_custom.endTime).getTime()
          if (startDate < now0 && endDate < now0) {
            const addDay = Math.ceil((now0 - endDate) / (1000 * 60 * 60 * 24))
            startDate += addDay * 1000 * 60 * 60 * 24
            endDate += addDay * 1000 * 60 * 60 * 24
          } else if (startDate > now0 && endDate > now0) {
            const subDay = Math.ceil((startDate - now0) / (1000 * 60 * 60 * 24))
            startDate -= subDay * 1000 * 60 * 60 * 24
            endDate -= subDay * 1000 * 60 * 60 * 24
          }
        }
        modifiedStartEndTime.push([schedule_custom.id, startDate, endDate])
      }

      // 策略执行偏移量 [offsetNum]
      const offsetsByScheduleId: number[] = []
      for (let i = 0; i < strategyScheduleIds_custom.length; i++) {
        if (i === 0) {
          offsetsByScheduleId.push(0)
          continue
        }
        // 第n(从0开始)个的偏移时间 = 第n个的红灯时长
        // 第n个的策略参数
        const asps = allStrategyParams.filter(param => {
          return _strategySchedule_strategyParam.some(item => item.strategyScheduleId === strategyScheduleIds_custom[i] && item.strategyParamId === param.id)
        });
        if (asps.length === 0) {
          offsetsByScheduleId.push(0)
          continue
        }
        offsetsByScheduleId.push(asps[0].redDuration)
      }

      for (const light of lights) {
        // 查询当前子信号灯下的策略调度、策略参数
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

        const signalLightRunParam = new SignalLightRunParam();
        signalLightRunParam.signalLightGroupId = allSignalLightGroup.id
        signalLightRunParam.signalLightChildId = light.id
        signalLightRunParam.runParam = []

        if (relation.length === 0) {
          continue
        }

        // for (const rel of relation)
        const rel = relation[0]
        const index = strategyScheduleIds.indexOf(rel[1].id);
        const offset = offsetsByScheduleId[index];
        const redDuration = rel[2].redDuration;
        const greenDuration = rel[2].greenDuration;
        const yellowDuration = rel[2].yellowDuration;
        const allDuration = redDuration + greenDuration + yellowDuration;
        let start0 = new Date(rel[1].startTime).getTime()
        let end0 = new Date(rel[1].endTime).getTime()
        const find = modifiedStartEndTime.find(m => m[0] === rel[1].id);
        if (find) {
          start0 = find[1]
          end0 = find[2]
        }
        const count = Math.ceil((end0 - start0) / (allDuration * 1000))
        const _i = Math.max(Math.floor((now0 - start0) / (allDuration * 1000)) - 1, 0);
        for (let i = _i; i < count; i++) {
          const _offset = 3 + offset
          const redStart = allDuration * i + _offset
          const greenStart = allDuration * i + _offset + redDuration
          const yellowStart = allDuration * i + _offset + redDuration + greenDuration
          const dParamR = new SignalLightRunParamDParam();
          dParamR.color = 'red'
          dParamR.start = start0 + redStart * 1000
          dParamR.end = start0 + (redStart + redDuration) * 1000
          const dParamG = new SignalLightRunParamDParam();
          dParamG.color = 'green'
          dParamG.start = start0 + greenStart * 1000
          dParamG.end = start0 + (greenStart + greenDuration) * 1000
          const dParamY = new SignalLightRunParamDParam();
          dParamY.color = 'yellow'
          dParamY.start = start0 + yellowStart * 1000
          dParamY.end = start0 + (yellowStart + yellowDuration) * 1000
          signalLightRunParam.runParam.push(dParamR, dParamG, dParamY)
        }

        allSignalLightRunParam.push(signalLightRunParam)
      }
    }

    const end = performance.now();
    const t1 = Math.round(start2 - start);
    const t2 = Math.round(end - start2);
    // console.info(`calculateLight查询所需时间 ${t1} ms，计算所需时间 ${t2} ms，共 ${t1 + t2} ms。`)

    return allSignalLightRunParam
  }

  private async runCoreSchedule() {
    return true
  }
}

/**
 * 如果一个时间段的起始时间和结束时间不是同一天，就分成两个在同一天的时间段
 * @param start
 * @param end
 */
function splitIntervalByDay(start: Date, end: Date): [string, string][] {
  if (start.getDay() !== end.getDay()) {
    return [
      ['00:00:00', timeUtils.formatDate(end, 'HH:mm:ss')],
      [timeUtils.formatDate(start, 'HH:mm:ss'), '23:59:59']
    ]
  } else {
    return [
      [timeUtils.formatDate(start, 'HH:mm:ss'), timeUtils.formatDate(end, 'HH:mm:ss')]
    ]
  }
}
