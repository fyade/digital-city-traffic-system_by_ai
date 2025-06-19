<script setup lang="ts">
import Sider from "@/views/dashboard/layout/sider.vue";

const props = defineProps({
  adminPanelLoading: {
    type: Boolean,
    required: true,
  }
});
</script>

<template>
  <n-layout class="el" has-sider>
    <n-layout-sider bordered width="220px">
      <Sider :admin-panel-loading="props.adminPanelLoading"/>
    </n-layout-sider>
    <n-layout content-class="my-dashboard-layout-content" :native-scrollbar="false">
      <router-view/>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.el {
  height: 100%;
}
</style>

<style>
.my-dashboard-layout-content {
  padding: 24px;
  height: 100%;
  background-color: #f1f2f6;
}
</style>
