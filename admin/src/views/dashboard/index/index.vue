<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import DataLayer from "@/views/dashboard/index/dataLayer.vue";
import DebugPanel from '@/views/dashboard/debugPanel/index.vue';
import { useSysStore } from "@/store/module/sys.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import EntityHub from "@/views/dashboard/index/entityHub.vue";
import { ContextMenuOptionType } from "@/views/dashboard/functionModules/constant.ts";

const sysStore = useSysStore();

onMounted(async () => {
  await init()
})
onBeforeUnmount(() => {
  useDashboardCesium.destroy()
})

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
const cesiumClass = useDashboardCesium
const ifInited = ref(false)

const allLabels = ref<string[][]>([])
cesiumClass.setSetAllLabelsCB(data => allLabels.value = data)
const currentTime = ref(0)
cesiumClass.setSetCurrentTimeCB(data => currentTime.value = data)
const contextMenuShow = ref(false)
cesiumClass.setSetContextMenuShowCB(data => contextMenuShow.value = data)
const contextMenuXY = ref<[number, number]>([0, 0])
cesiumClass.setSetContextMenuXYCB(data => contextMenuXY.value = data)
const contextMenuOption = ref<ContextMenuOptionType>([])
cesiumClass.setSetContextMenuOptionCB(data => contextMenuOption.value = data)

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 操作 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 初始化
 */
const init = async () => {
  console.info('开始加载');

  cesiumClass.setContainer('cesiumContainer')
  cesiumClass.init2()

  await sysStore.refreshVisibleButton('sys:dcts')
  console.info('加载完成')
  ifInited.value = true
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// 调试面板抽屉
const debugDrawerActive = ref(false)
const openDebugLayerChange = () => {
  debugDrawerActive.value = true
}

const refreshServerTime = () => {
  cesiumClass.refreshServerTime()
}
</script>

<template>
  <DataLayer
      :labels="allLabels"
      :current-time="currentTime"
      @open-debug-panel="openDebugLayerChange"
  />
  <div id="cesiumContainer"></div>

  <n-drawer v-model:show="debugDrawerActive" :auto-focus="false" width="35rem">
    <n-drawer-content title="调试面板">
      <DebugPanel/>
    </n-drawer-content>
  </n-drawer>

  <n-dropdown
      v-model:show="contextMenuShow"
      trigger="manual"
      placement="bottom-start"
      :x="contextMenuXY[0]"
      :y="contextMenuXY[1]"
      :options="contextMenuOption"
      @select="cesiumClass.contextMenuSelect"
  />

  <EntityHub/>

  <div class="button1">
    <el-button @click="refreshServerTime">点此同步服务器时间</el-button>
  </div>

  <template v-if="ifInited">
    <router-view/>
  </template>
</template>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}

.button1 {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 28px;
  line-height: 28px;
}
</style>
