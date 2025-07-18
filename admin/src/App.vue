<script setup lang="ts">
import { CONFIG } from "@/utils/base.ts";
import { BCService } from "@/services/broadcastChannel.ts";
import { useUserStore } from "@/store/module/user.ts";
import { ElMessageBox } from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
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

const userStore = useUserStore()

BCService.on('login', (data) => {
  let username_ = '';
  if (userStore.loginRole === 'admin') username_ = userStore.userinfo.admin!.username;
  if (userStore.loginRole === 'visitor') username_ = userStore.userinfo.visitor!.username;
  if (userStore.ifLogin && (data.username !== username_ || data.loginRole !== userStore.loginRole)) {
    ElMessageBox.alert(
        '在其他标签页有其他用户登录，当前标签页用户即将退出。',
        '警告',
    ).finally(() => {
      userStore.logOut()
    })
  }
})
</script>

<template>
  <div
      class="el"
      :style="{
        '--theme-color-menu-bg-active': `${CONFIG.theme_color_menu_bg_active}`,
        '--theme-color-menu-bg-active-lighten': `${CONFIG.theme_color_menu_bg_active_lighten}`,
        '--theme-color-menu-color': `${CONFIG.theme_color_menu_color}`,
        '--theme-color-main-bg': `${CONFIG.theme_color_main_bg}`,
      }"
  >
    <el-config-provider
        :locale="zhCn"
        :z-index="999999"
    >
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
    </el-config-provider>
  </div>
</template>

<style scoped>
.el {
  width: 100%;
  height: 100%;

  > .n-config-provider {
    width: 100%;
    height: 100%;
  }
}
</style>
