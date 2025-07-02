<script setup lang="ts">
import { nextTick, ref } from "vue";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { UseDashboardCesium } from "@/views/dashboard/class/useDashboardCesium.ts";

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
  }
});
const emits = defineEmits(['submitCallback']);

const modalTitle = ref('')
nextTick(() => {
  const useCesium = new UseDashboardCesium();
  modalTitle.value = props.title || useCesium.formPanelTitle.value
  if (!modalTitle.value) {
    gotoDashboardHome()
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
        :on-close="gotoDashboardHome"
        @positive-click="submitCallback"
        @negative-click="gotoDashboardHome"
    />
  </template>
</template>

<style scoped>

</style>