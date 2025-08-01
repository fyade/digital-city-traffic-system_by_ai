import { RouteRecordRaw } from "vue-router";
import { getPages, getSystems } from "@/api/common/sys.ts";
import { arr2ToDiguiObj } from "@/utils/baseUtils.ts";
import router from "@/router";
import { base } from "@dcts/common";
import { Component } from "vue";

// 引入资源
const modules: Record<string, () => Promise<{ default: Component }>> = {
  ...import.meta.glob(`../../module/**/**/**/**.vue`),
  ...import.meta.glob(`../../module/**/**/**.vue`),
}
export const goToAdminPanelSystem = async (callback: (path: string) => void) => {
  const systems = await getSystems()
  const system = systems.find(item => item.perms === 'sys:dcts');
  if (system) {
    const pages = await getPages(system.id)
    const routes = router.getRoutes();
    let ifHasAddRoutes = false;
    for (const page of pages) {
      if (ifHasAddRoutes) {
        continue
      }
      const find = routes.find(item => item.name === `${page.perms}-dashboardPage`);
      if (find) {
        ifHasAddRoutes = true
      }
    }
    if (!ifHasAddRoutes) {
      const permissions: RouteRecordRaw[] = [];
      for (const page of pages) {
        if (![base.MenuTypeEnum.T_MENU, base.MenuTypeEnum.T_COMP].includes(page.type)) {
          continue
        }
        const permission: RouteRecordRaw = {
          path: page.path,
          name: `${page.perms}-dashboardPage`,
          meta: {
            ...page,
            asideMenu: false,
            sysPerms: 'sys:dcts'
          },
          children: []
        }
        if (page.type === base.MenuTypeEnum.T_COMP) {
          const component = await modules[`../../module/${system.path}${page.component}`]()
          permission.component = component.default
        } else {
          delete permission.component
        }
        permissions.push(permission)
      }
      const permissionObj = arr2ToDiguiObj(permissions, {ifDeepClone: false, childrenKey: 'meta'})
          .sort((m1, m2) => (typeof m1.meta?.orderNum === 'number' && typeof m2.meta?.orderNum === 'number') ? (m1.meta.orderNum - m2.meta.orderNum) : 0)
      for (let i = 0; i < permissionObj.length; i++) {
        router.addRoute('~dashboard/adminPanel', permissionObj[i])
      }
      if (permissionObj.length > 0) {
        const find1 = router.getRoutes().find(item => item.path === '/dashboard/admin-panel');
        if (find1) {
          find1.redirect = `${find1.path}/${permissionObj[0].path}`
        }
        callback(permissionObj[0].path)
      }
    }
    const index = router.getRoutes().findIndex(item => item.path === location.pathname);
    if (index === -1) {
      const obj = arr2ToDiguiObj(pages);
      await router.push(`/dashboard/admin-panel/${obj[0].path}`)
    }
  }
}
