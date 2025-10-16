import { ContextMenuItem } from "@/views/dashboard/index/dto.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import {
  ContextMenuOptionType,
  EDIT_TYPE_ENUM, ID_PREFIX_FLIGHT_RESTRICTION_ZONE,
  ID_PREFIX_SIGNAL_LIGHT,
  ID_PREFIX_SIGNAL_LIGHT_GROUP,
  ID_PREFIX_VEHICLE_REAL_TIME
} from "@/views/dashboard/functionModules/constant.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { DropdownOption } from "naive-ui";
import { PermissionModule } from "@/views/dashboard/functionModules/permissionModule.ts";
import { routerPushByName } from "@/utils/RouterUtils.ts";
import { SignalLightModule } from "@/views/dashboard/functionModules/signalLightModule.ts";

/**
 * 右键菜单模块
 */
export class ContextMenuModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }

  private miModule: MapInteractionModule | null = null

  public setMiModule(miModule: MapInteractionModule) {
    this.miModule = miModule;
  }

  private pModule: PermissionModule | null = null

  public setPModule(pModule: PermissionModule) {
    this.pModule = pModule;
  }

  private slModule: SignalLightModule | null = null

  public setSlModule(slModule: SignalLightModule) {
    this.slModule = slModule
  }

  private setContextMenuShowCB: ((data: boolean) => void) | null = null

  public setSetContextMenuShowCB(func: (data: boolean) => void) {
    this.setContextMenuShowCB = func
  }

  private setContextMenuXYCB: ((data: [number, number]) => void) | null = null

  public setSetContextMenuXYCB(func: (data: [number, number]) => void) {
    this.setContextMenuXYCB = func
  }

  private setContextMenuOptionCB: ((data: ContextMenuOptionType) => void) | null = null

  public setSetContextMenuOptionCB(func: (data: ContextMenuOptionType) => void) {
    this.setContextMenuOptionCB = func
  }

  private setFormPanelTitleCB: (() => void) | null = null

  public setSetFormPanelTitleCB(func: () => void) {
    this.setFormPanelTitleCB = func
  }

  private trackEntity: ((entityId: string) => void) | null = null

  public setTrackEntity(func: (entityId: string) => void) {
    this.trackEntity = func
  }
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  // 右键菜单的显示
  private _contextMenuShow = false

  get contextMenuShow(): boolean {
    return this._contextMenuShow;
  }

  public set contextMenuShow(value: boolean) {
    this._contextMenuShow = value;
    if (this.setContextMenuShowCB) {
      this.setContextMenuShowCB(this.contextMenuShow)
    }
  }

  // 右键菜单的坐标，注意，添加数据时，禁止使用数组方法
  private _contextMenuXY: [number, number] = [0, 0]

  // 右键菜单的坐标，注意，添加数据时，禁止使用数组方法
  get contextMenuXY(): [number, number] {
    return this._contextMenuXY;
  }

  // 右键菜单的坐标，注意，添加数据时，禁止使用数组方法
  public set contextMenuXY(value: [number, number]) {
    this._contextMenuXY = value;
    if (this.setContextMenuXYCB) {
      this.setContextMenuXYCB(this.contextMenuXY)
    }
  }

  // 右键菜单对应的操作
  public contextMenus: ContextMenuItem[] = [
    // 信号灯组
    {
      id: '~dctsDashboard~:signalLight:signalLightGroupInfo:ins',
      func: () => {
        routerPushByName('~fp~:signalLight:signalLightGroupInfo:ins')
      }
    },
    {
      id: '~dctsDashboard~:signalLight:signalLightGroupInfo:upd',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightGroupInfoCount > 0) {
          itemId = seidsByGroup.signalLightGroupInfo[0]
        }
        routerPushByName('~fp~:signalLight:signalLightGroupInfo:upd', {id: itemId})
      }
    },
    {
      id: '~dctsDashboard~:signalLight:signalLightGroupInfo:del',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightGroupInfoCount > 0) {
          itemId = seidsByGroup.signalLightGroupInfo[0]
        }
        routerPushByName('~fp~:signalLight:signalLightGroupInfo:del', {id: itemId})
      }
    },
    // 子信号灯
    {
      id: '~dctsDashboard~:signalLight:signalLightInfo:ins',
      func: () => {
        if (!this.miModule) {
          return
        }
        this.miModule.setEditType(EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT)
      }
    },
    {
      id: '~dctsDashboard~:signalLight:signalLightInfo:upd',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightInfoCount > 0) {
          itemId = seidsByGroup.signalLightInfo[0]
        }
        routerPushByName('~fp~:signalLight:signalLightInfo:upd', {id: itemId})
      }
    },
    {
      id: '~dctsDashboard~:signalLight:signalLightInfo:del',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightInfoCount > 0) {
          itemId = seidsByGroup.signalLightInfo[0]
        }
        routerPushByName('~fp~:signalLight:signalLightInfo:del', {id: itemId})
      }
    },
    {
      id: '~dctsDashboard~:signalLight:signalLightChildStyleMapping:ins',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightInfoCount > 0) {
          itemId = seidsByGroup.signalLightInfo[0]
        }
        routerPushByName('~fp~:signalLight:signalLightChildStyleMapping:ins', {clid: itemId})
      }
    },
    {
      id: '~dctsDashboard~:signalLightStrategy:signalLightGroupStrategyTypeMapping:ins',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightGroupInfoCount > 0) {
          itemId = seidsByGroup.signalLightGroupInfo[0]
        }
        routerPushByName('~fp~:signalLightStrategy:signalLightGroupStrategyTypeMapping:ins', {slgid: itemId})
      }
    },
    {
      id: '~dctsDashboard~:signalLightStrategy:signalLightChildStrategyScheduleMapping:ins',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightInfoCount > 0) {
          itemId = seidsByGroup.signalLightInfo[0]
        }
        routerPushByName('~fp~:signalLightStrategy:signalLightChildStrategyScheduleMapping:ins', {clid: itemId})
      }
    },
    {
      id: '~dctsDashboard~:vehicle:queryVehicleTrajectory',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.vehicleRealTimeCount > 0) {
          itemId = seidsByGroup.vehicleRealTime[0]
        }
        routerPushByName('~fp~:vehicle:trajectory', {vid: itemId})
      }
    },
    {
      id: '~dctsDashboard~:queryRuntimeDiagram',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.signalLightGroupInfoCount > 0) {
          itemId = seidsByGroup.signalLightGroupInfo.join(',')
        }
        routerPushByName('~fp~:runtimeDiagram', {id: itemId})
      }
    },
    {
      id: '~dctsDashboard~:refreshSignalLight',
      func: () => {
        if (!this.slModule) {
          return
        }
        this.slModule.drawSignalLightsWhenMapMove()
      }
    },
    {
      id: '~dctsDashboard~:jvjiaobinggenzonggaishiti',
      func: () => {
        if (!this.meModule) {
          return
        }
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        const entityId = `${ID_PREFIX_VEHICLE_REAL_TIME}${seidsByGroup.vehicleRealTime[0]}`
        if (this.trackEntity) {
          this.trackEntity(entityId)
        }
      }
    },
    {
      id: '~dctsDashboard~:airspace:insFlightRestrictionZone',
      func: () => {
        if (!this.miModule) {
          return
        }
        this.miModule.setEditType(EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE)
      }
    },
    {
      id: '~dctsDashboard~:airspace:updFlightRestrictionZone',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.flightRestrictionZoneCount > 0) {
          itemId = seidsByGroup.flightRestrictionZone[0]
        }
        routerPushByName('~fp~:airspace:flightRestrictionZone:upd', {id: itemId})
      }
    },
    {
      id: '~dctsDashboard~:airspace:delFlightRestrictionZone',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (seidsByGroup.flightRestrictionZoneCount > 0) {
          itemId = seidsByGroup.flightRestrictionZone[0]
        }
        routerPushByName('~fp~:airspace:flightRestrictionZone:del', {id: itemId})
      }
    },
    {
      id: '~dctsDashboard~:closeMenuOption',
      func: () => {
        this.contextMenuShow = false
      }
    }
  ]
  // 右键菜单项，注意，添加数据时，禁止使用数组方法
  private _contextMenuOption: ContextMenuOptionType = []

  // 右键菜单项，注意，添加数据时，禁止使用数组方法
  get contextMenuOption(): ContextMenuOptionType {
    return this._contextMenuOption;
  }

  // 右键菜单项，注意，添加数据时，禁止使用数组方法
  private set contextMenuOption(value: ContextMenuOptionType) {
    this._contextMenuOption = value;
    if (this.setContextMenuOptionCB) {
      this.setContextMenuOptionCB(this.contextMenuOption)
    }
  }

  public refreshContextMenuOption() {
    this.contextMenuOption = [
      {
        label: '信号灯管理',
        key: '~dctsDashboard~:signalLight',
        show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight'),
        children: [
          {
            label: '信号灯组信息管理',
            key: '~dctsDashboard~:signalLight:signalLightGroupInfo',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightGroupInfo', [], [ID_PREFIX_SIGNAL_LIGHT]),
            children: [
              {
                label: '新增信号灯组',
                key: '~dctsDashboard~:signalLight:signalLightGroupInfo:ins',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightGroupInfo:ins', [], [ID_PREFIX_SIGNAL_LIGHT_GROUP, ID_PREFIX_SIGNAL_LIGHT]),
              },
              {
                label: '修改信号灯组',
                key: '~dctsDashboard~:signalLight:signalLightGroupInfo:upd',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightGroupInfo:upd', [ID_PREFIX_SIGNAL_LIGHT_GROUP]),
              },
              {
                label: '删除信号灯组',
                key: '~dctsDashboard~:signalLight:signalLightGroupInfo:del',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightGroupInfo:del', [ID_PREFIX_SIGNAL_LIGHT_GROUP]),
              }
            ]
          },
          {
            label: '子信号灯信息管理',
            key: '~dctsDashboard~:signalLight:signalLightInfo',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightInfo', [ID_PREFIX_SIGNAL_LIGHT_GROUP, ID_PREFIX_SIGNAL_LIGHT]),
            children: [
              {
                label: '新增子信号灯',
                key: '~dctsDashboard~:signalLight:signalLightInfo:ins',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightInfo:ins', [ID_PREFIX_SIGNAL_LIGHT_GROUP]),
              },
              {
                label: '修改子信号灯',
                key: '~dctsDashboard~:signalLight:signalLightInfo:upd',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightInfo:upd', [ID_PREFIX_SIGNAL_LIGHT])
              },
              {
                label: '删除子信号灯',
                key: '~dctsDashboard~:signalLight:signalLightInfo:del',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightInfo:del', [ID_PREFIX_SIGNAL_LIGHT])
              }
            ]
          },
          {
            label: '子信号灯样式关联',
            key: '~dctsDashboard~:signalLight:signalLightChildStyleMapping',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightChildStyleMapping', [ID_PREFIX_SIGNAL_LIGHT]),
            children: [
              {
                label: '新增/修改关联',
                key: '~dctsDashboard~:signalLight:signalLightChildStyleMapping:ins',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLight:signalLightChildStyleMapping:ins', [ID_PREFIX_SIGNAL_LIGHT])
              }
            ]
          }
        ]
      },
      {
        label: '信号灯策略管理',
        key: '~dctsDashboard~:signalLightStrategy',
        show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLightStrategy', [ID_PREFIX_SIGNAL_LIGHT_GROUP, ID_PREFIX_SIGNAL_LIGHT]),
        children: [
          {
            label: '信号灯组-策略类型关联管理',
            key: '~dctsDashboard~:signalLightStrategy:signalLightGroupStrategyTypeMapping',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLightStrategy:signalLightGroupStrategyTypeMapping', [ID_PREFIX_SIGNAL_LIGHT_GROUP]),
            children: [
              {
                label: '新增/修改关联',
                key: '~dctsDashboard~:signalLightStrategy:signalLightGroupStrategyTypeMapping:ins',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLightStrategy:signalLightGroupStrategyTypeMapping:ins', [ID_PREFIX_SIGNAL_LIGHT_GROUP]),
              }
            ]
          },
          {
            label: '子信号灯-策略调度关联管理',
            key: '~dctsDashboard~:signalLightStrategy:signalLightChildStrategyScheduleMapping',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLightStrategy:signalLightChildStrategyScheduleMapping', [ID_PREFIX_SIGNAL_LIGHT]),
            children: [
              {
                label: '新增/修改关联',
                key: '~dctsDashboard~:signalLightStrategy:signalLightChildStrategyScheduleMapping:ins',
                show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:signalLightStrategy:signalLightChildStrategyScheduleMapping:ins', [ID_PREFIX_SIGNAL_LIGHT]),
              }
            ]
          }
        ]
      },
      {
        label: '车辆管理',
        key: '~dctsDashboard~:vehicle',
        show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:vehicle'),
        children: [
          {
            label: '车辆历史轨迹查询',
            key: '~dctsDashboard~:vehicle:queryVehicleTrajectory',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:vehicle:queryVehicleTrajectory'),
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        label: '查看运行时刻图',
        key: '~dctsDashboard~:queryRuntimeDiagram',
        show: !this.pModule || this.pModule.cmihp('', [ID_PREFIX_SIGNAL_LIGHT_GROUP])
      },
      {
        label: '刷新信号灯状态',
        key: '~dctsDashboard~:refreshSignalLight'
      },
      {
        type: 'divider',
        show: !this.pModule || this.pModule.cmihp('', [ID_PREFIX_VEHICLE_REAL_TIME])
      },
      {
        label: '聚焦并跟踪该实体',
        key: '~dctsDashboard~:jvjiaobinggenzonggaishiti',
        show: !this.pModule || this.pModule.cmihp('', [ID_PREFIX_VEHICLE_REAL_TIME])
      },
      {
        type: 'divider'
      },
      {
        label: '空域管理',
        key: '~dctsDashboard~:airspace',
        show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:airspace'),
        children: [
          {
            label: '新增限飞区',
            key: '~dctsDashboard~:airspace:insFlightRestrictionZone',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:airspace:insFlightRestrictionZone')
          },
          {
            label: '修改限飞区',
            key: '~dctsDashboard~:airspace:updFlightRestrictionZone',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:airspace:updFlightRestrictionZone', [ID_PREFIX_FLIGHT_RESTRICTION_ZONE])
          },
          {
            label: '删除限飞区',
            key: '~dctsDashboard~:airspace:delFlightRestrictionZone',
            show: !this.pModule || this.pModule.cmihp('~dctsDashboard~:airspace:delFlightRestrictionZone', [ID_PREFIX_FLIGHT_RESTRICTION_ZONE])
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        label: '关闭',
        key: '~dctsDashboard~:closeMenuOption'
      }
    ]
  }

  private _formPanelTitle = ''

  get formPanelTitle(): string {
    return this._formPanelTitle;
  }

  private set formPanelTitle(value: string) {
    this._formPanelTitle = value;
    if (this.setFormPanelTitleCB) {
      this.setFormPanelTitleCB()
    }
  }

  /**
   * 右键菜单的事件
   * @param key
   * @param obj
   */
  public contextMenuSelect = (key: string, obj: DropdownOption) => {
    if (obj) {
      this.formPanelTitle = obj.label as string
    }
    const find = this.contextMenus.find(item => item.id === key);
    if (find) {
      find.func()
    }
  }
}
