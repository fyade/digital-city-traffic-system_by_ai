<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import DataLayer from "@/views/dashboard/index/dataLayer.vue";
import SettingPanel from '@/views/dashboard/settingPanel/index.vue'
import DebugPanel from '@/views/dashboard/debugPanel/index.vue';
import { useSysStore } from "@/store/module/sys.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";

const sysStore = useSysStore();

onMounted(async () => {
  await init()
})
onBeforeUnmount(() => {
  useDashboardCesium.destroy()
})

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
const cesiumClass = ref(useDashboardCesium)

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 操作 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 初始化
 */
const init = async () => {
  console.info('开始加载');

  cesiumClass.value.setContainer('cesiumContainer')
  const viewer = cesiumClass.value.getViewer();
  if (!viewer) {
    return
  }

  await sysStore.refreshVisibleButton('sys:dcts')
  console.info('加载完成')
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// 设置抽屉
const settingDrawerActive = ref(false)
const openSettingLayerChange = () => {
  settingDrawerActive.value = true
}
// 调试面板抽屉
const debugDrawerActive = ref(false)
const openDebugLayerChange = () => {
  debugDrawerActive.value = true
}
</script>

<template>
  <DataLayer
      :labels="cesiumClass.allLabels"
      :current-time="cesiumClass.currentTime"
      @open-setting-layer-change="openSettingLayerChange"
      @open-debug-panel="openDebugLayerChange"
  />
  <div id="cesiumContainer"></div>

  <n-drawer v-model:show="settingDrawerActive" width="35rem">
    <n-drawer-content title="设置">
      <SettingPanel/>
    </n-drawer-content>
  </n-drawer>

  <n-drawer v-model:show="debugDrawerActive" width="35rem">
    <n-drawer-content title="调试面板">
      <DebugPanel/>
    </n-drawer-content>
  </n-drawer>

  <n-dropdown
      v-if="cesiumClass"
      v-model:show="cesiumClass.contextMenuShow"
      trigger="manual"
      placement="bottom-start"
      :x="cesiumClass.contextMenuXY[0]"
      :y="cesiumClass.contextMenuXY[1]"
      :options="cesiumClass.contextMenuOption"
      @select="cesiumClass.contextMenuSelect"
  />

  <router-view/>
</template>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
