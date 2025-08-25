<script setup lang="ts">
import { calculateLightsInPolygonApi, nodesWithWaysInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { CesiumLine, CesiumPoint } from "@/views/dashboard/utils/dto.ts";
import { getLonlatFromLinestring } from "@/utils/RegularUtils.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { selectFiles } from "@/utils/FileUtils.ts";
import { ChucanDto, readJsonFile, RucanDto } from "@/views/dashboard/debugPanel/index.ts";

const useCesium = useDashboardCesium;

const sf1 = () => {
  selectFiles().then((res) => {
    readJsonFile<RucanDto>(res[0]).then(res => {
      useCesium.debugModuleSf1(res)
    })
  })
}
const sf2 = () => {
  selectFiles().then((res) => {
    readJsonFile<ChucanDto>(res[0]).then(res => {
      useCesium.debugModuleSf2(res)
    })
  })
}

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
    for (const line of map1) {
      useCesium.addLine(line)
    }
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
  <n-divider title-placement="left">
    算法相关调试
  </n-divider>
  <n-space vertical>
    <n-button @click="sf1">入参可视化</n-button>
    <n-button @click="sf2">返回值可视化</n-button>
  </n-space>

  <n-divider title-placement="left">
    其他调试
  </n-divider>
  <n-space vertical>
    <n-button @click="a1">查询可视区域内的路网信息</n-button>
    <n-button @click="a2">计算多边形内的所有信号灯</n-button>
    <n-button @click="useCesium.debugModuleCesiumModelPathAnimation">test（小车跟随导航轨迹绘制测试）</n-button>
  </n-space>
</template>

<style scoped>
</style>
