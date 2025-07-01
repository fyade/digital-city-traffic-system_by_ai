<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import DataLayer from "@/views/dashboard/index/dataLayer.vue";
import DebugPanel from '@/views/dashboard/debugPanel/index.vue';
import { DropdownOption } from "naive-ui";
import { UseCesium } from "@/views/dashboard/utils/useCesium.ts";
import { useSysStore } from "@/store/module/sys.ts";

const sysStore = useSysStore();

onMounted(async () => {
  await init()
})
onBeforeUnmount(async () => {
  await destroy()
})

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
const cesiumContainer = useTemplateRef<HTMLDivElement>("cesiumContainer");
const cesiumClass = ref<UseCesium | null>(null);

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 操作 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 初始化
 */
const init = async () => {
  console.info('开始加载');

  const useCesium = new UseCesium({container: 'cesiumContainer'});
  const viewer = useCesium.getViewer();
  cesiumClass.value = useCesium;
  if (!viewer || !cesiumClass.value) {
    return
  }

  console.info('加载完成')
  await sysStore.refreshVisibleButton('sys:dcts')
}
/**
 * 销毁
 */
const destroy = async () => {
  cesiumClass.value?.destroy()
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

const contextMenuSelect = (key: string, obj: DropdownOption) => {
  if (cesiumClass.value)
    cesiumClass.value.formPanelTitle = obj?.label as string
  if (cesiumClass.value?.contextMenus) {
    const find = cesiumClass.value.contextMenus.find(item => item.id === key);
    if (find) find.func()
  }
}
</script>

<template>
  <DataLayer
      v-if="cesiumClass"
      :labels="cesiumClass.allLabels"
      @open-setting-layer-change="openSettingLayerChange"
      @open-debug-panel="openDebugLayerChange"
  />
  <div id="cesiumContainer" ref="cesiumContainer"></div>

  <n-drawer v-model:show="settingDrawerActive" width="50rem">
    <n-drawer-content title="设置">
      设置
    </n-drawer-content>
  </n-drawer>

  <n-drawer v-model:show="debugDrawerActive" width="50rem">
    <n-drawer-content title="调试面板">
      <DebugPanel/>
    </n-drawer-content>
  </n-drawer>

  <n-dropdown
      v-if="cesiumClass"
      v-model:show="cesiumClass.contextMenuShow"
      trigger="manual"
      :x="cesiumClass.contextMenuXY[0]"
      :y="cesiumClass.contextMenuXY[1]"
      :options="cesiumClass.contextMenuOption"
      @select="contextMenuSelect"
  />

  <router-view/>
</template>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
