import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store/module/user.ts";
import { ifWebsiteLink } from "@/utils/LinkUtils.ts";
import { adminConfig } from "@dcts/config";

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
    component: () => import('@/views/dashboard/index.vue'),
    children: [
      {
        path: '',
        name: '~dashboard/',
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
                  }
                ]
              },
              {
                path: ':pathMatch(.*)*',
                redirect: '/dashboard'
              }
            ]
          }
        ]
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
  if (currentConfig.VITE_MODE === 'dev') {
    console.log(to.path, from.path)
  }
  if (ifWebsiteLink(to.path, '/')) {
    return
  }
  const userStore = useUserStore();
  if (!userStore.ifLogin && whitelist.indexOf(to.path) === -1) {
    if (to.path.startsWith('/dashboard/') || to.fullPath === '/dashboard') {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  } else {
    next()
  }
})

export default router
