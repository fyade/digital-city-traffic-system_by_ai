import { useDictStore } from "@/store/module/dict.ts";
import { useRouterStore } from "@/store/module/router.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { useSysConfigStore } from "@/store/module/sysConfig.ts";
import { useUserStore } from "@/store/module/user.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";

export function useStore() {
  return {
    dashboard: useDashboardStore(),
    dict: useDictStore(),
    router: useRouterStore(),
    sys: useSysStore(),
    sysConfig: useSysConfigStore(),
    user: useUserStore(),
  }
}
