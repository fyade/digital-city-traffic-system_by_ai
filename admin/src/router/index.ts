import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store/module/user.ts";
import { ifWebsiteLink } from "@/utils/LinkUtils.ts";
import { adminConfig, publicConfig } from "@dcts/config";
import { goToLogin } from "@/utils/baseUtils.ts";
import { ifDashboardPage } from "@/utils/DashboardUtils.ts";
import { final } from "@/utils/base.ts";
import { useSysStore } from "@/store/module/sys.ts";

export const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: '~workbench-home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/',
    name: '~',
    redirect: '/home',
    meta: {
      label: '控制台主页'
    },
    component: () => import('@/layout/sys/index.vue'),
    children: []
  },
  {
    path: '/user',
    name: '~user',
    meta: {
      label: '个人中心'
    },
    component: () => import('@/layout/user/index.vue'),
    redirect: '/user/info',
    children: [
      {
        path: 'info',
        meta: {
          icon: 'info',
          label: '我的资料',
        },
        component: () => import('@/views/user/info.vue')
      },
      {
        path: 'edit-avatar',
        meta: {
          icon: 'avatar',
          label: '修改头像',
        },
        component: () => import('@/views/user/edit-avatar.vue')
      },
      {
        path: 'edit-psd',
        meta: {
          icon: 'electronic-locks-open',
          label: '修改密码',
        },
        component: () => import('@/views/user/edit-psd.vue')
      },
      // {
      //   path: 'api-key',
      //   meta: {
      //     icon: '',
      //     label: 'apiKey管理'
      //   },
      //   component: () => import('@/views/user/api-key.vue')
      // }
    ]
  },
  {
    path: '/login',
    name: '~login',
    component: () => import('@/views/user/login.vue')
  },
  {
    path: '/dashboard',
    name: '~dashboard',
    component: () => import('@/views/dashboard/index/index.vue'),
    children: [
      {
        path: 'admin-panel',
        name: '~dashboard/adminPanel',
        component: () => import('@/views/dashboard/adminPanel/index.vue'),
        children: [
          {
            path: ':pathMatch(.*)*',
            component: () => import('@/views/dashboard/redirect/index.vue')
          }
        ]
      },
      {
        path: 'setting-panel',
        name: '~dashboard/settingPanel',
        component: () => import('@/views/dashboard/settingPanel/index.vue')
      },
      {
        path: 'operate-guide',
        name: '~dashboard/operateGuide',
        component: () => import('@/views/dashboard/operateGuide/index.vue')
      },
      {
        path: 'form-panel',
        name: '~fp~',
        component: () => import('@/views/dashboard/formPanel/index.vue'),
        children: [
          {
            path: 'signal-light',
            name: '~fp~:signalLight',
            component: () => import('@/views/dashboard/formPanel/signalLight/index.vue'),
            children: [
              {
                path: 'signal-light-group-info',
                name: '~fp~:signalLight:signalLightGroupInfo',
                component: () => import('@/views/dashboard/formPanel/signalLight/signalLightGroupInfo/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:signalLight:signalLightGroupInfo:ins',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightGroupInfo/form.vue')
                  },
                  {
                    path: 'upd',
                    name: '~fp~:signalLight:signalLightGroupInfo:upd',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightGroupInfo/form.vue')
                  },
                  {
                    path: 'del',
                    name: '~fp~:signalLight:signalLightGroupInfo:del',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightGroupInfo/form.vue')
                  }
                ]
              },
              {
                path: 'signal-light-info',
                name: '~fp~:signalLight:signalLightInfo',
                component: () => import('@/views/dashboard/formPanel/signalLight/signalLightInfo/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:signalLight:signalLightInfo:ins',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightInfo/form.vue')
                  },
                  {
                    path: 'upd',
                    name: '~fp~:signalLight:signalLightInfo:upd',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightInfo/form.vue')
                  },
                  {
                    path: 'del',
                    name: '~fp~:signalLight:signalLightInfo:del',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightInfo/form.vue')
                  }
                ]
              },
              {
                path: 'signal-light-child-style-mapping',
                name: '~fp~:signalLight:signalLightChildStyleMapping',
                component: () => import('@/views/dashboard/formPanel/signalLight/signalLightChildStyleMapping/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:signalLight:signalLightChildStyleMapping:ins',
                    component: () => import('@/views/dashboard/formPanel/signalLight/signalLightChildStyleMapping/form.vue')
                  }
                ]
              }
            ]
          },
          {
            path: 'signal-light-strategy',
            name: '~fp~:signalLightStrategy',
            component: () => import('@/views/dashboard/formPanel/signalLightStrategy/index.vue'),
            children: [
              {
                path: 'signal-light-group-strategy-type-mapping',
                name: '~fp~:signalLightStrategy:signalLightGroupStrategyTypeMapping',
                component: () => import('@/views/dashboard/formPanel/signalLightStrategy/signalLightGroupStrategyTypeMapping/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:signalLightStrategy:signalLightGroupStrategyTypeMapping:ins',
                    component: () => import('@/views/dashboard/formPanel/signalLightStrategy/signalLightGroupStrategyTypeMapping/form.vue')
                  }
                ]
              },
              {
                path: 'signal-light-child-strategy-schedule-mapping',
                name: '~fp~:signalLightStrategy:signalLightChildStrategyScheduleMapping',
                component: () => import('@/views/dashboard/formPanel/signalLightStrategy/signalLightChildStrategyScheduleMapping/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:signalLightStrategy:signalLightChildStrategyScheduleMapping:ins',
                    component: () => import('@/views/dashboard/formPanel/signalLightStrategy/signalLightChildStrategyScheduleMapping/form.vue')
                  }
                ]
              }
            ]
          },
          {
            path: 'runtime-diagram',
            name: '~fp~:runtimeDiagram',
            component: () => import('@/views/dashboard/formPanel/runtimeDiagram/index.vue')
          },
          {
            path: 'vehicle',
            name: '~fp~:vehicle',
            component: () => import('@/views/dashboard/formPanel/vehicle/index.vue'),
            children: [
              {
                path: 'trajectory',
                name: '~fp~:vehicle:trajectory',
                component: () => import('@/views/dashboard/formPanel/vehicle/trajectory/index.vue')
              }
            ]
          },
          {
            path: ':pathMatch(.*)*',
            redirect: '/dashboard'
          }
        ]
      },
      {
        path: ':pathMatch(.*)*',
        redirect: '/dashboard'
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/redirect/index.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

const currentConfig = adminConfig.currentConfig();

const whitelist = ['/login']
router.beforeEach((to, from, next) => {
  if (currentConfig.VITE_MODE === final.DEV) {
    console.info(from.path, `\n${to.path}`)
  }
  if (ifWebsiteLink(to.path, "/")) {
    return;
  }
  const sysStore = useSysStore();
  if (to.path === "/home") {
    sysStore.setCurrentSystem(null);
  }
  const name = sysStore.getCurrentSystem.name;
  document.title = publicConfig.APP_NAME + (name?` | ${name}` : '')
  const userStore = useUserStore();
  if (!userStore.ifLogin && whitelist.indexOf(to.path) === -1) {
    if (ifDashboardPage(to.path)) {
      next()
    } else {
      goToLogin()
    }
  } else {
    next()
  }
})

export default router
