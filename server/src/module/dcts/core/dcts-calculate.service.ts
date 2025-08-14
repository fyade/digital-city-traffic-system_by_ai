import { Injectable } from '@nestjs/common';
import { arrayUtils, base, baseUtils, timeUtils } from "@dcts/common";
import { SignalLightGroupInfoDto } from "../signal-light/signal-light-group-info/dto";
import { SignalLightGroupChildMappingDto } from "../signal-light/signal-light-group-child-mapping/dto";
import { SignalLightInfoDto } from "../signal-light/signal-light-info/dto";
import {
  SignalLightGroupStrategyTypeMappingDto
} from "../signal-light-strategy/signal-light-group-strategy-type-mapping/dto";
import { final } from "../../../util/base";
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
import { SignalLightRunParam, SignalLightRunParamDParam } from "./dto";
import { dashboardConfig } from "@dcts/config";
import { PrismaoService } from "../../../infra/prisma/prismao.service";
import { PostgresqlPrismaoService } from "../../../infra/prisma/postgresql.prismao.service";

@Injectable()
export class DctsCalculateService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {
  }

  /**
   * 计算信号灯
   * @param signalLightGroupIds
   * @param timeRange
   */
  public async calculateLight(signalLightGroupIds: number[], timeRange: [number, number] | null) {
    const start = performance.now();
    const defaultSelArg = this.prismao.defaultSelArg();
    const allSignalLightGroups = (await this.pgsqlPrismao.signal_light_group_info.findMany({
      where: {
        id: {
          in: signalLightGroupIds
        },
        ...defaultSelArg.where
      }
    })).map(baseUtils.objToCamelCase<SignalLightGroupInfoDto>)
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
    let now0 = Math.floor(Date.now() / 1000) * 1000
    let now01 = now0 - 1000 * 60 * dashboardConfig.LONG_TASK_INTERVAL * 3;
    let now02 = now0 + 1000 * 60 * dashboardConfig.LONG_TASK_INTERVAL * 3;
    if (timeRange) {
      now0 = timeRange[0]
      now01 = timeRange[0]
      now02 = timeRange[1]
    }

    // 策略类型-策略调度-策略参数 关系 [strategyTypeId, strategyScheduleId, strategyParamId][]
    const relation: [number, number, number][] = []
    // 策略类型-一个周期时长（ms） [strategyTypeId, duration][]
    const strategyTypeIdDuration: [number, number][] = []
    // 策略类型-开始时间-结束时间 [strategyTypeId, startTime, endTime][]
    const modifiedStartEndTime: [number, number, number][] = []

    for (const strategyType of allStrategyTypes) {
      const strategyScheduleIdsOfThisType = _strategyType_strategySchedule.filter(item => item.strategyTypeId === strategyType.id).map(item => item.strategyScheduleId);
      const strategySchedules = allStrategySchedules.filter(schedule => strategyScheduleIdsOfThisType.includes(schedule.id));
      const strategyParamIdsOfThisType = _strategySchedule_strategyParam.filter(item => strategyScheduleIdsOfThisType.includes(item.strategyScheduleId)).map(item => item.strategyParamId);
      const strategyParams = allStrategyParams.filter(param => strategyParamIdsOfThisType.includes(param.id))

      for (const strategySchedule of strategySchedules) {
        const strategyParamIdsOfThisSchedule = _strategySchedule_strategyParam.filter(item => item.strategyScheduleId === strategySchedule.id).map(item => item.strategyParamId);
        const strategyParams = allStrategyParams.filter(param => strategyParamIdsOfThisSchedule.includes(param.id));
        for (const strategyParam of strategyParams) {
          relation.push([strategyType.id, strategySchedule.id, strategyParam.id])
        }
      }

      let duration = 0
      const rounds = arrayUtils.arrNoRepeat(strategyParams.map(item => item.round)).sort((a, b) => a - b);
      for (const round of rounds) {
        const f = strategyParams.filter(param => param.round === round);
        const d = f.map(item => item.duration).sort((a, b) => b - a)[0];
        duration += d * 1000
      }
      if (strategyType.strategyType === base.SLSTTTypeEnum.T_CUSTOM || strategyType.strategyType === base.SLSTTTypeEnum.T_TOP) {
        strategyTypeIdDuration.push([strategyType.id, duration])
      }

      let startDate = new Date(strategyType.startTime);
      let endDate = new Date(strategyType.endTime);
      let start = startDate.getTime()
      let end = endDate.getTime()
      switch (strategyType.scheduleType) {
        case base.SLSSTTypeEnum.T_DAY:
          if (start < now0 && end < now0) {
            const addDay = Math.ceil((now0 - end) / (1000 * 60 * 60 * 24))
            start += addDay * 1000 * 60 * 60 * 24
            end += addDay * 1000 * 60 * 60 * 24
          } else if (start > now0 && end > now0) {
            const subDay = Math.ceil((start - now0) / (1000 * 60 * 60 * 24))
            start -= subDay * 1000 * 60 * 60 * 24
            end -= subDay * 1000 * 60 * 60 * 24
          }
          break
        case base.SLSSTTypeEnum.T_WEEK:
          if (start < now0 && end < now0) {
            const addWeek = Math.ceil((now0 - end) / (1000 * 60 * 60 * 24 * 7))
            start += addWeek * 1000 * 60 * 60 * 24 * 7
            end += addWeek * 1000 * 60 * 60 * 24 * 7
          } else if (start > now0 && end > now0) {
            const subWeek = Math.ceil((start - now0) / (1000 * 60 * 60 * 24 * 7))
            start -= subWeek * 1000 * 60 * 60 * 24 * 7
            end -= subWeek * 1000 * 60 * 60 * 24 * 7
          }
          break
        case base.SLSSTTypeEnum.T_MONTH:
          if (start < now0 && end < now0) {
            do {
              const s1 = timeUtils.formatDate(startDate)
              let year1 = startDate.getFullYear()
              let month1 = startDate.getMonth() + 1 + 1
              if (month1 > 12) {
                year1++
                month1 = month1 % 12
              }
              const ss1 = `${year1}-${month1}` + s1.substring(7, s1.length)
              startDate = new Date(ss1)
              start = startDate.getTime()
              const s2 = timeUtils.formatDate(endDate)
              let year2 = endDate.getFullYear()
              let month2 = endDate.getMonth() + 1 + 1
              if (month2 > 12) {
                year2++
                month2 = month2 % 12
              }
              const ss2 = `${year2}-${month2}` + s2.substring(7, s2.length)
              endDate = new Date(ss2)
              end = endDate.getTime()
            } while (end <= now0)
          } else if (start > now0 && end > now0) {
            do {
              const s1 = timeUtils.formatDate(startDate)
              let year1 = startDate.getFullYear()
              let month1 = startDate.getMonth() - 1 + 1
              if (month1 <= 0) {
                year1--
                month1 += 12
              }
              const ss1 = `${year1}-${month1}` + s1.substring(7, s1.length)
              startDate = new Date(ss1)
              start = startDate.getTime()
              const s2 = timeUtils.formatDate(endDate)
              let year2 = endDate.getFullYear()
              let month2 = endDate.getMonth() - 1 + 1
              if (month2 <= 0) {
                year2--
                month2 += 12
              }
              const ss2 = `${year2}-${month2}` + s2.substring(7, s2.length)
              endDate = new Date(ss2)
              end = endDate.getTime()
            } while (start > now0)
          }
          break
        case base.SLSSTTypeEnum.T_YEAR:
          if (start < now0 && end < now0) {
            do {
              const s1 = timeUtils.formatDate(startDate);
              const ss1 = `${startDate.getFullYear() + 1}` + s1.substring(4, s1.length)
              startDate = new Date(ss1)
              start = startDate.getTime()
              const s2 = timeUtils.formatDate(endDate)
              const ss2 = `${endDate.getFullYear() + 1}` + s2.substring(4, s2.length)
              endDate = new Date(ss2)
              end = endDate.getTime()
            } while (end <= now0)
          } else if (start > now0 && end > now0) {
            do {
              const s1 = timeUtils.formatDate(startDate);
              const ss1 = `${startDate.getFullYear() - 1}` + s1.substring(4, s1.length)
              startDate = new Date(ss1)
              start = startDate.getTime()
              const s2 = timeUtils.formatDate(endDate)
              const ss2 = `${endDate.getFullYear() - 1}` + s2.substring(4, s2.length)
              endDate = new Date(ss2)
              end = endDate.getTime()
            } while (start > now0)
          }
          break
      }
      modifiedStartEndTime.push([strategyType.id, start, end])
    }

    for (const signalLightGroup of allSignalLightGroups) {
      const lights = allSignalLights.filter(light => {
        return _signalLightGroup_signalLight.some(item => item.groupId === signalLightGroup.id && item.childLightId === light.id)
      })
      const lightIds = lights.map(item => item.id)
      const strategyTypes = allStrategyTypes.filter(type => {
        return _signalLightGroup_strategyType.some(item => item.groupId === signalLightGroup.id && item.strategyTypeId === type.id)
      })
      const strategyTypeIds = strategyTypes.map(item => item.id)
      const strategySchedules = allStrategySchedules.filter(schedule => {
        return _signalLight_strategySchedule.some(item => lightIds.includes(item.childLightId) && item.strategyScheduleId === schedule.id)
            && _strategyType_strategySchedule.some(item => strategyTypeIds.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds = strategySchedules.map(item => item.id)
      const strategyParams = allStrategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
      })
      const strategyParamIds = strategyParams.map(item => item.id)
      if (lights.length === 0 || strategyTypes.length === 0 || strategySchedules.length === 0 || strategyParams.length === 0) {
        continue
      }

      // 策略类型为固定策略或紧急策略的
      const strategyTypes_ct = strategyTypes.filter(item => item.strategyType === base.SLSTTTypeEnum.T_CUSTOM || item.strategyType === base.SLSTTTypeEnum.T_TOP)
      const strategyTypeIds_ct = strategyTypes_ct.map(item => item.id)
      const strategySchedules_ct = strategySchedules.filter(schedule => {
        return _strategyType_strategySchedule.some(item => strategyTypeIds_ct.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds_ct = strategySchedules_ct.map(item => item.id)
      const strategyParams_ct = strategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds_ct.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
      })
      const strategyParamIds_ct = strategyParams_ct.map(item => item.id)

      const strategyTypes_t = strategyTypes_ct.filter(type => type.strategyType === base.SLSTTTypeEnum.T_TOP)
      const strategyTypes_mset = strategyTypes_t.map(item => modifiedStartEndTime.find(m => m[0] === item.id));
      const minStartTimeOfT = strategyTypes_mset.length > 0 ? Math.min(...strategyTypes_mset.map(item => item[1])) : 0
      const maxEndTimeOfT = strategyTypes_mset.length > 0 ? Math.max(...strategyTypes_mset.map(item => item[2])) : 0

      // 策略类型为微调策略的
      const strategyTypes_fineTuning = strategyTypes.filter(item => item.strategyType === base.SLSTTTypeEnum.T_FINE_TUNING)
      const strategyTypeIds_fineTuning = strategyTypes_fineTuning.map(item => item.id)
      const strategySchedules_fineTuning = strategySchedules.filter(schedule => {
        return _strategyType_strategySchedule.some(item => strategyTypeIds_fineTuning.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
      })
      const strategyScheduleIds_fineTuning = strategySchedules_fineTuning.map(item => item.id)
      const strategyParams_fineTuning = strategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds_fineTuning.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
      })
      const strategyParamIds_fineTuning = strategyParams_fineTuning.map(item => item.id)

      // 处于当前时段的
      const strategyTypes_ct_now = strategyTypes_ct.filter(type => {
        const find = modifiedStartEndTime.find(item => item[0] === type.id);
        return arrayUtils.ifHasOverlap([now01, now02], [find[1], find[2]])
      }).sort((a, b) => {
        if (a.strategyType === base.SLSTTTypeEnum.T_TOP && b.strategyType !== base.SLSTTTypeEnum.T_TOP) {
          return -1
        }
        if (a.strategyType !== base.SLSTTTypeEnum.T_TOP && b.strategyType === base.SLSTTTypeEnum.T_TOP) {
          return 1
        }
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      })
      if (strategyTypes_ct_now.length === 0) {
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
      let _lastIfT = false
      for (let i = 0; i < strategyTypes_ct_now.length; i++) {
        const st0 = strategyTypes_ct_now[i]
        const ifCustom = st0.strategyType === base.SLSTTTypeEnum.T_CUSTOM;
        const ifTop = st0.strategyType === base.SLSTTTypeEnum.T_TOP;

        const ss0 = strategySchedules_ct.filter(schedule => {
          return _strategyType_strategySchedule.some(item => item.strategyTypeId === st0.id && item.strategyScheduleId === schedule.id)
        })
        const ssId0 = ss0.map(item => item.id)
        const sp0 = strategyParams_ct.filter(param => {
          return _strategySchedule_strategyParam.some(item => ssId0.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
        })
        const spId0 = sp0.map(item => item.id)

        const mseTime = modifiedStartEndTime.find(arr => arr[0] === st0.id);
        const stD = strategyTypeIdDuration.find(arr => arr[0] === st0.id);

        const _startt = (i > 0 && !_lastIfT) ? _startTimes[i - 1] : mseTime[1];
        const _endt = Math.min(mseTime[2], now02);
        _startTimes.push(_endt)

        let fineTuningTime = 0
        let ifCalculateEnd = false
        let i2 = 0
        const i3 = Math.max(0, Math.floor((now0 - _startt) / stD[1]))
        do {
          const start1 = _startt + stD[1] * i2
          let _duration = 0
          const rounds = arrayUtils.arrNoRepeat(sp0.map(item => item.round)).sort((a, b) => a - b);
          for (const round of rounds) {
            const spr = sp0.filter(item => item.round === round);
            const duration = spr.map(item => item.duration).sort((a, b) => b - a)[0];
            let _start = start1 + _duration + fineTuningTime
            _duration += duration * 1000
            const __end = start1 + _duration + fineTuningTime
            const ifWillEnd = mseTime[2] < __end
            const _end = ifWillEnd ? mseTime[2] : __end
            if (_start > _end) {
              continue
            }
            const stids_ft = strategyTypeIds_fineTuning.filter(id => {
              const find = modifiedStartEndTime.find(ar => ar[0] === id);
              return arrayUtils.ifHasOverlap([_start, _end], [find[1], find[2]])
            });
            const sss_ft = strategySchedules.filter(schedule => {
              return _strategyType_strategySchedule.some(item => stids_ft.includes(item.strategyTypeId) && item.strategyScheduleId === schedule.id)
            });
            const ssids_ft = sss_ft.map(item => item.id)
            const sps_ft = strategyParams.filter(param => {
              return _strategySchedule_strategyParam.some(item => ssids_ft.includes(item.strategyScheduleId) && item.strategyParamId === param.id)
            })
            const spids_ft = sps_ft.map(item => item.id)
            const durationPlusFtTime: number[] = []
            for (const sp of spr) {
              const sps_ft_1 = sps_ft.filter(param => {
                return round === param.round
                    && sp.currentLight === param.currentLight
                    && arrayUtils.ifSameArray(sp.lightType.split('-').filter(_ => _), param.lightType.split('-').filter(_ => _))
              });
              const ft_time = sps_ft_1.reduce((a, b) => a + b.duration, 0) * 1000;
              durationPlusFtTime.push(ft_time + sp.duration * 1000)

              let _end2 = _end + ft_time
              if (sp.duration * 1000 < duration * 1000) {
                _end2 = Math.max(_start, _end2 - (duration - sp.duration) * 1000)
              }

              if (!ifTop && strategyTypes_mset.length > 0) {
                if (arrayUtils.ifArr1InArr2([_start, _end2], [minStartTimeOfT, maxEndTimeOfT])) {
                  continue
                } else if (_start < minStartTimeOfT && minStartTimeOfT < _end2) {
                  _end2 = minStartTimeOfT
                } else if (_start < maxEndTimeOfT && maxEndTimeOfT < _end2) {
                  _start = maxEndTimeOfT
                }
              }

              if (_end2 < now0) {
                continue
              }

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
                  const __end = _end2 - 3 * 1000
                  const dParam = new SignalLightRunParamDParam(
                      _start,
                      __end,
                      base.SignalLightColorEnum.GREEN,
                      sp.lightType.split('-').filter(_ => _) as base.SLSPLTTypeEnum[]
                  );
                  const dParam2 = new SignalLightRunParamDParam(
                      __end,
                      _end2,
                      base.SignalLightColorEnum.YELLOW,
                      sp.lightType.split('-').filter(_ => _) as base.SLSPLTTypeEnum[]
                  );
                  param2.runParam.push(dParam, dParam2)
                } else {
                  const dParam = new SignalLightRunParamDParam(
                      _start,
                      _end2,
                      sp.currentLight as base.SignalLightColorEnum,
                      sp.lightType.split('-').filter(_ => _) as base.SLSPLTTypeEnum[]
                  );
                  param2.runParam.push(dParam)
                }
              }
            }

            const d = Math.max(...durationPlusFtTime) - duration * 1000
            if (!ifTop) {
              fineTuningTime += d
            }

            if (_end + Math.min(...durationPlusFtTime) >= now02 || ifWillEnd) {
              ifCalculateEnd = true
            }
          }
          i2++
          if (start1 > now02) {
            ifCalculateEnd = true
          }
        } while (!ifCalculateEnd)
        _lastIfT = ifTop
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
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      for (let i = signalLightRunParam.runParam.length - 2; i >= 0; i--) {
        if (
            signalLightRunParam.runParam[i].end < signalLightRunParam.runParam[i + 1].start
            && signalLightRunParam.runParam[i + 1].end - signalLightRunParam.runParam[i].end > 3 * 1000
            && signalLightRunParam.runParam[i].color === base.SignalLightColorEnum.GREEN
            && signalLightRunParam.runParam[i + 1].color === base.SignalLightColorEnum.YELLOW
            && arrayUtils.ifSameArray(signalLightRunParam.runParam[i].lightType, signalLightRunParam.runParam[i + 1].lightType)
        ) {
          const t0 = signalLightRunParam.runParam[i].end
          const t1 = signalLightRunParam.runParam[i].end + 3 * 1000
          const t2 = signalLightRunParam.runParam[i + 1].end
          const dParam1 = new SignalLightRunParamDParam(
              t0,
              t1,
              base.SignalLightColorEnum.YELLOW,
              signalLightRunParam.runParam[i + 1].lightType
          );
          const dParam2 = new SignalLightRunParamDParam(
              t1,
              t2,
              base.SignalLightColorEnum.RED,
              [base.SLSPLTTypeEnum.AROUND, base.SLSPLTTypeEnum.LEFT, base.SLSPLTTypeEnum.STRAIGHT, base.SLSPLTTypeEnum.RIGHT]
          );
          signalLightRunParam.runParam[i + 1] = dParam1
          signalLightRunParam.runParam.push(dParam2)
        } else if (
            signalLightRunParam.runParam[i].end < signalLightRunParam.runParam[i + 1].start
        ) {
          const dParam1 = new SignalLightRunParamDParam(
              signalLightRunParam.runParam[i].end,
              signalLightRunParam.runParam[i + 1].start,
              base.SignalLightColorEnum.RED,
              [base.SLSPLTTypeEnum.AROUND, base.SLSPLTTypeEnum.LEFT, base.SLSPLTTypeEnum.STRAIGHT, base.SLSPLTTypeEnum.RIGHT]
          );
          signalLightRunParam.runParam.push(dParam1)
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      for (let i = signalLightRunParam.runParam.length - 2; i >= 0; i--) {
        if (
            signalLightRunParam.runParam[i].color === base.SignalLightColorEnum.GREEN
            && signalLightRunParam.runParam[i + 1].color !== base.SignalLightColorEnum.YELLOW
            && !arrayUtils.ifSameArray(signalLightRunParam.runParam[i].lightType, signalLightRunParam.runParam[i + 1].lightType)
        ) {
          if (
              signalLightRunParam.runParam[i].end - signalLightRunParam.runParam[i].start <= 3000
          ) {
            signalLightRunParam.runParam[i].color = base.SignalLightColorEnum.RED
            signalLightRunParam.runParam[i].lightType = [base.SLSPLTTypeEnum.AROUND, base.SLSPLTTypeEnum.LEFT, base.SLSPLTTypeEnum.STRAIGHT, base.SLSPLTTypeEnum.RIGHT]
          } else {
            signalLightRunParam.runParam[i].end = signalLightRunParam.runParam[i].end - 3000
            const dParam3 = new SignalLightRunParamDParam(
                signalLightRunParam.runParam[i].end,
                signalLightRunParam.runParam[i].end + 3000,
                base.SignalLightColorEnum.YELLOW,
                signalLightRunParam.runParam[i].lightType
            );
            signalLightRunParam.runParam.push(dParam3)
          }
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      for (let i = signalLightRunParam.runParam.length - 3; i >= 0; i--) {
        if (
            signalLightRunParam.runParam[i].color === base.SignalLightColorEnum.GREEN
            && signalLightRunParam.runParam[i + 1].color === base.SignalLightColorEnum.YELLOW
            && signalLightRunParam.runParam[i + 2].color === base.SignalLightColorEnum.GREEN
            && signalLightRunParam.runParam[i].end === signalLightRunParam.runParam[i + 1].start
            && signalLightRunParam.runParam[i + 1].end === signalLightRunParam.runParam[i + 2].start
            && arrayUtils.ifSameArray(signalLightRunParam.runParam[i].lightType, signalLightRunParam.runParam[i + 1].lightType)
            && arrayUtils.ifSameArray(signalLightRunParam.runParam[i + 1].lightType, signalLightRunParam.runParam[i + 2].lightType)
        ) {
          signalLightRunParam.runParam[i].end = signalLightRunParam.runParam[i + 2].end
          signalLightRunParam.runParam.splice(i + 1, 2)
        } else if (
            (
                signalLightRunParam.runParam[i].color === base.SignalLightColorEnum.RED
                && signalLightRunParam.runParam[i + 1].color === base.SignalLightColorEnum.YELLOW
                && signalLightRunParam.runParam[i + 2].color === base.SignalLightColorEnum.RED
            )
            || (
                signalLightRunParam.runParam[i].color === base.SignalLightColorEnum.RED
                && signalLightRunParam.runParam[i + 1].color === base.SignalLightColorEnum.YELLOW
                && signalLightRunParam.runParam[i + 2].color === base.SignalLightColorEnum.GREEN
                && !arrayUtils.ifSameArray(signalLightRunParam.runParam[i + 1].lightType, signalLightRunParam.runParam[i + 2].lightType)
            )
        ) {
          signalLightRunParam.runParam[i + 1].color = base.SignalLightColorEnum.RED
          signalLightRunParam.runParam[i + 1].lightType = [base.SLSPLTTypeEnum.AROUND, base.SLSPLTTypeEnum.LEFT, base.SLSPLTTypeEnum.STRAIGHT, base.SLSPLTTypeEnum.RIGHT]
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
      for (let i = signalLightRunParam.runParam.length - 2; i >= 0; i--) {
        if (
            signalLightRunParam.runParam[i].color === signalLightRunParam.runParam[i + 1].color
            && arrayUtils.ifSameArray(signalLightRunParam.runParam[i].lightType, signalLightRunParam.runParam[i + 1].lightType)
        ) {
          signalLightRunParam.runParam[i].end = signalLightRunParam.runParam[i + 1].end
          signalLightRunParam.runParam.splice(i + 1, 1)
        }
      }
      signalLightRunParam.runParam.sort((a, b) => a.start - b.start)
    }

    const end = performance.now();
    const t1 = Math.round(start2 - start);
    const t2 = Math.round(end - start2);
    console.info(`calculateLight查询所需时间 ${t1} ms，计算所需时间 ${t2} ms，共 ${t1 + t2} ms。`)

    return allSignalLightRunParam
  }
}
