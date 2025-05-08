import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '/',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: '/home',
        component: () => import('@/views/home/index.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
