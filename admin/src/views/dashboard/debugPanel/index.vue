<script setup lang="ts">
import { calculateLightsInPolygonApi, nodesWithWaysInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { getLonlatFromLinestring } from "@/utils/RegularUtils.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";

const useCesium = useDashboardCesium;

const a1 = () => {
  const coordinates = useCesium.getViewCornerCoordinates();
  if (!coordinates) {
    return
  }
  coordinates.push(coordinates[0])
  nodesWithWaysInPolygonApi({points: coordinates}).then((res) => {
    const map = res.allNodes.map((node) => useCesium.addPoint(new CesiumPoint({lon: node.lon, lat: node.lat})));
    const map1 = res.allRoads.map(road => {
      const linestring = getLonlatFromLinestring(road.way);
      return new CesiumLine({points: linestring.map(p => new CesiumPoint(p))})
    });
    useCesium.addLines(map1)
  })
}
const a2 = () => {
  const coordinates = useCesium.getViewCornerCoordinates();
  if (!coordinates) {
    return
  }
  coordinates.push(coordinates[0])
  calculateLightsInPolygonApi({points: coordinates})
}
</script>

<template>
  <n-space vertical>
    <n-button @click="a1">查询可视区域内的路网信息</n-button>
    <n-button @click="a2">计算多边形内的所有信号灯</n-button>
    <n-button @click="useCesium.CesiumModelPathAnimation">test</n-button>
  </n-space>
</template>

<style scoped>
</style>
