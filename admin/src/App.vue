<script setup lang="ts">
import { BCService } from "@/services/broadcastChannel.ts";
import { useUserStore } from "@/store/module/user.ts";
import { ElMessageBox } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { darkTheme, dateZhCN, GlobalThemeOverrides, lightTheme, zhCN } from 'naive-ui'
import { useSysConfigStore } from "@/store/module/sysConfig.ts";
import { ref, watch } from "vue";
import { reCreateDiscrete } from "@/utils/naiveBase.ts";
import { useDark, useToggle } from "@vueuse/core";
import { base } from "@dcts/common";

const userStore = useUserStore();
const sysConfigStore = useSysConfigStore();

const isDark = useDark();
const toggleDark = useToggle(isDark);

const themeOverrides: GlobalThemeOverrides = {
  Notification: {
    containerStyle: {
      pointerEvents: 'none'
    },
    style: {
      pointerEvents: 'auto'
    }
  }
}
const nTheme = ref<typeof lightTheme | typeof darkTheme | null>(null)

watch(
  () => sysConfigStore.getColorStyle(),
  () => {
    const colorStyle = sysConfigStore.getColorStyle();
    switch (colorStyle) {
      case base.ColorStyleEnum.T_LIGHT:
        nTheme.value = lightTheme
        toggleDark(false);
        break;
      case base.ColorStyleEnum.T_DARK:
        nTheme.value = darkTheme
        toggleDark(true);
        break;
    }
    reCreateDiscrete(nTheme.value)
  },
  {
    immediate: true,
  },
);

BCService.on("login", (data) => {
  let username_ = "";
  if (userStore.loginRole === base.LoginRoleEnum.admin)
    username_ = userStore.userinfo.admin!.username;
  if (userStore.loginRole === base.LoginRoleEnum.visitor)
    username_ = userStore.userinfo.visitor!.username;
  if (
    userStore.ifLogin &&
    (data.username !== username_ || data.loginRole !== userStore.loginRole)
  ) {
    ElMessageBox.alert(
      "在其他标签页有其他用户登录，当前标签页用户即将退出。",
      "警告",
    ).finally(() => {
      userStore.logOut();
    });
  }
});
</script>

<template>
  <div class="el">
    <el-config-provider
        :locale="zhCn"
        :z-index="999999"
    >
      <n-config-provider
          :theme-overrides="themeOverrides"
          :locale="zhCN"
          :date-locale="dateZhCN"
          :theme="nTheme"
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
