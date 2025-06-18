<script setup lang="ts">
import { getPages, getSystems } from "@/api/common/sys.ts";
import { ArrowBarToRight } from '@vicons/tabler'
import { useRouter } from "vue-router";
import Layout from '@/views/dashboard/layout/index.vue';
import { ref } from "vue";

const router = useRouter();

const adminPanelLoading = ref(false)
const getRouters = async () => {
  adminPanelLoading.value = true
  try {
    const systems = await getSystems()
    const system = systems.find(item => item.perms === 'sys:dcts');
    if (system) {
      const pages = await getPages(system.id)
      console.log(pages)
    }
  } finally {
    adminPanelLoading.value = false
  }
}
getRouters()

const closeAdminPanel = () => {
  router.push('/dashboard')
}
</script>

<template>
  <n-drawer show width="calc(100% - 10rem)">
    <n-drawer-content>
      <template #header>
        <div class="title-row">
          <n-icon class="icon" @click="closeAdminPanel">
            <ArrowBarToRight/>
          </n-icon>
          <span>管理员面板</span>
        </div>
      </template>
      <Layout v-loading="adminPanelLoading" element-loading-text="管理员面板加载中..."/>
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

    &:hover {
      background-color: #eee;
    }
  }
}
</style>
