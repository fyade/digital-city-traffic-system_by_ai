import { useSysStore } from "@/store/module/sys.ts";
import { useUserStore } from "@/store/module/user.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { ID_PREFIX_SIGNAL_LIGHT_GROUP } from "@/views/dashboard/functionModules/constant.ts";

const sysStore = useSysStore()
const userStore = useUserStore();

const visibleButtons = sysStore.getVisibleButtons();

/**
 * 权限相关
 */
export class PermissionModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }


  /**
   * 右键菜单项是否有权限
   * @param perm 菜单所需权限
   * @param ifNeedEntity 基于何种实体
   */
  public contextMenuIfHasPermission(perm: string, ifNeedEntity = '') {
    const dctsButtons = visibleButtons.get('sys:dcts');
    if (dctsButtons) {
      let entityPermission = true
      if (this.meModule) {
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (ifNeedEntity === ID_PREFIX_SIGNAL_LIGHT_GROUP) {
          entityPermission = seidsByGroup.signalLightGroupCount > 0
        }
      }
      return userStore.ifLogin && dctsButtons.includes(perm) && entityPermission
    }
    return false
  }
}
