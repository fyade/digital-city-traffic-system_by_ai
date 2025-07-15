<script setup lang="ts">
import { dashboardConfig } from "@dcts/config";
import { goToLogin } from "@/utils/baseUtils.ts";
import { useUserStore } from "@/store/module/user.ts";
import { useRouter } from "vue-router";
import { timeUtils } from "@dcts/common";

const router = useRouter()
const userStore = useUserStore();
const props = defineProps({
  labels: {
    type: Array<Array<string>>,
    required: true
  },
  currentTime: {
    type: Number,
    required: true
  }
});
const emits = defineEmits(['openSettingLayerChange', 'openDebugPanel']);

const goAdminPanel = () => {
  router.push('/dashboard/admin-panel');
}
const goHome = () => {
  router.push('/');
}
</script>

<template>
  <div class="data-layer">
    <div class="footer">
      <!--<p>因瓦片调用额度限制，若地图加载异常，请切换图层或次日重试。</p>-->
      <p>v{{ dashboardConfig.currentVersion }}</p>
      <p>{{ timeUtils.formatDate(new Date(props.currentTime)) }}</p>
      <a href="https://beian.miit.gov.cn" target="_blank"><span>苏ICP备2023025698号-1</span></a>
      <p v-for="(item, index) in props.labels" :key="index">
        {{ item[0] }}来自<a :href="item[2]" target="_blank">{{ item[1] }}</a>
      </p>
      <!--<p @click="emits('openSettingLayerChange')"><span class="no-underline">设置</span></p>-->
      <p v-if="!userStore.ifLogin" @click="goToLogin"><span class="no-underline">登录</span></p>
      <p v-if="userStore.ifLogin" @click="userStore.logOut(false)"><span class="no-underline">退出登录</span></p>
      <p v-if="userStore.ifLogin" @click="goAdminPanel"><span class="no-underline">管理端面板</span></p>
      <p v-if="userStore.ifLogin" @click="goHome"><span class="no-underline">前往管理端</span></p>
      <p v-if="userStore.ifLogin" @click="emits('openDebugPanel')"><span class="no-underline">调试面板</span></p>
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
    left: 8px;
    width: calc(100% - 12px * 2);
    height: 0;
    transform: translateY(-12px);
    display: flex;
    gap: 4px;
    color: #fff;
    font-size: 12px;

    > * {
      padding: 0 4px;
    }

    a, p {
      color: inherit;
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
