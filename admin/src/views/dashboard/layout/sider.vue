<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { h, onBeforeUnmount, ref, watch, WatchHandle } from "vue";
import { arr2ToDiguiObj, diguiRun } from "@/utils/baseUtils.ts";
import { MenuDto } from "@/type/module/main/sysManage/menu.ts";
import SvgIcon from "@/components/svgIcon/svgIcon.vue";

const route = useRoute();
const router = useRouter();
const props = defineProps({
  adminPanelLoading: {
    type: Boolean,
    required: true,
  }
});
onBeforeUnmount(() => {
  if (watchHandle) {
    watchHandle()
  }
})

let watchHandle: WatchHandle | null = null
watchHandle = watch(() => props.adminPanelLoading, (newVal) => {
  if (!newVal) {
    getRoutes()
    if (watchHandle) {
      watchHandle()
    }
  }
}, {immediate: false});

const menuOptions = ref<MenuOption[]>([])
const defaultExpandedKeys: string[] = []
const init = () => {
  const pathFragments = route.path.split('/').filter(_ => _);
  for (let i = 0; i < pathFragments.length; i++) {
    let s = ''
    for (let j = 0; j <= i; j++) {
      s += `/${pathFragments[j]}`
    }
    defaultExpandedKeys.push(s)
  }
  defaultExpandedKeys.sort(_ => -1)
}
init()

const getRoutes = () => {
  const allRoutes = router.getRoutes();
  const routes = allRoutes.filter(route => route.path.startsWith('/dashboard/admin-panel/'));
  const routesSimple = routes
      .sort((r1, r2) => Number(r1.meta.orderNum) - Number(r2.meta.orderNum))
      .map((route) => {
        const meta = route.meta as unknown as MenuDto;
        return {
          id: meta.id,
          parentId: meta.parentId,
          label: () => h(
              RouterLink,
              {
                to:
                    {
                      path: route.path
                    }
              },
              {
                default: () => meta.label
              }),
          key: route.path,
          icon: () => h(SvgIcon, {name: meta.icon, color: '#000'}),
        }
      })
  const arr2ToDiguiObj1 = arr2ToDiguiObj<typeof routesSimple[0]>(routesSimple);
  diguiRun(
      arr2ToDiguiObj1,
      data => {
        if (data.obj.children && (data.obj.children as unknown as typeof routesSimple).length === 0) {
          delete data.obj.children
        }
      }
  )
  for (const arr2ToDiguiObj1Element of arr2ToDiguiObj1) {
    menuOptions.value.push(arr2ToDiguiObj1Element)
  }
}
</script>

<template>
  <n-menu
      :options="menuOptions"
      :indent="12"
      accordion
      :default-expanded-keys="defaultExpandedKeys"
      :default-value="defaultExpandedKeys[0]"
  />
</template>

<style scoped>
</style>
