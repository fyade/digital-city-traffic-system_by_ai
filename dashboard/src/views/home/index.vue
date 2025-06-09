<script setup lang="ts">
import * as Cesium from "cesium";
import { onMounted, ref, useTemplateRef } from "vue";
import DataLayer from "@/views/home/dataLayer.vue";
import { geoserverConfig } from "@dcts/config";
import { LayerDto } from "@/views/home/dto";

onMounted(async () => {
  await init()
})

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
const cesiumContainer = useTemplateRef<HTMLDivElement>("cesiumContainer");
let viewer: Cesium.Viewer | null = null;

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 数据 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// 所有图层的链接及当前图层index
const currentIdOfBaseMap = ref(['', 'a1'])
const currentIdOfRoadData = ref(['', 'b1'])
const allLayersOfBaseMap: LayerDto[] = [
  {
    id: 'a1',
    name: 'SuperMap影像底图',
    preview: '',
    func: () => {
      if (!viewer) {
        return
      }
      const provider = new Cesium.UrlTemplateImageryProvider({
        url: `https://www.supermapol.com/proxy/y8f150ad/iserver/services/map-geovis-img/rest/maps/GEOVIS_Img/zxyTileImage.png?width=256&height=256&x={x}&y={y}&z={z}`,
        minimumLevel: 0,
        maximumLevel: 18,
        credit: new Cesium.Credit('SuperMap iServer')
      });
      viewer.imageryLayers.addImageryProvider(provider);
    },
    fromCompany: 'SuperMap',
    fromUrl: 'https://www.supermapol.com/resource-center/map/detail?id=2118000783'
  }
]
const allLayersOfRoadData: LayerDto[] = [
  {
    id: 'b1',
    name: 'OSM路网数据(2025.05.16)',
    preview: '',
    func: () => {
      if (!viewer) {
        return
      }
      const provider = new Cesium.WebMapServiceImageryProvider({
        url: `${geoserverConfig.VITE_API_PREFIX}/geoserver/wms`,
        layers: 'ne:planet_osm_roads',
        parameters: {
          transparent: true,
          format: 'image/png'
        }
      });
      viewer.imageryLayers.addImageryProvider(provider);
    },
    fromCompany: 'OpenStreetMap',
    fromUrl: 'https://www.openstreetmap.org/'
  }
]
const bianliang1 = ref('')
const bianliang2 = ref('')
const bianliang3 = ref('')
const bianliang4 = ref('')

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 操作 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 初始化
 */
const init = async () => {
  console.info('开始加载');

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

  setLayer()

  console.info('加载完成')
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 工具函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 设置视角到
 * @param lon
 * @param lat
 * @param height
 * @param ifFly
 */
const setViewTo = (lon: number, lat: number, height: number, ifFly = false): void => {
  if (ifFly) {
    viewer?.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
    })
  } else {
    viewer?.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
    })
  }
}
/**
 * 设置图层
 */
const setLayer = () => {
  const find1 = allLayersOfBaseMap.find(item => item.id === currentIdOfBaseMap.value[1]);
  if (find1) {
    find1.func()
    bianliang1.value = find1.fromCompany
    bianliang2.value = find1.fromUrl
  }
  const find2 = allLayersOfRoadData.find(item => item.id === currentIdOfRoadData.value[1]);
  if (find2) {
    find2.func()
    bianliang3.value = find2.fromCompany
    bianliang4.value = find2.fromUrl
  }
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// 设置抽屉
const drawerActive = ref(false)
const openLayerChange = () => {
  drawerActive.value = true
}
</script>

<template>
  <DataLayer
      :img-from-company="bianliang1"
      :img-from-url="bianliang2"
      :road-from-company="bianliang3"
      :road-from-url="bianliang4"
      @open-layer-change="openLayerChange"
  />
  <div id="cesiumContainer" ref="cesiumContainer"></div>

  <n-drawer v-model:show="drawerActive" width="50rem">
    <n-drawer-content title="设置">
      aaaaaaaaaaaaaaaaa
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
