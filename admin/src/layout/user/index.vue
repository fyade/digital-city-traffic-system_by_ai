<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PublicIndex from "@/layout/publicIndex.vue";
import { CONFIG } from "@/utils/base.ts";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const defaultActive = ref('')
watch(route, () => {
  defaultActive.value = route.path
}, {
  immediate: true
})

const routeOfUser = router.getRoutes().find(item => item.name === '~user');
const menus = routeOfUser ? routeOfUser.children.map(item => ({
  index: `/user/${item.path}`,
  icon: item.meta ? `${item.meta.icon}` : '',
  label: item.meta ? `${item.meta.label}` : '',
})) : []
const menuIndex = computed(() => {
  return menus.findIndex(itm => itm.index === defaultActive.value)
})
</script>

<template>
  <PublicIndex>
    <el-container class="el">
      <el-aside class="left" width="200px">
        <el-menu :default-active="defaultActive" :collapse="false" :unique-opened="true" router>
          <el-menu-item v-for="(item, index) in menus" :key="index" :index="item.index">
            <el-space class="elSpace">
              <SvgIcon :name="item.icon" color="var(--menu-icon-color)"/>
              <span>{{ item.label }}</span>
            </el-space>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="right">
        <router-view #default="{Component:c2,route:r2}">
          <Transition name="component-switch" mode="out-in" appear>
            <RootWrapper :key="r2.path">
              <component :is="c2"/>
            </RootWrapper>
          </Transition>
        </router-view>
      </el-main>
    </el-container>
  </PublicIndex>
</template>

<style scoped>
.el {
  display: flex;
  justify-content: center;
  height: 100%;

  > .left {
    flex: none;
    width: 200px;
    height: 100%;

    > * {
      height: 100%;
    }
  }

  > .right {
    flex: auto;
    padding: 8px;
    min-width: 600px;
    max-width: 1000px;
  }
}
</style>