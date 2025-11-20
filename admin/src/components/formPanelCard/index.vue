<script setup lang="ts">
import { nextTick, ref, watchEffect } from "vue";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { CONFIG } from "@/utils/base.ts";

const props = withDefaults(defineProps<{
  title?: string
  ifIns: boolean
  ifUpd: boolean
  ifDel: boolean
  loading: boolean
  wider?: boolean
  runInit?: () => void
  preset?: 'modal' | 'drawer'
}>(), {
  wider: false,
  preset: 'modal',
});
const emits = defineEmits(['submitCallback']);

const modalTitle = ref('')
nextTick(() => {
  modalTitle.value = props.title || useDashboardCesium.formPanelTitle
  if (!modalTitle.value) {
    gotoDashboardHome()
  } else {
    if (props.runInit) {
      props.runInit()
    }
  }
})

const drawerShow = ref(true)
watchEffect(() => {
  if (drawerShow.value) {
    return
  }
  gotoDashboardHome()
})

const submitCallback = () => {
  emits('submitCallback')
}
</script>

<template>
  <template v-if="props.ifIns || props.ifUpd || (!props.ifIns && !props.ifUpd && !props.ifDel)">
    <template v-if="props.preset === 'modal'">
      <n-modal
          show
          preset="dialog"
          :show-icon="false"
          :on-close="gotoDashboardHome"
          :style="{
            width: props.wider ? CONFIG.dialog_width_wider : ''
          }"
      >
        <template #header>
          <div>{{ modalTitle }}</div>
        </template>
        <slot/>
      </n-modal>
    </template>
    <template v-if="props.preset === 'drawer'">
      <n-drawer
          v-model:show="drawerShow"
          :show-mask="false"
          :width="props.wider ? CONFIG.dialog_width_wider : '30vw'"
          placement="left"
      >
        <n-drawer-content
            :title="modalTitle"
            closable
        >
          <slot/>
        </n-drawer-content>
      </n-drawer>
    </template>
  </template>
  <template v-if="props.ifDel">
    <n-modal
        show
        preset="dialog"
        title="警告"
        content="此操作将删除选中的 1 条数据，且无法撤销，请确认是否继续？"
        positive-text="确认"
        negative-text="取消"
        :loading="props.loading"
        :on-close="gotoDashboardHome"
        @positive-click="submitCallback"
        @negative-click="gotoDashboardHome"
    />
  </template>
</template>

<style scoped>

</style>