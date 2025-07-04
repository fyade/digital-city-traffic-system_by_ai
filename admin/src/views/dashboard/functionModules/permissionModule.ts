import { useSysStore } from "@/store/module/sys.ts";
import { useUserStore } from "@/store/module/user.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";

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
   * @param perm
   * @param ifNeedEntity
   * @private
   */
  public contextMenuIfHasPermission(perm: string, ifNeedEntity = false) {
    const dctsButtons = visibleButtons.get('sys:dcts');
    if (dctsButtons) {
      return userStore.ifLogin && dctsButtons.includes(perm) && ((ifNeedEntity && this.meModule) ? this.meModule.selectedEntityIds.length > 0 : true)
    }
    return false
  }
}
