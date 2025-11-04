import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store/module/user.ts";
import { ifWebsiteLink } from "@/utils/LinkUtils.ts";
import { adminConfig, publicConfig } from "@dcts/config";
import { goToLogin } from "@/utils/baseUtils.ts";
import { ifDashboardPage, ifThreePage } from "@/utils/DashboardUtils.ts";
import { final } from "@/utils/base.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";

const routes: RouteRecordRaw[] = [
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
    component: () => import('@/views/user/login2.vue')
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
        path: 'user-panel',
        name: '~dashboard/userPanel',
        component: () => import('@/views/dashboard/userPanel/index.vue'),
        children: [
          {
            path: 'airspace',
            name: '~dashboard/userPanel/airspace',
            meta: {
              label: '空域管理',
              icon: 'road',
            },
            children: [
              {
                path: 'user-flight-restriction-zone-user-apply',
                name: '~dashboard/userPanel/airspace/userFlightRestrictionZoneUserApply',
                meta: {
                  label: '我的空域申请',
                  icon: 'road',
                },
                component: () => import('@/views/module/dcts/airspace/userFlightRestrictionZoneUserApply/index.vue')
              },
              {
                path: 'user-flight-route-user-apply',
                name: '~dashboard/userPanel/airspace/userFlightRouteUserApply',
                meta: {
                  label: '我的航线申请',
                  icon: 'road'
                },
                component: () => import('@/views/module/dcts/airspace/userFlightRouteUserApply/index.vue')
              }
            ]
          },
          {
            path: 'aircraft-manage',
            name: '~dashboard/userPanel/aircraftManage',
            meta: {
              label: '航空器管理',
              icon: 'road',
            },
            children: [
              {
                path: 'user-low-altitude-aircraft',
                name: '~dashboard/userPanel/aircraftManage/userLowAltitudeAircraft',
                meta: {
                  label: '我的低空航空器管理',
                  icon: 'road',
                },
                component: () => import('@/views/module/dcts/aircraftManage/userLowAltitudeAircraft/index.vue')
              }
            ]
          },
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
            path: 'runtime-diagram',
            name: '~fp~:runtimeDiagram',
            component: () => import('@/views/dashboard/formPanel/runtimeDiagram/index.vue')
          },
          {
            path: 'airspace',
            name: '~fp~:airspace',
            component: () => import('@/views/dashboard/formPanel/airspace/index.vue'),
            children: [
              {
                path: 'flight-restriction-zone',
                name: '~fp~:airspace:flightRestrictionZone',
                component: () => import('@/views/dashboard/formPanel/airspace/flightRestrictionZone/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:airspace:flightRestrictionZone:ins',
                    component: () => import('@/views/dashboard/formPanel/airspace/flightRestrictionZone/form.vue')
                  },
                  {
                    path: 'upd',
                    name: '~fp~:airspace:flightRestrictionZone:upd',
                    component: () => import('@/views/dashboard/formPanel/airspace/flightRestrictionZone/form.vue')
                  },
                  {
                    path: 'del',
                    name: '~fp~:airspace:flightRestrictionZone:del',
                    component: () => import('@/views/dashboard/formPanel/airspace/flightRestrictionZone/form.vue')
                  }
                ]
              },
              {
                path: 'flight-route',
                name: '~fp~:airspace:flightRoute',
                component: () => import('@/views/dashboard/formPanel/airspace/flightRoute/index.vue'),
                children: [
                  {
                    path: 'ins',
                    name: '~fp~:airspace:flightRoute:ins',
                    component: () => import('@/views/dashboard/formPanel/airspace/flightRoute/form.vue')
                  },
                  {
                    path: 'upd',
                    name: '~fp~:airspace:flightRoute:upd',
                    component: () => import('@/views/dashboard/formPanel/airspace/flightRoute/form.vue')
                  },
                  {
                    path: 'del',
                    name: '~fp~:airspace:flightRoute:del',
                    component: () => import('@/views/dashboard/formPanel/airspace/flightRoute/form.vue')
                  }
                ]
              }
            ]
          },
          {
            path: 'apply-airspace',
            name: '~fp~:applyAirspace',
            component: () => import('@/views/dashboard/formPanel/applyAirspace/index.vue')
          },
          {
            path: 'apply-flight-route',
            name: '~fp~:applyFlightRoute',
            component: () => import('@/views/dashboard/formPanel/applyFlightRoute/index.vue')
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
    path: '/three',
    name: '~three',
    component: () => import('@/views/three/index/index.vue'),
    children: [
      {
        path: ':pathMatch(.*)*',
        redirect: '/three'
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
    console.info(from.fullPath, `\n${to.fullPath}`)
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
  let ifOtherPage = '';
  if (ifDashboardPage(to.path)) {
    ifOtherPage = '地图大屏端';
  } else if (ifThreePage(to.path)) {
    ifOtherPage = '三维端';
  }
  if (ifOtherPage) {
    document.title = publicConfig.APP_NAME + ` | ${ifOtherPage}`;
  }
  const userStore = useUserStore();
  if (
      userStore.getLoginType() === 'user'
      && (
          ['/home'].includes(to.path)
          || ['/main/', '/algorithm/', '/dcts/'].some(path => to.path.startsWith(path))
      )
  ) {
    gotoDashboardHome()
  }
  if (!userStore.ifLogin && whitelist.indexOf(to.path) === -1) {
    if (ifOtherPage) {
      next()
    } else {
      goToLogin()
    }
  } else {
    next()
  }
})

export default router
