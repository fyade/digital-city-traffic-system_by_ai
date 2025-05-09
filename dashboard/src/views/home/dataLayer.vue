<script setup lang="ts">
import { dashboardConfig } from "@dcts/config";

const currentVersion = dashboardConfig.currentVersion;

const goto = (url: string) => {
  window.open(url);
}
</script>

<template>
  <div class="data-layer">
    <div class="footer">
      <p>v{{ currentVersion }}</p>
      <p>影像底图来源：<span @click="goto('https://www.tianditu.gov.cn/')">天地图</span></p>
      <p>影像注记来源：<span @click="goto('https://www.tianditu.gov.cn/')">天地图</span></p>
      <p>路网数据来源：<span @click="goto('https://www.openstreetmap.org/')">OpenStreetMap</span></p>
    </div>
  </div>
</template>

<style scoped>
.data-layer {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }

  > .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    gap: 12px;
    padding: 8px;
    color: #fff;
    font-size: 12px;

    span {
      cursor: pointer;
    }
  }
}
</style>
