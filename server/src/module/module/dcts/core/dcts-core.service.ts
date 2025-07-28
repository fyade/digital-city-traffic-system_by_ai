import { Injectable } from '@nestjs/common';
import { ScheduleService } from "../../../schedule/schedule.service";
import { WsService } from "../../../ws/ws.service";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";
import { final } from "../../../../util/base";
import { base, baseUtils, objectUtils, timeUtils } from "@dcts/common";
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
import { dashboardConfig } from "@dcts/config";

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
        if_disabled: final.N,
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
        if_disabled: final.N,
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
        if_disabled: final.N,
        ...defaultSelArg.where
      },
      orderBy: [
        {order_num: 'asc'},
        {create_time: 'desc'}
      ]
    })).map(baseUtils.objToCamelCase<SignalLightStrategyParamDto>)

    // 开始计算每秒钟每种灯的状态
    const start2 = performance.now();

    const allSignalLightRunParam: SignalLightRunParam[] = []
    const now0 = Math.floor(Date.now() / 1000) * 1000

    // 策略类型-策略调度-策略参数 关系 [strategyType, strategySchedule, strategyParam][]
    const relation: [SignalLightStrategyTypeDto, SignalLightStrategyScheduleDto, SignalLightStrategyParamDto][] = []
    // 策略类型-一个周期时长（ms） [strategyTypeId, duration][]
    const strategyTypeIdDuration: [number, number][] = []
    // 策略类型-开始时间-结束时间 [strategyTypeId, startTime, endTime][]
    const modifiedStartEndTime: [number, number, number][] = []

    for (const strategyType of allStrategyTypes) {
      const strategyScheduleIdsOfThisType = _strategyType_strategySchedule.filter(item => item.strategyTypeId === strategyType.id).map(item => item.strategyScheduleId);
      const strategySchedules = allStrategySchedules.filter(schedule => strategyScheduleIdsOfThisType.includes(schedule.id));
      let duration = 0
      for (const strategySchedule of strategySchedules) {
        const strategyParamIdsOfThisSchedule = _strategySchedule_strategyParam.filter(item => item.strategyScheduleId === strategySchedule.id).map(item => item.strategyParamId);
        const strategyParams = allStrategyParams.filter(param => strategyParamIdsOfThisSchedule.includes(param.id));
        for (const strategyParam of strategyParams) {
          relation.push([strategyType, strategySchedule, strategyParam])
        }
        const rounds = objectUtils.arrNoRepeat(strategyParams.map(item => item.round)).sort((a, b) => a - b);
        for (const round of rounds) {
          const f = strategyParams.filter(param => param.round === round);
          const d = f.map(item => item.duration).sort((a, b) => b - a)[0];
          duration += d * 1000
        }
      }
      strategyTypeIdDuration.push([strategyType.id, duration])

      let start = new Date(0).getTime()
      let end = new Date(0).getTime()
      if (strategyType.scheduleType === base.SLSSTTypeEnum.T_DAY) {
        start = new Date(strategyType.startTime).getTime()
        end = new Date(strategyType.endTime).getTime()
        if (start < now0 && end < now0) {
          const addDay = Math.ceil((now0 - end) / (1000 * 60 * 60 * 24))
          start += addDay * 1000 * 60 * 60 * 24
          end += addDay * 1000 * 60 * 60 * 24
        } else if (start > now0 && end > now0) {
          const subDay = Math.ceil((start - now0) / (1000 * 60 * 60 * 24))
          start -= subDay * 1000 * 60 * 60 * 24
          end -= subDay * 1000 * 60 * 60 * 24
        }
      }
      modifiedStartEndTime.push([strategyType.id, start, end])
    }

    for (const signalLightGroup of allSignalLightGroups) {
      // 查询所有子信号灯下的策略调度、策略参数
      // 该信号灯组下的子信号灯
      const lights = allSignalLights.filter(light => {
        return _signalLightGroup_signalLight.some(item => item.groupId === signalLightGroup.id && item.childLightId === light.id)
      })
      const lightIds = lights.map(item => item.id)
      // 该信号灯组下的策略类型
      const strategyTypes = allStrategyTypes.filter(type => {
        return _signalLightGroup_strategyType.some(item => item.groupId === signalLightGroup.id && item.strategyTypeId === type.id)
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

      if (lights.length === 0 || strategyTypes.length === 0 || strategySchedules.length === 0 || strategyParams.length === 0) {
        continue
      }

      // 策略类型为固定策略的
      const strategyTypes_custom = strategyTypes.filter(item => item.strategyType === base.SLSTTTypeEnum.T_CUSTOM)
      const strategyTypeIds_custom = strategyTypes_custom.map(item => item.id)
      // 这些策略类型下的策略调度
      const strategySchedules_custom = strategySchedules.filter(schedule => {
        return _strategyType_strategySchedule.some(item => strategyTypeIds_custom.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds_custom = strategySchedules_custom.map(item => item.id)
      // 这些策略调度下的策略参数
      const strategyParams_custom = strategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds_custom.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
      })
      const strategyParamIds_custom = strategyParams_custom.map(item => item.id)

      // 在此基础上，处于当前时段的
      const strategyTypes_custom_now = strategyTypes_custom.filter(type => {
        const find = modifiedStartEndTime.find(item => item[0] === type.id);
        if (!find) {
          return false
        }
        return find[1] <= now0
      }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      if (strategyTypes_custom_now.length === 0) {
        continue
      }

      const signalLightRunParams = new Map<number, SignalLightRunParam>()
      for (const light of lights) {
        const param1 = new SignalLightRunParam();
        param1.signalLightGroupId = signalLightGroup.id
        param1.signalLightChildId = light.id
        param1.runParam = []
        signalLightRunParams.set(light.id, param1)
      }

      const _startTimes: number[] = []
      for (let i = 0; i < strategyTypes_custom_now.length; i++) {
        const st0 = strategyTypes_custom_now[i]
        // 这个策略类型下的策略调度
        const ss0 = strategySchedules_custom.filter(schedule => {
          return _strategyType_strategySchedule.some(item => item.strategyTypeId === st0.id && item.strategyScheduleId === schedule.id)
        })
        const ssId0 = ss0.map(item => item.id)
        // 这个策略调度下的策略参数
        const sp0 = strategyParams_custom.filter(param => {
          return _strategySchedule_strategyParam.some(item => ssId0.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
        })
        const spId0 = sp0.map(item => item.id)

        const mseTime = modifiedStartEndTime.find(arr => arr[0] === st0.id);
        const stD = strategyTypeIdDuration.find(arr => arr[0] === st0.id);
        if (!mseTime || !stD) {
          continue
        }

        const _startt = i > 0 ? _startTimes[i - 1] : mseTime[1];
        const _endt = Math.min(mseTime[2], now0 + 1000 * 60 * dashboardConfig.LONG_TASK_INTERVAL * 3);
        _startTimes.push(_endt)

        const count = Math.ceil((_endt - _startt) / stD[1]);
        const _i = Math.max(0, Math.floor((now0 - _startt) / stD[1]));
        for (let i2 = _i; i2 < count; i2++) {
          const start1 = _startt + stD[1] * i2
          let _duration = 0
          const rounds = objectUtils.arrNoRepeat(sp0.map(item => item.round)).sort((a, b) => a - b);
          for (const round of rounds) {
            const spf = sp0.filter(item => item.round === round);
            const duration = spf.map(item => item.duration).sort((a, b) => b - a)[0];
            const _start = start1 + _duration
            _duration += duration * 1000
            const ifWillEnd = mseTime[2] < (start1 + _duration)
            const _end = ifWillEnd ? mseTime[2] : (start1 + _duration)
            if (_start > _end) {
              continue
            }
            for (const sp of spf) {
              const ssf = ss0.filter(ss => {
                return _strategySchedule_strategyParam.some(item => item.strategyScheduleId === ss.id && sp.id === item.strategyParamId)
              });
              const ssfIds = ssf.map(item => item.id);
              const lf = lights.filter(light => {
                return _signalLight_strategySchedule.some(item => item.childLightId === light.id && ssfIds.includes(item.strategyScheduleId))
              });
              for (const l of lf) {
                const param2 = signalLightRunParams.get(l.id);
                if (ifWillEnd && sp.currentLight === base.SignalLightColorEnum.GREEN) {
                  const _end2 = _end - 3 * 1000
                  const dParam = new SignalLightRunParamDParam(
                      _start,
                      _end2,
                      base.SignalLightColorEnum.GREEN,
                      sp.lightType.split('-').filter(_ => _) as base.SLSPLTTypeEnum[]
                  );
                  const dParam2 = new SignalLightRunParamDParam(
                      _end2,
                      _end,
                      base.SignalLightColorEnum.YELLOW,
                      sp.lightType.split('-').filter(_ => _) as base.SLSPLTTypeEnum[]
                  );
                  param2.runParam.push(dParam, dParam2)
                } else {
                  const dParam = new SignalLightRunParamDParam(
                      _start,
                      _end,
                      sp.currentLight as base.SignalLightColorEnum,
                      sp.lightType.split('-').filter(_ => _) as base.SLSPLTTypeEnum[]
                  );
                  param2.runParam.push(dParam)
                }
              }
            }
          }
        }
      }

      for (const key of signalLightRunParams.keys()) {
        const param3 = signalLightRunParams.get(key);
        if (param3 && param3.runParam.length > 0) {
          allSignalLightRunParam.push(param3)
        }
      }
    }

    for (const signalLightRunParam of allSignalLightRunParam) {
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      if (signalLightRunParam.runParam[0].start > now0) {
        const dParam1 = new SignalLightRunParamDParam(
            now0,
            signalLightRunParam.runParam[0].start,
            base.SignalLightColorEnum.RED,
            [base.SLSPLTTypeEnum.AROUND, base.SLSPLTTypeEnum.LEFT, base.SLSPLTTypeEnum.STRAIGHT, base.SLSPLTTypeEnum.RIGHT]
        );
        signalLightRunParam.runParam.unshift(dParam1)
      }
      for (let i = signalLightRunParam.runParam.length - 1; i > 0; i--) {
        if (signalLightRunParam.runParam[i - 1].end < signalLightRunParam.runParam[i].start) {
          const dParam1 = new SignalLightRunParamDParam(
              signalLightRunParam.runParam[i - 1].end,
              signalLightRunParam.runParam[i].start,
              base.SignalLightColorEnum.RED,
              [base.SLSPLTTypeEnum.AROUND, base.SLSPLTTypeEnum.LEFT, base.SLSPLTTypeEnum.STRAIGHT, base.SLSPLTTypeEnum.RIGHT]
          );
          signalLightRunParam.runParam.push(dParam1)
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      for (let i = signalLightRunParam.runParam.length - 2; i >= 0; i--) {
        if (
            signalLightRunParam.runParam[i].color === signalLightRunParam.runParam[i + 1].color
            && objectUtils.ifSameArray(signalLightRunParam.runParam[i].lightType, signalLightRunParam.runParam[i + 1].lightType)
        ) {
          const dParam3 = new SignalLightRunParamDParam(
              signalLightRunParam.runParam[i].start,
              signalLightRunParam.runParam[i + 1].end,
              signalLightRunParam.runParam[i].color,
              signalLightRunParam.runParam[i].lightType
          );
          signalLightRunParam.runParam.push(dParam3)
          signalLightRunParam.runParam.splice(i, 2)
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      for (let i = signalLightRunParam.runParam.length - 3; i >= 0; i--) {
        if (
            signalLightRunParam.runParam[i].color === base.SignalLightColorEnum.GREEN
            && signalLightRunParam.runParam[i + 1].color === base.SignalLightColorEnum.YELLOW
            && signalLightRunParam.runParam[i + 2].color === base.SignalLightColorEnum.GREEN
            && objectUtils.ifSameArray(signalLightRunParam.runParam[i].lightType, signalLightRunParam.runParam[i + 1].lightType)
            && objectUtils.ifSameArray(signalLightRunParam.runParam[i + 1].lightType, signalLightRunParam.runParam[i + 2].lightType)
        ) {
          const dParam3 = new SignalLightRunParamDParam(
              signalLightRunParam.runParam[i].start,
              signalLightRunParam.runParam[i + 2].end,
              base.SignalLightColorEnum.GREEN,
              signalLightRunParam.runParam[i].lightType
          );
          signalLightRunParam.runParam.push(dParam3)
          signalLightRunParam.runParam.splice(i, 3)
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
    }

    const end = performance.now();
    const t1 = Math.round(start2 - start);
    const t2 = Math.round(end - start2);
    console.info(`calculateLight查询所需时间 ${t1} ms，计算所需时间 ${t2} ms，共 ${t1 + t2} ms。`)

    // 开发阶段临时用，生产环境记得删掉
    for (const slrp of allSignalLightRunParam) {
      for (const slrprp of slrp.runParam) {
        slrprp['startRndStr'] = [timeUtils.formatDate(new Date(slrprp.start)), timeUtils.formatDate(new Date(slrprp.end))]
        slrprp['startRndStr2'] = [new Date(slrprp.start), new Date(slrprp.end)]
      }
    }

    return allSignalLightRunParam
  }

  private async runCoreSchedule() {
    return true
  }
}
