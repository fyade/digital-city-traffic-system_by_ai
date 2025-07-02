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
      <n-dialog-provider>
        <router-view/>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
