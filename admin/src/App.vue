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
import { getCurrentUserInfo } from "@/identity/utils/identityUtils.ts";

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

const setToLight = () => {
  nTheme.value = lightTheme;
  toggleDark(false);
  reCreateDiscrete(nTheme.value);
}
const setToDark = () => {
  nTheme.value = darkTheme;
  toggleDark(true);
  reCreateDiscrete(nTheme.value);
}

const matchMedia = window.matchMedia("(prefers-color-scheme: light)");
const eventListener = (e: MediaQueryListEventMap["change"]) => {
  if (e.matches) {
    setToLight()
  } else {
    setToDark()
  }
}

watch(
    () => sysConfigStore.getColorStyle(),
    () => {
      const colorStyle = sysConfigStore.getColorStyle();
      matchMedia.removeEventListener('change', eventListener)
      switch (colorStyle) {
        case base.ColorStyleEnum.T_LIGHT:
          setToLight()
          break;
        case base.ColorStyleEnum.T_DARK:
          setToDark()
          break;
        case base.ColorStyleEnum.T_INHERIT:
          matchMedia.addEventListener('change', eventListener)
          if (matchMedia.matches) {
            setToLight()
          } else {
            setToDark()
          }
          break;
      }
    },
    {
      immediate: true,
    },
);

BCService.on("login", (data) => {
  let username_ = getCurrentUserInfo().username;
  if (userStore.ifLogin && (data.username !== username_ || data.loginRole !== userStore.loginRole)) {
    ElMessageBox.alert("在其他标签页有其他用户登录，当前标签页用户即将退出。", "警告").finally(() => {
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
