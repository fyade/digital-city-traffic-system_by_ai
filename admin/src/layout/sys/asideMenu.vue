<script setup lang="ts">
import { final } from "@/utils/base.ts";
import { computed } from "vue";
import { type RouteRecord, RouteRecordNormalized, RouteRecordRaw, useRoute } from "vue-router";
import { useSysConfigStore } from "@/store/module/sysConfig.ts";
import { objectUtils } from "@dcts/common";

const route = useRoute()
const props = defineProps({
  menus: {
    type: Array as () => RouteRecord[],
    required: true
  },
  parentPath: {
    type: String,
    default: ''
  }
});
const menus2 = computed(() => {
  return props.menus.toSorted((a, b) => {
    return (objectUtils.ifValid(a.meta.orderNum) && typeof a.meta.orderNum === 'number' ? a.meta.orderNum : 0) - (objectUtils.ifValid(b.meta.orderNum) && typeof b.meta.orderNum === 'number' ? b.meta.orderNum : 0)
  }).filter(item => item.meta.ifVisible === final.Y)
})
const emits = defineEmits(['gotoMenu']);

const menuClick = (path: string, ifLink: boolean = false, i = 0) => {
  if (ifLink) {
    openSite(path)
  } else {
    emits('gotoMenu', i > 0 ? path : `${props.parentPath}/${path}`.replace(/\/{2,}/g, '/'), ifLink, ++i)
  }
}
const openSite = (item: string) => window.open(item.replace('/http', 'http'))

const sysConfigStore = useSysConfigStore();
const ifParentMenuItem = (item: RouteRecordNormalized) => {
  return item.meta.parentId === final.DEFAULT_PARENT_ID || objectUtils.ifUndefined(item.meta.parentId) || objectUtils.ifNull(item.meta.parentId)
}
</script>

<template>
  <div
      class="asideMenu"
      v-for="(item, index) in menus2"
      :key="index"
  >
    <template v-if="item.children && item.children?.length > 0">
      <el-sub-menu
          class="elSubMenu"
          :index="`${props.parentPath}/${item.path}`.replace(/\/{2,}/g, '/')"
      >
        <template #title>
          <template v-if="sysConfigStore.getMenuCollapse()&&ifParentMenuItem(item)">
            <SvgIcon :name="item.meta.icon as string" color="var(--menu-icon-color)"/>
          </template>
          <el-space v-else class="elSpace">
            <SvgIcon :name="item.meta.icon as string" color="var(--menu-icon-color)"/>
            <span>{{ item.meta ? item.meta.label : item.name }}</span>
          </el-space>
        </template>
        <AsideMenu
            :menus="item.children as RouteRecord[]"
            :parent-path="`${props.parentPath}/${item.path}`"
            @gotoMenu="menuClick"
        ></AsideMenu>
      </el-sub-menu>
    </template>

    <template v-else>
      <el-menu-item
          class="elMenuItem"
          :index="item.meta.ifLink===final.Y?`${item.path}`:`${props.parentPath}/${item.path}`.replace(/\/{2,}/g, '/')"
          @click="menuClick(item.path, item.meta.ifLink===final.Y)"
      >
        <template v-if="item.meta.ifLink===final.Y">
          <a class="link" :href="item.path.replace('/http', 'http')" target="_blank" @click.stop>
            <el-space class="elSpace">
              <SvgIcon :name="item.meta.icon as string" color="var(--menu-icon-color)"/>
              <span>{{ item.meta ? item.meta.label : item.name }}</span>
            </el-space>
          </a>
        </template>

        <template v-else>
          <el-space class="elSpace">
            <SvgIcon :name="item.meta.icon as string" color="var(--menu-icon-color)"/>
            <template v-if="!sysConfigStore.getMenuCollapse()||(sysConfigStore.getMenuCollapse()&&!ifParentMenuItem(item))">
              <span>{{ item.meta ? item.meta.label : item.name }}</span>
            </template>
          </el-space>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<style scoped>
.asideMenu {
  overflow: hidden;
}

.link {
  position: absolute;
  left: 0;
  display: block;
  padding: inherit;
  width: 100%;
}
</style>