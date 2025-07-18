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

  public async calculateLightsInPolygon(signalLightGroupIds: number[], loginRole: string, userId: string) {
    const signalLightRunParams = await this.calculateLight(signalLightGroupIds);
    this.wsService.sendMsg(loginRole, userId, 'dcts:spatialData:calculateLightsInPolygon', JSON.stringify(signalLightRunParams))
  }

  /**
   * 计算信号灯
   * @private
   */
  private async calculateLight(signalLightGroupIds: number[]) {
    const start = performance.now();
    const defaultSelArg = this.prismao.defaultSelArg();
    // 查询信号灯组下的子信号灯、策略类型、策略调度、策略参数
    // 查询所有信号灯组
    const allSignalLightGroups = (await this.pgsqlPrismao.signal_light_group_info.findMany({
      where: {
        id: {
          in: signalLightGroupIds
        },
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

      // 策略执行偏移量 [strategyScheduleId, startTime, endTime, offsetNum][]
      const offsetsByScheduleId: [number, number, number, number][] = []
      // 在每个时间段内
      // 第1个的偏移量=0
      // 第2个的偏移量=第2个的红灯时间
      // 第3个的偏移量=第3个的红灯时间
      // 第n个的偏移量=第n个的红灯时间
      // 先计算出一共有多少个时间段
      const allTimePoint = objectUtils.arrNoRepeat(modifiedStartEndTime.map(ar => [ar[1], ar[2]]).flat().sort());
      if (allTimePoint.length < 1) {
        continue
      }
      for (let i = 1; i < allTimePoint.length; i++) {
        const t1 = allTimePoint[i - 1]
        const t2 = allTimePoint[i]
        // 有几个调度在此时间段内
        const filter = modifiedStartEndTime.filter(ar => {
          const _n = (t1 + t2) / 2;
          return ar[1] <= _n && _n <= ar[2]
        });
        for (let j = 0; j < filter.length; j++) {
          const f = filter[j]
          let _offset = 0
          if (j > 0) {
            const asps = allStrategyParams.filter(param => {
              return _strategySchedule_strategyParam.some(item => item.strategyScheduleId === f[0] && item.strategyParamId === param.id)
            });
            _offset = asps.length === 0 ? 0 : asps[0].redDuration * 1000
          }
          offsetsByScheduleId.push([f[0], t1, t2, _offset])
        }
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

        const relation2 = relation.filter(r => {
          const find1 = modifiedStartEndTime.find(item => item[0] === r[1].id);
          if (!find1) {
            return false
          }
          return find1[1] <= now0 && now0 <= find1[2]
        })

        if (relation2.length === 0) {
          continue
        }

        const rel = relation2[0]
        const find2 = offsetsByScheduleId.find(item => {
          return item[0] === rel[1].id && item[1] <= now0 && now0 <= item[2]
        });
        const offset = find2 ? find2[3] : 0;
        const redDuration = rel[2].redDuration * 1000;
        const greenDuration = rel[2].greenDuration * 1000;
        const yellowDuration = rel[2].yellowDuration * 1000;
        const allDuration = redDuration + greenDuration + yellowDuration;
        let start0 = new Date(rel[1].startTime).getTime()
        let end0 = new Date(rel[1].endTime).getTime()
        const find = modifiedStartEndTime.find(m => m[0] === rel[1].id);
        if (find) {
          start0 = find[1]
          end0 = find[2]
        }
        const count = Math.ceil((end0 - start0) / allDuration)
        const _offset = 3000 + offset
        const _i = Math.floor((now0 - start0 - _offset) / allDuration);
        if (0 <= _i && _i < count) {
          for (let i = _i; i < count; i++) {
            const redStart = allDuration * i + _offset
            const greenStart = allDuration * i + _offset + redDuration
            const yellowStart = allDuration * i + _offset + redDuration + greenDuration
            const dParamR = new SignalLightRunParamDParam();
            dParamR.color = 'red'
            dParamR.start = start0 + redStart
            dParamR.end = start0 + redStart + redDuration
            const dParamG = new SignalLightRunParamDParam();
            dParamG.color = 'green'
            dParamG.start = start0 + greenStart
            dParamG.end = start0 + greenStart + greenDuration
            const dParamY = new SignalLightRunParamDParam();
            dParamY.color = 'yellow'
            dParamY.start = start0 + yellowStart
            dParamY.end = start0 + yellowStart + yellowDuration
            signalLightRunParam.runParam.push(dParamR, dParamG, dParamY)
          }
        }

        allSignalLightRunParam.push(signalLightRunParam)
      }
    }

    const end = performance.now();
    const t1 = Math.round(start2 - start);
    const t2 = Math.round(end - start2);
    console.info(`calculateLight查询所需时间 ${t1} ms，计算所需时间 ${t2} ms，共 ${t1 + t2} ms。`)

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
