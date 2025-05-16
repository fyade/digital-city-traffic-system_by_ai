<script setup lang="ts">
import * as Cesium from "cesium";
import { onMounted, useTemplateRef } from "vue";
import DataLayer from "@/views/home/dataLayer.vue";
import { geoserverConfig } from "@dcts/config";

onMounted(async () => {
  console.log('开始加载');
  await init()
})

const cesiumContainer = useTemplateRef<HTMLDivElement>("cesiumContainer");
let viewer: Cesium.Viewer | null = null;

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

  // 超图影像地图
  const provider2 = new Cesium.UrlTemplateImageryProvider({
    url: `https://www.supermapol.com/proxy/y8f150ad/iserver/services/map-geovis-img/rest/maps/GEOVIS_Img/zxyTileImage.png?width=256&height=256&x={x}&y={y}&z={z}`,
    minimumLevel: 0,
    maximumLevel: 18,
    credit: new Cesium.Credit('SuperMap iServer')
  });
  viewer.imageryLayers.addImageryProvider(provider2);

  // osm路网
  const provider3 = new Cesium.WebMapServiceImageryProvider({
    url: `${geoserverConfig.VITE_API_PREFIX}/geoserver/wms`,
    layers: 'ne:planet_osm_roads',
    parameters: {
      transparent: true,
      format: 'image/png'
    }
  });
  viewer.imageryLayers.addImageryProvider(provider3);

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
