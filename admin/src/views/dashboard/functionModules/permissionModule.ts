import { useSysStore } from "@/store/module/sys.ts";
import { useUserStore } from "@/store/module/user.ts";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import {
  ID_PREFIX_SIGNAL_LIGHT,
  ID_PREFIX_SIGNAL_LIGHT_GROUP,
  ID_PREFIX_VEHICLE_REAL_TIME
} from "@/views/dashboard/functionModules/constant.ts";

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
   * @param basedOn 基于何种实体
   * @param notBasedOn 不可基于何种实体
   */
  private contextMenuIfHasPermission(perm: string, basedOn: string[] = [], notBasedOn: string[] = []) {
    const dctsButtons = visibleButtons.get('sys:dcts');
    if (dctsButtons) {
      let entityPermission = true
      if (this.meModule) {
        const seidsByGroup = this.meModule.getSelectedEntityIdsByGroup();
        if (basedOn.length > 0) {
          entityPermission = false
          if (basedOn.includes(ID_PREFIX_SIGNAL_LIGHT_GROUP) && seidsByGroup.signalLightGroupInfoCount > 0) {
            entityPermission = true
          }
          if (basedOn.includes(ID_PREFIX_SIGNAL_LIGHT) && seidsByGroup.signalLightInfoCount > 0) {
            entityPermission = true
          }
          if (basedOn.includes(ID_PREFIX_VEHICLE_REAL_TIME) && seidsByGroup.vehicleRealTimeCount > 0) {
            entityPermission = true
          }
        }
        if (notBasedOn.length > 0) {
          if (notBasedOn.includes(ID_PREFIX_SIGNAL_LIGHT_GROUP) && seidsByGroup.signalLightGroupInfoCount > 0) {
            entityPermission = false
          }
          if (notBasedOn.includes(ID_PREFIX_SIGNAL_LIGHT) && seidsByGroup.signalLightInfoCount > 0) {
            entityPermission = false
          }
          if (notBasedOn.includes(ID_PREFIX_VEHICLE_REAL_TIME) && seidsByGroup.vehicleRealTimeCount > 0) {
            entityPermission = false
          }
        }
      }
      return userStore.ifLogin && (!perm || dctsButtons.includes(perm)) && entityPermission
    }
    return false
  }

  public cmihp = this.contextMenuIfHasPermission
}
