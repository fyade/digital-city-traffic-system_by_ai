<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'

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
  <n-config-provider
      :theme-overrides="themeOverrides"
      :locale="zhCN"
      :date-locale="dateZhCN"
  >
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view/>
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>
</style>
