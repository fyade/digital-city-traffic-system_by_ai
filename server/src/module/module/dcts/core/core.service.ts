import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScheduleService } from "../../../schedule/schedule.service";
import { WsService } from "../../../ws/ws.service";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";
import { CommonPostgresqlPrismaoService } from "../../../../prisma/common.postgresql.prismao.service";
import { base } from "../../../../util/base";

@Injectable()
export class CoreService implements OnModuleInit {
  constructor(
      private readonly cpgprismao: CommonPostgresqlPrismaoService,
      private readonly pgprismao: PostgresqlPrismaoService,
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
    const defaultSelArg = this.cpgprismao.defaultSelArg();
    // 查询所有信号灯组
    const allSignalLightGroups = await this.pgprismao.signal_light_group_info.findMany({
      where: {
        ...defaultSelArg.where
      }
    });
    // 查询信号灯组下的子信号灯
    const _signalLightGroup_signalLight = await this.pgprismao.signal_light_group_child_mapping.findMany({
      where: {
        group_id: {
          in: allSignalLightGroups.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })
    const allSignalLights = await this.pgprismao.signal_light_info.findMany({
      where: {
        id: {
          in: _signalLightGroup_signalLight.map(item => item.child_light_id)
        },
        ...defaultSelArg.where
      }
    })
    // 查询信号灯组下的策略类型
    const _signalLightGroup_strategyType = await this.pgprismao.signal_light_group_strategy_type_mapping.findMany({
      where: {
        group_id: {
          in: allSignalLightGroups.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })
    const allStrategyTypes = await this.pgprismao.signal_light_strategy_type.findMany({
      where: {
        id: {
          in: _signalLightGroup_strategyType.map(item => item.strategy_type_id)
        },
        if_disabled: base.N,
        ...defaultSelArg.where
      }
    })
    // 查询子信号灯与策略类型下的策略调度
    const _signalLight_strategySchedule = await this.pgprismao.signal_light_child_strategy_schedule_mapping.findMany({
      where: {
        child_light_id: {
          in: allSignalLights.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })
    const _strategyType_strategySchedule = await this.pgprismao.signal_light_strategy_type_strategy_schedule_mapping.findMany({
      where: {
        strategy_type_id: {
          in: allStrategyTypes.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })
    const allStrategySchedules = await this.pgprismao.signal_light_strategy_schedule.findMany({
      where: {
        id: {
          in: [
            ..._signalLight_strategySchedule.map(item => item.strategy_schedule_id),
            ..._strategyType_strategySchedule.map(item => item.strategy_schedule_id)
          ]
        },
        if_disabled: base.N,
        ...defaultSelArg.where
      }
    })
    // 查询策略调度下的策略参数
    const _strategySchedule_strategyParam = await this.pgprismao.signal_light_strategy_schedule_strategy_param_mapping.findMany({
      where: {
        strategy_schedule_id: {
          in: allStrategySchedules.map(item => item.id)
        },
        ...defaultSelArg.where
      }
    })
    const allStrategyParams = await this.pgprismao.signal_light_strategy_param.findMany({
      where: {
        id: {
          in: _strategySchedule_strategyParam.map(item => item.strategy_param_id)
        },
        if_disabled: base.N,
        ...defaultSelArg.where
      }
    })

    for (const allSignalLightGroup of allSignalLightGroups) {
      console.log('信号灯组id', allSignalLightGroup.id)
      // 该信号灯组下的子信号灯
      const lights = allSignalLights.filter(light => {
        return _signalLightGroup_signalLight.some(item => item.group_id === allSignalLightGroup.id && item.child_light_id === light.id)
      })
      const lightIds = lights.map(item => item.id)
      console.log('子信号灯组id', lightIds)
      // 该信号灯组下的策略类型
      const strategyTypes = allStrategyTypes.filter(type => {
        return _signalLightGroup_strategyType.some(item => item.group_id === allSignalLightGroup.id && item.strategy_type_id === type.id)
      })
      const strategyTypeIds = strategyTypes.map(item => item.id)
      // 该子信号灯且该策略类型下的策略调度
      const strategySchedules = allStrategySchedules.filter(schedule => {
        return _signalLight_strategySchedule.some(item => lightIds.includes(item.child_light_id) && item.strategy_schedule_id === schedule.id)
            && _strategyType_strategySchedule.some(item => strategyTypeIds.includes(item.strategy_type_id) && item.strategy_schedule_id === schedule.id)
      })
      const strategyScheduleIds = strategySchedules.map(item => item.id)
      console.log('策略调度id', strategyScheduleIds)
      // 该策略调度下的策略参数
      const strategyParams = allStrategyParams.filter(param => {
        return _strategySchedule_strategyParam.some(item => strategyScheduleIds.includes(item.strategy_schedule_id) && item.strategy_param_id === param.id)
      })
      const strategyParamIds = strategyParams.map(item => item.id)
      console.log('策略参数id', strategyParamIds)

      // 开始计算每秒钟每种灯的状态
    }

    const end = performance.now();
    console.info(`calculateLight运行所需时间${end - start}ms`)
  }

  private async runCoreSchedule() {
    return true
  }
}
