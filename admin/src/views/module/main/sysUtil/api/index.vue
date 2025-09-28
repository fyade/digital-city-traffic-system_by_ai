<script lang="ts">
export default {
  name: 'main:sysUtil:api'
}
</script>

<script setup lang="ts">
import { baseURL } from "@/api/request.ts";
import { publicConfig } from "@dcts/config";

const publicCurrentConfig = publicConfig.currentConfig();
</script>

<template>
  <iframe :src="`${baseURL}${publicCurrentConfig.docSwaggerPath}`" style="width: 100%;height: calc(100vh - 120px);border: 0;"/>
</template>

<style scoped>

</style>