<script setup lang="ts">
import * as Cesium from "cesium";
import { computed, h, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import DataLayer from "@/views/dashboard/index/dataLayer.vue";
import DebugPanel from '@/views/dashboard/debugPanel/index.vue';
import { geoserverConfig } from "@dcts/config";
import { ContextMenuItem, LayerDto } from "@/views/dashboard/index/dto.ts";
import { DropdownGroupOption, DropdownOption, NotificationReactive, NSpin, useNotification } from "naive-ui";
import { UseCesium } from "@/views/dashboard/utils/useCesium.ts";
import { useUserStore } from "@/store/module/user.ts";

const userStore = useUserStore();

onMounted(async () => {
  await init()
})
onBeforeUnmount(async () => {
  await destroy()
})

const notification = useNotification();

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 变量 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
const cesiumContainer = useTemplateRef<HTMLDivElement>("cesiumContainer");
let viewer: Cesium.Viewer | null = null;
let cesiumClass: UseCesium | null = null;
// 图层是否正在加载
const layerLoading = ref(false)
// 右上角的 Loading 通知
let layerLoadingNotification: NotificationReactive | null = null
// 右上角的通知内容变化定时器
let layerLoadingTimer: NodeJS.Timeout | null = null
// 右键菜单的显示
const contextMenuShow = ref(false)
// 右键菜单的坐标
const contextMenuXY = ref([0, 0])
const contextMenus: ContextMenuItem[] = []
const contextMenuOption = computed(() => {
  const ret: Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption> = [
    {
      label: '信号灯管理',
      key: 'signalLight',
      show: userStore.ifLogin,
      children: [
        {
          label: '信号灯信息管理',
          key: 'signalLight:signalLightInfo',
          show: userStore.ifLogin,
          children: [
            {
              label: '新增信号灯',
              key: 'signalLight:signalLightInfo:ins',
              show: userStore.ifLogin,
            }
          ]
        }
      ]
    },
    {
      label: '关闭',
      key: 'close'
    }
  ]
  return ret;
})

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 数据 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// 所有图层的链接及当前图层index
const currentIdOfBaseMap = ref([[''], ['a1']])
const currentIdOfRoadData = ref([[''], ['b1']])
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
    dataType: '影像底图',
    fromCompany: 'SuperMap',
    fromUrl: 'https://www.supermapol.com/resource-center/map/detail?id=2118000783'
  }
]
const allLayersOfRoadData: LayerDto[] = [
  {
    id: 'b1',
    name: 'OSM路网数据[路网](2025.06.22)',
    preview: '',
    func: () => {
      if (!viewer) {
        return
      }
      const provider = new Cesium.WebMapServiceImageryProvider({
        url: `${geoserverConfig.VITE_API_PREFIX}/geoserver/wms`,
        layers: 'ne:planet_osm_line',
        parameters: {
          transparent: true,
          format: 'image/png'
        }
      });
      viewer.imageryLayers.addImageryProvider(provider);
    },
    dataType: '路网数据[路网]',
    fromCompany: 'OpenStreetMap',
    fromUrl: 'https://www.openstreetmap.org/'
  }
]
const allLabels = ref<string[][]>([])

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 操作 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 初始化
 */
const init = async () => {
  console.info('开始加载');

  const useCesium = new UseCesium({container: 'cesiumContainer'});
  const viewer1 = useCesium.getViewer();
  if (!viewer1) {
    return
  }
  cesiumClass = useCesium;
  viewer = viewer1;

  cesiumClass.setViewTo(118.92844631852402, 32.12752744546319, 10000)

  // 获取默认的影像图层
  const defaultImagery = viewer.imageryLayers.get(0);
  // 移除默认图层
  viewer.imageryLayers.remove(defaultImagery);

  setLayer()

  console.info('加载完成')

  // 瓦片图层加载事件
  viewer.scene.globe.tileLoadProgressEvent.addEventListener(queuedTileCount => {
    // 加载中
    if (queuedTileCount > 0 && !layerLoading.value) {
      layerLoading.value = true
      layerLoadingNotification = notification.create({
        title: '提示',
        content: '图层加载中...',
        duration: 0,
        avatar: () => h(NSpin, {
          size: 'medium',
          strokeWidth: 20
        }),
        closable: false,
      });
      // 设置定时器
      if (!layerLoadingTimer) {
        layerLoadingTimer = setTimeout(() => {
          if (layerLoadingNotification) {
            layerLoadingNotification.content = '加载时间可能稍长，请稍作等待，感谢您的配合...'
          }
        }, 3000)
      }
    }
    // 加载完成
    if (queuedTileCount === 0 && layerLoading.value) {
      if (layerLoadingNotification) {
        layerLoadingNotification.destroy()
      }
      layerLoading.value = false
      notification.success({
        title: '提示',
        content: '图层加载完成',
        duration: 3000
      })
      // 清除定时器
      if (layerLoadingTimer) {
        clearTimeout(layerLoadingTimer)
        layerLoadingTimer = null
      }
    }
  })
  // 镜头移动结束事件
  viewer.camera.moveEnd.addEventListener(() => {
  })
  // 图层点击事件
  viewer.cesiumWidget.canvas.addEventListener('click', e => {
    // 屏幕坐标
    const pickedPosition = new Cesium.Cartesian2(e.clientX, e.clientY);
    // 转为笛卡尔坐标
    const cartesian = viewer?.camera.pickEllipsoid(pickedPosition, viewer?.scene.globe.ellipsoid);
    if (cartesian) {
      // 转为地理坐标
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      console.log('经度', lon, '纬度', lat, '高度', height)
    }
  })
  // 右键自定义菜单
  viewer.canvas.addEventListener('contextmenu', e => {
    contextMenuXY.value = [e.clientX, e.clientY];
    contextMenuShow.value = true
  })
  contextMenus.push(
      {
        id: 'signalLight:signalLightInfo:ins',
        func: () => {
        }
      },
      {
        id: 'close',
        func: () => {
          contextMenuShow.value = false
        }
      }
  )
}
/**
 * 销毁
 */
const destroy = async () => {
  cesiumClass?.destroy()
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 工具函数 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
/**
 * 设置图层
 */
const setLayer = () => {
  allLabels.value = []
  const filter1 = allLayersOfBaseMap.filter(item => currentIdOfBaseMap.value[1].includes(item.id));
  for (const f of filter1) {
    f.func()
    allLabels.value.push([f.dataType, f.fromCompany, f.fromUrl])
  }
  const filter2 = allLayersOfRoadData.filter(item => currentIdOfRoadData.value[1].includes(item.id));
  for (const f of filter2) {
    f.func()
    allLabels.value.push([f.dataType, f.fromCompany, f.fromUrl])
  }
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// 设置抽屉
const settingDrawerActive = ref(false)
const openSettingLayerChange = () => {
  settingDrawerActive.value = true
}
// 调试面板抽屉
const debugDrawerActive = ref(false)
const openDebugLayerChange = () => {
  debugDrawerActive.value = true
}

const contextMenuSelect = (key: string) => {
  const find = contextMenus.find(item => item.id === key);
  if (find) find.func()
}
</script>

<template>
  <DataLayer
      :labels="allLabels"
      @open-setting-layer-change="openSettingLayerChange"
      @open-debug-panel="openDebugLayerChange"
  />
  <div id="cesiumContainer" ref="cesiumContainer"></div>

  <n-drawer v-model:show="settingDrawerActive" width="50rem">
    <n-drawer-content title="设置">
      设置
    </n-drawer-content>
  </n-drawer>

  <n-drawer v-model:show="debugDrawerActive" width="50rem">
    <n-drawer-content title="调试面板">
      <DebugPanel/>
    </n-drawer-content>
  </n-drawer>

  <n-dropdown
      v-model:show="contextMenuShow"
      trigger="manual"
      :x="contextMenuXY[0]"
      :y="contextMenuXY[1]"
      :options="contextMenuOption"
      @select="contextMenuSelect"
  />

  <router-view/>
</template>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
