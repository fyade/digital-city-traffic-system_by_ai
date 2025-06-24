<script setup lang="ts">
import { nodesWithWaysInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { UseCesium } from "@/views/dashboard/utils/useCesium.ts";

const useCesium = new UseCesium();

const a1 = () => {
  const coordinates = useCesium.getViewCornerCoordinates();
  if (!coordinates) {
    return
  }
  coordinates.push(coordinates[0])
  nodesWithWaysInPolygonApi({
    version: '1.0',
    points: coordinates
  }).then((res) => {
    console.log(res)
  })
}
</script>

<template>
  <n-button @click="a1">查询可视区域内的路网信息</n-button>
</template>

<style scoped>
</style>
