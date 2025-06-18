<script setup lang="ts">
import Sider from "@/views/dashboard/layout/sider.vue";
</script>

<template>
  <n-layout class="el" has-sider>
    <n-layout-sider bordered>
      <Sider/>
    </n-layout-sider>
    <n-layout content-style="padding: 24px;" :native-scrollbar="false">
      <router-view/>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.el {
  height: 100%;
}
</style>
