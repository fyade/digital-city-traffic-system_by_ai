<script setup lang="ts">
import { ArrowBarToRight } from '@vicons/tabler'
import { useRoute, useRouter } from "vue-router";
import Layout from '@/views/dashboard/layout/index.vue';
import { provide, ref } from "vue";
import { goToAdminPanelSystem } from "@/views/dashboard/adminPanel/dashboardUtilFunc.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";

const route = useRoute()
const router = useRouter();

const adminPanelLoading = ref(true)
provide('dashboard::adminPanelLoading', adminPanelLoading)
const getRouters = async () => {
  adminPanelLoading.value = true
  try {
    await goToAdminPanelSystem(path => {
      if (route.path === '/dashboard/admin-panel' || route.path === '/dashboard/admin-panel/') {
        router.push(`/dashboard/admin-panel/${path}`)
      }
    })
  } finally {
    adminPanelLoading.value = false
  }
}
getRouters()
</script>

<template>
  <n-drawer
      show
      width="calc(100% - 10rem)"
      :show-mask="false"
  >
    <n-drawer-content>
      <template #header>
        <div class="title-row">
          <NIcon class="icon" @click="gotoDashboardHome">
            <ArrowBarToRight/>
          </NIcon>
          <span>管理端面板</span>
        </div>
      </template>
      <Layout
          v-loading="adminPanelLoading"
          element-loading-text="管理端面板加载中..."
          :admin-panel-loading="adminPanelLoading"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.title-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform .2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
