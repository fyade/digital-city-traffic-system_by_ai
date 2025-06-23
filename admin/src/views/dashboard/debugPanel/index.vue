<script setup lang="ts">
import { getCesiumUtils } from "@/views/dashboard/utils/createCesiumUtils.ts";
import { nodesWithWaysInPolygonApi } from "@/api/module/dcts/spatialData.ts";

const cesiumUtils = getCesiumUtils();

const a1 = () => {
  const coordinates = cesiumUtils?.getViewCornerCoordinates();
  const points: { lon: number, lat: number }[] = []
  coordinates?.forEach((coordinate) => coordinate ? points.push(coordinate) : null)
  points.push(points[0])
  nodesWithWaysInPolygonApi({
    version: '1.0',
    points: points
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
