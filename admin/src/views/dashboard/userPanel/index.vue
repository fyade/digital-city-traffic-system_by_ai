<script setup lang="ts">
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { ArrowBarToRight } from "@vicons/tabler";
import UserLayout from '@/views/dashboard/userLayout/index.vue'
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
          <span>用户端面板</span>
        </div>
      </template>
      <UserLayout/>
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