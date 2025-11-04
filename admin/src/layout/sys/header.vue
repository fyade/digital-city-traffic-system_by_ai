<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { RouteRecordNormalized, RouteRecordRaw, useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { useRouterStore } from "@/store/module/router.ts";
import { useUserStore } from '@/store/module/user';
import { fileBaseUrl } from "@/api/request.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { gotoDashboardHome, gotoThreeHome } from "@/views/dashboard/utils/base.ts";
import { useSysConfigStore } from "@/store/module/sysConfig.ts";
import { base } from "@dcts/common";
import { getCurrentUserInfo } from "@/identity/utils/identityUtils.ts";

const props = defineProps({
  ifShowBreadcrumb: {
    type: Boolean,
    default: true
  }
});

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const sysStore = useSysStore();
const sysConfigStore = useSysConfigStore();

const userInfo = computed(() => {
  const currentUserInfo = getCurrentUserInfo();
  const ret = {
    _loginRole: '',
    avatar: currentUserInfo.avatar,
    nickname: currentUserInfo.nickname,
  }
  const v = base.loginRoleDict[userStore.loginRole as base.LoginRoleEnum];
  if (v) {
    ret._loginRole = v;
  }
  return ret;
})

const list = ref<(RouteRecordNormalized | RouteRecordRaw)[]>([])

const routes = ref<RouteRecordNormalized[]>([])
const ifShowFirstBreadcrumb = ref(false)
if (props.ifShowBreadcrumb) {
  const routerStore = useRouterStore();
  watch(() => route.path, () => {
    const menus = routerStore.allMenus2.find(item => item.path === route.path)
    if (menus) {
      ifShowFirstBreadcrumb.value = true
      list.value = menus.ar
    } else {
      ifShowFirstBreadcrumb.value = false
      list.value = []
      if (routes.value.length === 0) {
        routes.value = router.getRoutes()
      }
      const paths = route.path.split('/').filter(t => t).map(t => `/${t}`);
      for (let i = 0; i < paths.length; i++) {
        if (list.value.length === 0) {
          const find = routes.value.find(item => item.path === paths[i]);
          if (find) {
            list.value.push(find)
          }
        } else {
          const children = list.value[list.value.length - 1].children;
          if (children) {
            const find1 = children.find(item => item.path === paths[i].replace('/', ''));
            if (find1) {
              list.value.push(find1)
            }
          }
        }
      }
    }
  }, {
    immediate: true
  })
}
</script>

<template>
  <div class="header">
    <div class="left">
      <span>logo</span>
      <el-breadcrumb v-if="props.ifShowBreadcrumb" :separator-icon="ArrowRight">
        <el-breadcrumb-item class="el-breadcrumb-item" to="/">控制台主页</el-breadcrumb-item>
        <el-breadcrumb-item
            v-if="ifShowFirstBreadcrumb"
            class="el-breadcrumb-item"
            :to="`/${sysStore.getCurrentSystem.path}`"
        >
          {{ sysStore.getCurrentSystem.name }}
        </el-breadcrumb-item>
        <el-breadcrumb-item
            class="el-breadcrumb-item"
            v-for="(item, index) in list"
            :key="index"
            :to="`/${(list.slice(0, index + 1).map(itm => itm.path.indexOf('/') === 0 ? itm.path.replace('/', '') : itm.path)).join('/').replace(/\/+/g, '/')}`"
        >
          {{ item.meta ? item.meta.label : item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="center"></div>
    <div class="right">
      <el-button link @click="gotoDashboardHome" style="text-decoration: underline;">前往地图大屏端</el-button>
      <el-button link @click="gotoThreeHome" style="text-decoration: underline;margin-left: 0;">前往三维端</el-button>
      <el-dropdown>
        <SvgIcon name="theme" color="var(--menu-icon-color)"/>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="key in base.ColorStyleEnum" :key="key" @click="sysConfigStore.setColorStyle(key)">
              <span>{{ base.colorStyleDict[key] }}</span>
              <span v-if="sysConfigStore.getColorStyle() === key">[当前]</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <div style="display: flex;align-items: center;gap: 8px;">
          <el-image
              style="width: 30px;height: 30px;border-radius: 8px;"
              v-if="userInfo.avatar"
              :src="sysStore.urlAddAuth(fileBaseUrl+userInfo.avatar)"
              fit="contain"
          ></el-image>
          <SvgIcon v-else name="user" color="var(--menu-icon-color)"/>
          <span>{{ userInfo.nickname }}</span>
          <span>(登录身份：{{ userInfo._loginRole }})</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div @click="router.push('/user')">个人中心</div>
            </el-dropdown-item>
            <el-dropdown-item @click="userStore.logOut">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 10px * 2);
  height: calc(100% - 1px);
  border-bottom: var(--table-page-layout-border);
  padding: 0 10px;

  a {
    color: #000;
  }

  > * {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  > .left {
  }

  > .center {
  }

  > .right {
    > * {
      cursor: pointer;
    }
  }
}
</style>