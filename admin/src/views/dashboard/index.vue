<script setup lang="ts">
const themeOverrides = {
  Notification: {
    containerStyle: {
      pointerEvents: 'none'
    },
    style: {
      pointerEvents: 'auto'
    }
  }
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-notification-provider>
      <router-view/>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
