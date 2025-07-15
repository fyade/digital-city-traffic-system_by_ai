import * as Cesium from "cesium";
import { NotificationReactive } from "naive-ui";
import { LayerDto } from "@/views/dashboard/index/dto.ts";
import { geoserverConfig } from "@dcts/config";

/**
 * 图层及通知
 */
export class LayerNotificationModule {
  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private setAllLabelsCB: (() => void) | null = null

  public setSetAllLabelsCB(func: () => void) {
    this.setAllLabelsCB = func
  }


  public init() {
    this.setLayer()
  }

  // 图层是否正在加载
  public layerLoading = false
  // 图层加载次数
  public layerLoadingCount = 0
  // 右上角的 Loading 通知
  public layerLoadingNotification: NotificationReactive | null = null
  // 右上角的通知内容变化定时器
  public layerLoadingTimer: NodeJS.Timeout | null = null
  // 所有图层的链接及当前图层index
  private currentIdOfBaseMap = [[''], ['a1']]
  private currentIdOfRoadData = [[''], ['b1']]
  private allLayersOfBaseMap: LayerDto[] = [
    {
      id: 'a1',
      name: 'SuperMap影像底图',
      preview: '',
      func: () => {
        if (!this.viewer) {
          return
        }
        const provider = new Cesium.UrlTemplateImageryProvider({
          url: `https://www.supermapol.com/proxy/y8f150ad/iserver/services/map-geovis-img/rest/maps/GEOVIS_Img/zxyTileImage.png?width=256&height=256&x={x}&y={y}&z={z}`,
          minimumLevel: 0,
          maximumLevel: 18,
          credit: new Cesium.Credit('SuperMap iServer')
        });
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '影像底图',
      fromCompany: 'SuperMap',
      fromUrl: 'https://www.supermapol.com/resource-center/map/detail?id=2118000783'
    }
  ]
  private allLayersOfRoadData: LayerDto[] = [
    {
      id: 'b1',
      name: 'OSM路网数据[路网](2025.06.22)',
      preview: '',
      func: () => {
        if (!this.viewer) {
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
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '路网数据[路网]',
      fromCompany: 'OpenStreetMap',
      fromUrl: 'https://www.openstreetmap.org/'
    }
  ]
  // 左下角显示的图层提供者信息，注意，添加数据时，禁止使用数组方法
  private _allLabels: string[][] = []

  // 左下角显示的图层提供者信息，注意，添加数据时，禁止使用数组方法
  get allLabels(): string[][] {
    return this._allLabels;
  }

  // 左下角显示的图层提供者信息，注意，添加数据时，禁止使用数组方法
  private set allLabels(value: string[][]) {
    this._allLabels = value;
    if (this.setAllLabelsCB) {
      this.setAllLabelsCB()
    }
  }

  private setLayer() {
    this.allLabels = []
    const filter1 = this.allLayersOfBaseMap.filter(item => this.currentIdOfBaseMap[1].includes(item.id));
    for (const f of filter1) {
      f.func()
      this.allLabels = [...JSON.parse(JSON.stringify(this.allLabels)), [f.dataType, f.fromCompany, f.fromUrl]]
    }
    const filter2 = this.allLayersOfRoadData.filter(item => this.currentIdOfRoadData[1].includes(item.id));
    for (const f of filter2) {
      f.func()
      this.allLabels = [...JSON.parse(JSON.stringify(this.allLabels)), [f.dataType, f.fromCompany, f.fromUrl]]
    }
  }
}
