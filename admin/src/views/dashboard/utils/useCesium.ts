import { nextTick, Ref, ref } from "vue";
import * as Cesium from "cesium";
import { createCesiumUtils } from "@/views/dashboard/utils/createCesiumUtils.ts";

export async function useCesium(containerId: string): Promise<{
  viewer: Ref<Cesium.Viewer | null>
}> {
  const viewerRef = ref<Cesium.Viewer | null>(null)

  await nextTick()
  const viewer = new Cesium.Viewer(containerId, {
    infoBox: false, // 属性面板
    selectionIndicator: false, // 选择指示器
    geocoder: false, // 搜索框
    homeButton: false, // 主页按钮
    sceneModePicker: false, // 场景模式选择器
    baseLayerPicker: false, // 底图选择器
    navigationHelpButton: false, // 帮助按钮
    animation: false, // 动画控制器
    timeline: false, // 时间轴
    fullscreenButton: false, // 全屏按钮
  });
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
  viewerRef.value = viewer
  createCesiumUtils(viewer)

  return {
    viewer: viewerRef
  }
}
