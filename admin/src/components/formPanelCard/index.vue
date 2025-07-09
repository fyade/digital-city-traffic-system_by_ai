<script setup lang="ts">
import { nextTick, ref } from "vue";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { CONFIG } from "@/utils/base.ts";

const props = defineProps({
  title: {
    type: String,
    required: false,
  },
  ifIns: {
    type: Boolean,
    required: true,
  },
  ifUpd: {
    type: Boolean,
    required: true,
  },
  ifDel: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  wider: {
    type: Boolean,
    default: false,
  },
  runInit: {
    type: Function
  }
});
const emits = defineEmits(['submitCallback']);

const modalTitle = ref('')
nextTick(() => {
  modalTitle.value = props.title || useDashboardCesium.formPanelTitle
  if (!modalTitle.value) {
    gotoDashboardHome()
  } else {
    props?.runInit()
  }
})

const submitCallback = () => {
  emits('submitCallback')
}
</script>

<template>
  <template v-if="props.ifIns || props.ifUpd">
    <n-modal
        show
        preset="dialog"
        :show-icon="false"
        :on-close="gotoDashboardHome"
        :style="{
          width: props.wider ? CONFIG.dialog_width_wider : ''
        }"
    >
      <!--:on-esc="onClose"-->
      <!--:on-mask-click="onClose"-->
      <template #header>
        <div>{{ modalTitle }}</div>
      </template>
      <slot/>
    </n-modal>
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