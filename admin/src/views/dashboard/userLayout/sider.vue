<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";
import { MenuOption } from "naive-ui";
import { h, onMounted, ref } from 'vue'
import SvgIcon from "@/components/svgIcon/svgIcon.vue";
import { arr2ToDiguiObj2, diguiRun } from "@/utils/baseUtils.ts";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  getRoutes()
})

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
  const routes = router.getRoutes().filter(item => (item.path.startsWith('/dashboard/user-panel/') || item.path === '/dashboard/user-panel') && item.name)
  const allKeyLabels = new Map<string, string>();
  const parentKVs = new Map<string, string>()
  for (const route of routes) {
    for (const child of route.children) {
      parentKVs.set(child.name as string, route.name as string)
    }
  }
  const _menuOptions: MenuOption[] = routes
      .map((route) => {
        allKeyLabels.set(route.path, route.meta.label as string)
        return {
          id: route.name,
          parentId: parentKVs.get(route.name as string),
          label: () => h(
              RouterLink,
              {
                to: {
                  path: route.path
                }
              },
              {
                default: () => route.meta.label
              }),
          key: route.path,
          icon: () => h(SvgIcon, {name: route.meta.icon as string, color: 'var(--menu-icon-color)'})
        }
      })
  const arr2ToDiguiObj1 = arr2ToDiguiObj2<MenuOption>(_menuOptions, {defaultParent: '~dashboard/userPanel'});
  diguiRun(
      arr2ToDiguiObj1,
      data => {
        if (data.obj.children && data.obj.children.length === 0) {
          delete data.obj.children
        }
        if (data.obj.children && data.obj.children.length > 0) {
          data.obj.label = allKeyLabels.get(`${data.obj.key}`)
        }
      })
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