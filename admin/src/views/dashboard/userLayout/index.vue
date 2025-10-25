<script setup lang="ts">
import Sider from "@/views/dashboard/userLayout/sider.vue";
</script>

<template>
  <n-layout class="el" has-sider>
    <n-layout-sider bordered width="220px">
      <Sider/>
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
  background-color: var(--table-page-bg);
}
</style>