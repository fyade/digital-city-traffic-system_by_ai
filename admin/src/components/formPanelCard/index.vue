<script setup lang="ts">
import { inject, Ref } from "vue";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";

const props = defineProps({
  title: {
    type: String,
    required: false,
  }
});

const formPanelTitle = inject<Ref<string>>('dashboard::formPanelTitle');
const modalTitle = props.title || formPanelTitle?.value
if (!modalTitle) {
  gotoDashboardHome()
}
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