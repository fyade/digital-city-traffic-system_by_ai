import { useRouterStore } from "@/store/module/router.ts";
import router from "@/router";
import { LocationQueryRaw } from "vue-router";

const routerStore = useRouterStore()

/**
 * 前往隐藏的菜单
 * @param perm
 * @param query
 */
export function gotoHiddenPath(perm: string, query?: LocationQueryRaw) {
  const allMenus2 = routerStore.allMenus2
  const find = allMenus2.find((item) => item.name === perm);
  if (find) {
    routerStore.addMenu(find);
    router.push({name: perm, query: query})
  }
}

/**
 * 根据路由名跳转
 * @param perm
 * @param query
 */
export function routerPushByName(perm: string, query?: LocationQueryRaw) {
  router.push({name: perm, query: query})
}
