<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { inject, Ref, ref, watch } from "vue";

const msg = ref('')
const route = useRoute();
const router = useRouter()
const adminPanelLoading = inject<Ref<boolean>>('adminPanelLoading')

watch(() => adminPanelLoading?.value, (newVal) => {
  if (!newVal) {
    router.push(route.path)
  }
}, {immediate: true})

const init = () => {
  msg.value = 'Loading...'
}
init()
</script>

<template>
  {{ msg }}
</template>

<style scoped>
</style>