import { ContextMenuItem } from "@/views/dashboard/index/dto.ts";
import router from "@/router";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { EDIT_TYPE_1, ID_PREFIX_SIGNAL_LIGHT_GROUP } from "@/views/dashboard/functionModules/constant.ts";
import { MapInteractionModule } from "@/views/dashboard/functionModules/mapInteractionModule.ts";
import { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption } from "naive-ui";
import { PermissionModule } from "@/views/dashboard/functionModules/permissionModule.ts";

/**
 * 右键菜单
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

  private setContextMenuShowCB: (() => void) | null = null

  public setSetContextMenuShowCB(func: () => void) {
    this.setContextMenuShowCB = func
  }

  private setContextMenuXYCB: (() => void) | null = null

  public setSetContextMenuXYCB(func: () => void) {
    this.setContextMenuXYCB = func
  }

  private setContextMenuOptionCB: (() => void) | null = null

  public setSetContextMenuOptionCB(func: () => void) {
    this.setContextMenuOptionCB = func
  }

  private setFormPanelTitleCB: (() => void) | null = null

  public setSetFormPanelTitleCB(func: () => void) {
    this.setFormPanelTitleCB = func
  }


  // 右键菜单的显示
  private _contextMenuShow = false

  get contextMenuShow(): boolean {
    return this._contextMenuShow;
  }

  set contextMenuShow(value: boolean) {
    this._contextMenuShow = value;
    if (this.setContextMenuShowCB) {
      this.setContextMenuShowCB()
    }
  }

  // 右键菜单的坐标
  private _contextMenuXY = [0, 0]

  get contextMenuXY(): number[] {
    return this._contextMenuXY;
  }

  set contextMenuXY(value: number[]) {
    this._contextMenuXY = value;
    if (this.setContextMenuXYCB) {
      this.setContextMenuXYCB()
    }
  }

  // 右键菜单对应的操作
  public contextMenus: ContextMenuItem[] = [
    {
      id: 'dcts:signalLight:signalLightGroupInfo:ins',
      func: () => {
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:ins'})
      }
    },
    {
      id: 'dcts:signalLight:signalLightGroupInfo:upd',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        if (this.meModule.selectedEntityIds[0].startsWith(ID_PREFIX_SIGNAL_LIGHT_GROUP)) {
          itemId = this.meModule.selectedEntityIds[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:upd', query: {id: itemId}})
      }
    },
    {
      id: 'dcts:signalLight:signalLightGroupInfo:del',
      func: () => {
        if (!this.meModule) {
          return
        }
        let itemId = ''
        if (this.meModule.selectedEntityIds[0].startsWith(ID_PREFIX_SIGNAL_LIGHT_GROUP)) {
          itemId = this.meModule.selectedEntityIds[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        router.push({name: '~fp~:signalLight:signalLightGroupInfo:del', query: {id: itemId}})
      }
    },
    {
      id: 'dcts:signalLight:signalLightInfo:ins',
      func: () => {
        if (!this.miModule) {
          return
        }
        this.miModule.editType = EDIT_TYPE_1
        this.miModule.ifEditing = true
      }
    },
    {
      id: 'close',
      func: () => {
        this.contextMenuShow = false
      }
    }
  ]
  // 右键菜单项
  private _contextMenuOption: Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption> = []

  get contextMenuOption(): Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption> {
    return this._contextMenuOption;
  }

  set contextMenuOption(value: Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>) {
    this._contextMenuOption = value;
    if (this.setContextMenuOptionCB) {
      this.setContextMenuOptionCB()
    }
  }

  public refreshContextMenuOption() {
    this.contextMenuOption = [
      {
        label: '信号灯管理',
        key: 'i:dcts:signalLight',
        show: !this.pModule || this.pModule.contextMenuIfHasPermission('i:dcts:signalLight'),
        children: [
          {
            label: '信号灯组信息管理',
            key: 'i:dcts:signalLight:signalLightGroupInfo',
            show: !this.pModule || this.pModule.contextMenuIfHasPermission('i:dcts:signalLight:signalLightGroupInfo'),
            children: [
              {
                label: '新增信号灯组',
                key: 'dcts:signalLight:signalLightGroupInfo:ins',
                show: !this.pModule || this.pModule.contextMenuIfHasPermission('dcts:signalLight:signalLightGroupInfo:ins'),
              },
              {
                label: '修改信号灯组',
                key: 'dcts:signalLight:signalLightGroupInfo:upd',
                show: !this.pModule || this.pModule.contextMenuIfHasPermission('dcts:signalLight:signalLightGroupInfo:upd', true),
              },
              {
                label: '删除信号灯组',
                key: 'dcts:signalLight:signalLightGroupInfo:del',
                show: !this.pModule || this.pModule.contextMenuIfHasPermission('dcts:signalLight:signalLightGroupInfo:del', true),
              }
            ]
          },
          {
            label: '子信号灯信息管理',
            key: 'i:dcts:signalLight:signalLightInfo',
            show: !this.pModule || this.pModule.contextMenuIfHasPermission('i:dcts:signalLight:signalLightInfo', true),
            children: [
              {
                label: '新增子信号灯',
                key: 'dcts:signalLight:signalLightInfo:ins',
                show: !this.pModule || this.pModule.contextMenuIfHasPermission('dcts:signalLight:signalLightInfo:ins', true),
              }
            ]
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        label: '关闭',
        key: 'close'
      }
    ]
  }

  private _formPanelTitle = ''

  get formPanelTitle(): string {
    return this._formPanelTitle;
  }

  set formPanelTitle(value: string) {
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
