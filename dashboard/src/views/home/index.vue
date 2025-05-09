<script setup lang="ts">
import * as Cesium from "cesium";
import { cesiumConfig, tiandituConfig } from "@dcts/config";
import { onMounted, useTemplateRef } from "vue";
import DataLayer from "@/views/home/dataLayer.vue";

onMounted(async () => {
  console.log('开始加载');
  await init()
})

const cesiumContainer = useTemplateRef<HTMLDivElement>("cesiumContainer");
let viewer: Cesium.Viewer | null = null;

Cesium.Ion.defaultAccessToken = cesiumConfig.token

/**
 * 初始化
 */
const init = async () => {
  viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: true,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false
  });
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
  setViewTo(118.92844631852402, 32.12752744546319, 10000)

  // 获取默认的影像图层
  const defaultImagery = viewer.imageryLayers.get(0);
  // 移除默认图层
  viewer.imageryLayers.remove(defaultImagery);
  // 添加天地图影像底图
  const provider = new Cesium.WebMapTileServiceImageryProvider({
    url: `https://t0.tianditu.gov.cn/img_w/wmts?tk=${tiandituConfig.key}`,
    layer: 'img',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    credit: new Cesium.Credit('天地图影像底图'),
  });
  viewer.imageryLayers.addImageryProvider(provider);
  // 添加天地图影像注记
  const provider1 = new Cesium.WebMapTileServiceImageryProvider({
    url: `https://t0.tianditu.gov.cn/cia_w/wmts?tk=${tiandituConfig.key}`,
    layer: 'cia',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    credit: new Cesium.Credit('天地图影像注记')
  });
  viewer.imageryLayers.addImageryProvider(provider1);

  console.log('加载完成')
}

/**
 * 设置视角到
 * @param lon
 * @param lat
 * @param height
 */
const setViewTo = (lon: number, lat: number, height: number): void => {
  viewer?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
  })
}
</script>

<template>
  <DataLayer/>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
