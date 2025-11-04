import { SysDto } from "@/type/module/main/sysManage/sys.ts";
import { getButtons, getPages } from "@/api/common/sys.ts";
import { RouteRecordNormalized, RouteRecordRaw } from "vue-router";
import { final } from "@/utils/base.ts";
import { arr2ToDiguiObj, diguiRun } from "@/utils/baseUtils.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { useRouterStore } from "@/store/module/router.ts";
import { ElMessage } from 'element-plus'
import router from "@/router";
import { base, regularUtils } from "@dcts/common";
import { Component } from "vue";

const sysStore = useSysStore();
const routerStore = useRouterStore();

// 引入资源
const modules: Record<string, () => Promise<{ default: Component }>> = {
  ...import.meta.glob(`../../views/module/**/**/**/**.vue`),
  ...import.meta.glob(`../../views/module/**/**/**.vue`),
}
export const goToSystem = async (
    dto: SysDto,
    {
      pushPath = null,
      errorCallback = null,
    }: {
      pushPath?: string | null
      errorCallback?: Function | null
    } = {}
) => {
  try {
    const res = await getPages(dto.id)
    const res2 = await getButtons(dto.id)
    const buttonPerms = res2.map(item => item.perms);
    sysStore.setVisibleButtons(dto.perms, buttonPerms)
    if (router.getRoutes().findIndex(item => item.name === `/${dto.path}`) === -1) {
      const permissions: RouteRecordRaw[] = [];
      for (const item of res) {
        if (!([base.MenuTypeEnum.T_MENU, base.MenuTypeEnum.T_COMP].includes(item.type))) {
          continue;
        }
        const permission: RouteRecordRaw = {
          path: item.path,
          name: item.perms,
          meta: {
            ...item,
            asideMenu: true,
            sysPerms: dto.perms,
            fromDb: true,
          },
          children: []
        }
        if (item.type === base.MenuTypeEnum.T_COMP) {
          const component = await modules[`../module/${dto.path}${item.component}`]()
          permission.component = component.default
        } else {
          delete permission.component
        }
        permissions.push(permission)
      }
      const permissionsObj = arr2ToDiguiObj(permissions, {ifDeepClone: false, childrenKey: 'meta'})
          .sort((m1, m2) => (typeof m1.meta?.orderNum === 'number' && typeof m2.meta?.orderNum === 'number') ? (m1.meta.orderNum - m2.meta.orderNum) : 0)
      router.addRoute({
        path: `/${dto.path}`,
        name: dto.perms,
        meta: {
          label: `${dto.name}首页`
        },
        redirect: `/${dto.path}/${permissionsObj[0].path}`,
        component: () => import('@/layout/sys/index.vue'),
        children: []
      })
      for (let i = 0; i < permissionsObj.length; i++) {
        router.addRoute(dto.perms, permissionsObj[i])
      }
      const routes = router.getRoutes();
      const fixs = permissions.filter(item => item.meta?.ifFixed === final.Y).map(item => item.meta?.perms);
      const fixedMenus: string[] = []
      diguiRun(permissionsObj, ({obj, parent}) => {
        if (fixs.includes(obj.meta?.perms)) {
          const find = routes.find(item => item.name === obj.meta?.perms);
          if (find) {
            fixedMenus.push(find.path)
          }
        }
      })
      routerStore.setFixedMenus(dto.perms, fixedMenus)
    }
    sysStore.setCurrentSystem(dto)
    routerStore.reloadAllMenu()
    routerStore.deleteAllMenu()
    if (pushPath) {
      try {
        const strs = regularUtils.splitUrlByX(pushPath);
        if (strs.length > 1) {
          let arr: RouteRecordRaw[] | void = []
          for (let i = 1; i < strs.length; i++) {
            const find: RouteRecordNormalized | RouteRecordRaw | void = i === 1 ?
                router.getRoutes().find(item => item.path === `/${dto.path}${strs[1]}`) :
                arr?.find(item => `${item.path}` === strs[i].replace('/', ''))
            if (find) {
              if (i === strs.length - 1) {
                await router.push(pushPath)
                return;
              }
              arr = find.children
            } else {
              await router.push(`/${dto.path}`)
              return;
            }
          }
        }
        await router.push(`/${dto.path}`)
        return;
      } catch (e) {
        console.error(e)
        await router.push(`/${dto.path}`)
        return;
      }
    }
    await router.push(`/${dto.path}`)
    return;
  } catch (e) {
    console.error(e);
    if (errorCallback) {
      errorCallback()
    }
    ElMessage.error({
      message: '系统发生故障，请检查菜单是否有错误，若无法解决，请查看开发文档或联系开发者。',
      duration: 0,
      showClose: true
    })
  }
  return
}
