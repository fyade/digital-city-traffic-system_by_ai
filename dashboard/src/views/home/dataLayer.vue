<script setup lang="ts">
import { dashboardConfig } from "@dcts/config";

const props = defineProps({
  imgFromCompany: {
    type: String,
    required: true
  },
  imgFromUrl: {
    type: String,
    required: true
  },
  roadFromCompany: {
    type: String,
    required: true
  },
  roadFromUrl: {
    type: String,
    required: true
  },
});
const emits = defineEmits(['openLayerChange']);

const goto = (url: string) => {
  window.open(url);
}
const sz = () => {
  emits('openLayerChange')
}
</script>

<template>
  <div class="data-layer">
    <div class="footer">
      <!--<p>因瓦片调用额度限制，若地图加载异常，请切换图层或次日重试。</p>-->
      <p>v{{ dashboardConfig.currentVersion }}</p>
      <p>影像底图来自<span @click="goto(props.imgFromUrl)">{{ props.imgFromCompany }}</span></p>
      <p>路网数据来自<span @click="goto(props.roadFromUrl)">{{ props.roadFromCompany }}</span></p>
      <p @click="sz"><span class="no-underline">设置</span></p>
      <p><span class="no-underline">管理员工具</span></p>
      <p><span class="no-underline">登录</span></p>
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

      &.no-underline {
        text-decoration: none;
      }
    }
  }
}
</style>
