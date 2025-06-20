<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { h, onBeforeUnmount, ref, watch, WatchHandle } from "vue";
import { arr2ToDiguiObj2, diguiRun } from "@/utils/baseUtils.ts";
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
const defaultExpandedKeys = ref<string[]>([])
const init = () => {
  const pathFragments = route.path.split('/').filter(_ => _);
  for (let i = 0; i < pathFragments.length; i++) {
    let s = ''
    for (let j = 0; j <= i; j++) {
      s += `/${pathFragments[j]}`
    }
    defaultExpandedKeys.value.push(s)
  }
  defaultExpandedKeys.value.sort(_ => -1)
}

const getRoutes = () => {
  const allRoutes = router.getRoutes();
  const routes = allRoutes.filter(route => route.path.startsWith('/dashboard/admin-panel/'));
  const allKeyLabels = new Map<string, string>();
  const _menuOptions: MenuOption[] = routes
      .sort((r1, r2) => Number(r1.meta.orderNum) - Number(r2.meta.orderNum))
      .map((route) => {
        const meta = route.meta as unknown as MenuDto;
        allKeyLabels.set(route.path, meta.label)
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
  const arr2ToDiguiObj1 = arr2ToDiguiObj2<MenuOption>(_menuOptions);
  diguiRun(
      arr2ToDiguiObj1,
      data => {
        if (data.obj.children && data.obj.children.length === 0) {
          delete data.obj.children
        }
        if (data.obj.children && data.obj.children.length > 0) {
          data.obj.label = allKeyLabels.get(`${data.obj.key}`)
        }
      }
  )
  menuOptions.value = arr2ToDiguiObj1
  init()
}
</script>

<template>
  <n-menu
      v-if="menuOptions.length > 0"
      :options="menuOptions"
      :indent="12"
      accordion
      :default-expanded-keys="defaultExpandedKeys"
      :default-value="defaultExpandedKeys[0]"
  />
</template>

<style scoped>
</style>
