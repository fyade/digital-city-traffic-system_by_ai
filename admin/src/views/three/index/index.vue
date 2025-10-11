<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useDashboardThree } from "@/views/three/core/useDashboardThree.ts";

onMounted(async () => {
  await init()
})
onBeforeUnmount(() => {
  useDashboardThree.destroy()
})

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
const threeClass = useDashboardThree
const ifInited = ref(false)

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 操作 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 初始化
 */
const init = async () => {
  console.info('开始加载');

  threeClass.setContainer('threeContainer')

  console.info('加载完成')
  ifInited.value = true
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
</script>

<template>
  <div id="threeContainer"></div>
</template>

<style scoped>
#threeContainer {
  width: 100vw;
  height: 100vh;
}
</style>