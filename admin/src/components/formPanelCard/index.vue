<script setup lang="ts">
import { nextTick, ref } from "vue";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { UseCesium } from "@/views/dashboard/utils/useCesium.ts";

const props = defineProps({
  title: {
    type: String,
    required: false,
  }
});

const modalTitle = ref('')
nextTick(() => {
  const useCesium = new UseCesium();
  modalTitle.value = props.title || useCesium.formPanelTitle.value
  if (!modalTitle.value) {
    gotoDashboardHome()
  }
})
</script>

<template>
  <n-modal
      show
      :show-icon="false"
      preset="dialog"
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

<style scoped>

</style>