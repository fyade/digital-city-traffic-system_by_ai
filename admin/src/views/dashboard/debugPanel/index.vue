<script setup lang="ts">
import { nodesWithWaysInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { getLonlatFromLinestring } from "@/utils/RegularUtils.ts";
import { UseDashboardCesium } from "@/views/dashboard/class/useDashboardCesium.ts";

const useCesium = new UseDashboardCesium();

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
    const map = res.allNodes.map((node) => useCesium.addPoint(new CesiumPoint({lon: node.lon, lat: node.lat})));
    setTimeout(() => {
      map.forEach(node => {
        if (node)
          useCesium.updPoint(node)
      })
    }, 2000)

    const map1 = res.allRoads.map(road => {
      const linestring = getLonlatFromLinestring(road.way);
      return new CesiumLine({points: linestring.map(p => new CesiumPoint(p))})
    });
    useCesium.addLines(map1)
  })
}
</script>

<template>
  <n-button @click="a1">查询可视区域内的路网信息</n-button>
</template>

<style scoped>
</style>
