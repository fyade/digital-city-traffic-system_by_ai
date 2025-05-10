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
      <p>因瓦片调用额度限制，若地图加载异常，请切换图层或次日重试。</p>
      <p>v{{ currentVersion }}</p>
      <p>影像底图来源<span @click="goto('https://www.tianditu.gov.cn/')">天地图</span></p>
      <p>影像注记来源<span @click="goto('https://www.tianditu.gov.cn/')">天地图</span></p>
      <p>路网数据来源<span @click="goto('https://www.openstreetmap.org/')">OpenStreetMap</span></p>
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
    bottom: 12px;
    left: 12px;
    width: calc(100% - 12px * 2);
    height: 0;
    transform: translateY(-12px);
    display: flex;
    gap: 12px;
    color: #fff;
    font-size: 12px;

    p {
      line-height: 12px;
    }

    span {
      text-decoration: underline;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
