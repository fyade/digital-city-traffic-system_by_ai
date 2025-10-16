import * as Cesium from "cesium";
import { NotificationReactive, NSpin } from "naive-ui";
import { LayerDto } from "@/views/dashboard/index/dto.ts";
import { geoserverConfig, tiandituConfig } from "@dcts/config";
import { NNotification } from "@/utils/naiveBase.ts";
import { h } from "vue";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";

const dashboardStore = useDashboardStore();

/**
 * 图层及通知模块
 */
export class LayerNotificationModule {
  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private setAllLabelsCB: ((data: string[][]) => void) | null = null

  public setSetAllLabelsCB(func: (data: string[][]) => void) {
    this.setAllLabelsCB = func
  }

  private layerLoadingEndCB: ((count: number) => void) | null = null

  public setLayerLoadingEndCB(func: (count: number) => void) {
    this.layerLoadingEndCB = func
  }
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  public init() {
    this.getLayerFromStore()
    this.initLayer()
  }

  // 图层是否正在加载
  private layerLoading = false
  // 图层加载次数
  private layerLoadingCount = 0
  // 右上角的 Loading 通知
  private layerLoadingNotification: NotificationReactive | null = null
  // 右上角的通知内容变化定时器
  private layerLoadingTimer: NodeJS.Timeout | null = null

  public openLayerLoading() {
    if (this.layerLoading) {
      return
    }
    this.layerLoading = true
    this.layerLoadingNotification = NNotification.create({
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
    if (!this.layerLoadingTimer) {
      this.layerLoadingTimer = setTimeout(() => {
        if (this.layerLoadingNotification) {
          this.layerLoadingNotification.content = '加载时间可能稍长，请稍作等待，感谢您的配合...'
        }
      }, 3000)
    }
  }

  private _closeLayerLoading(ifLoadEnd = false) {
    if (!this.layerLoading) {
      return
    }
    this.layerLoading = false
    this.layerLoadingCount++
    if (this.layerLoadingNotification) {
      this.layerLoadingNotification.destroy()
      this.layerLoadingNotification = null
    }
    if (ifLoadEnd) {
      NNotification.success({
        title: '提示',
        content: '图层加载完成',
        duration: 3000
      })
    }
    // 清除定时器
    if (this.layerLoadingTimer) {
      clearTimeout(this.layerLoadingTimer)
      this.layerLoadingTimer = null
    }
    if (this.layerLoadingEndCB) {
      this.layerLoadingEndCB(this.layerLoadingCount)
    }
  }

  timeout_cll: NodeJS.Timeout | null = null

  public closeLayerLoading(ifLoadEnd = false) {
    if (this.timeout_cll !== null) {
      return
    }
    this.timeout_cll = setTimeout(() => {
      this._closeLayerLoading(ifLoadEnd)
      this.timeout_cll = null
    }, 1000)
  }


  private signalLightLoading = false
  private signalLightLoadingNotification: NotificationReactive | null = null

  public openSignalLightLoading() {
    if (this.signalLightLoading) {
      return
    }
    this.signalLightLoading = true
    this.signalLightLoadingNotification = NNotification.create({
      title: '提示',
      content: '信号灯等地图实体加载中...',
      duration: 0,
      avatar: () => h(NSpin, {
        size: 'medium',
        strokeWidth: 20,
      }),
      closable: false,
    });
  }

  private _closeSignalLightLoading() {
    if (!this.signalLightLoading) {
      return
    }
    this.signalLightLoading = false
    if (this.signalLightLoadingNotification) {
      this.signalLightLoadingNotification.destroy()
      this.signalLightLoadingNotification = null
    }
    NNotification.success({
      title: '提示',
      content: '信号灯等地图实体加载完成',
      duration: 3000
    })
  }

  timeout_csll: NodeJS.Timeout | null = null

  public closeSignalLightLoading() {
    if (this.timeout_csll !== null) {
      return
    }
    this.timeout_csll = setTimeout(() => {
      this._closeSignalLightLoading()
      this.timeout_csll = null
    }, 1000)
  }


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
          credit: new Cesium.Credit('a1')
        });
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '影像底图',
      fromCompany: 'SuperMap',
      fromUrl: 'https://www.supermapol.com/resource-center/map/detail?id=2118000783'
    },
    {
      id: 'a2',
      name: '天地图矢量底图',
      preview: '',
      func: () => {
        if (!this.viewer) {
          return
        }
        const provider = new Cesium.WebMapTileServiceImageryProvider({
          url: tiandituConfig.VITE_API_PREFIX_VEC,
          layer: 'vec',
          style: 'default',
          tileMatrixSetID: 'w',
          credit: new Cesium.Credit('a2')
        });
        this.viewer.imageryLayers.addImageryProvider(provider)
      },
      dataType: '矢量底图',
      fromCompany: '天地图',
      fromUrl: 'http://lbs.tianditu.gov.cn/server/MapService.html'
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
          },
          credit: new Cesium.Credit('b1')
        });
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '路网数据[路网]',
      fromCompany: 'OpenStreetMap',
      fromUrl: 'https://www.openstreetmap.org/'
    },
    {
      id: 'b2',
      name: '天地图矢量标记',
      preview: '',
      func: () => {
        if (!this.viewer) {
          return
        }
        const provider = new Cesium.WebMapTileServiceImageryProvider({
          url: tiandituConfig.VITE_API_PREFIX_CVA,
          layer: 'cva',
          style: 'default',
          tileMatrixSetID: 'w',
          credit: new Cesium.Credit('b2')
        });
        this.viewer.imageryLayers.addImageryProvider(provider);
      },
      dataType: '矢量标记',
      fromCompany: '天地图',
      fromUrl: 'http://lbs.tianditu.gov.cn/server/MapService.html'
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
      this.setAllLabelsCB(this.allLabels)
    }
  }

  public allLayers = {
    currentIdOfBaseMap: this.currentIdOfBaseMap,
    currentIdOfRoadData: this.currentIdOfRoadData,
    allLayersOfBaseMap: this.allLayersOfBaseMap,
    allLayersOfRoadData: this.allLayersOfRoadData,
  }

  public setLayer(type: 'baseMap' | 'roadData', ids: string[]) {
    const ___delids: string[] = []
    if (type === 'baseMap') {
      this.currentIdOfBaseMap[0][0] = this.currentIdOfBaseMap[1][0]
      this.currentIdOfBaseMap[1][0] = ids[0]
      if (this.currentIdOfBaseMap[0][0] !== this.currentIdOfBaseMap[1][0]) {
        // 移除原先的图层
        const find = this.allLayersOfBaseMap.find(item => item.id === this.currentIdOfBaseMap[0][0]);
        if (find) {
          ___delids.push(find.id)
        }
        // 显示现在的图层
        const find1 = this.allLayersOfBaseMap.find(item => item.id === this.currentIdOfBaseMap[1][0]);
        if (find1) {
          find1.func()
        }
      }
    }
    if (type === 'roadData') {
      this.currentIdOfRoadData[0] = deepClone(this.currentIdOfRoadData[1])
      this.currentIdOfRoadData[1] = deepClone(ids)
      const delids = this.currentIdOfRoadData[0].filter(item => !this.currentIdOfRoadData[1].includes(item))
      const addids = this.currentIdOfRoadData[1].filter(item => !this.currentIdOfRoadData[0].includes(item))
      // 移除原先的图层
      for (const id of delids) {
        const find = this.allLayersOfRoadData.find(item => item.id === id);
        if (find) {
          ___delids.push(find.id)
        }
      }
      // 显示现在的图层
      for (const id of addids) {
        const find = this.allLayersOfRoadData.find(item => item.id === id);
        if (find) {
          find.func()
        }
      }
    }
    this.setLabel()
    this.hiddenLayer(___delids)
    this.setLayerToStore()
  }

  private hiddenLayer(ids: string[]) {
    if (!this.viewer) {
      return
    }
    const credits = ids.map(id => new Cesium.Credit(id));
    for (let i = 0; i < this.viewer.imageryLayers.length; i++) {
      const data = this.viewer.imageryLayers.get(i);
      if (credits.some(delid => data.imageryProvider.credit.equals(delid))) {
        this.viewer.imageryLayers.remove(data);
      }
    }
  }

  private getLayerFromStore() {
    const idsOfBaseMaps = dashboardStore.getIdsOfBaseMaps();
    if (!idsOfBaseMaps || idsOfBaseMaps.length < 2) {
      return
    }
    this.currentIdOfBaseMap[1] = idsOfBaseMaps[0]
    this.currentIdOfRoadData[1] = idsOfBaseMaps[1]
  }

  private setLayerToStore() {
    const idsOfBaseMaps = [
      this.currentIdOfBaseMap[1],
      this.currentIdOfRoadData[1]
    ]
    dashboardStore.setIdsOfBaseMaps(idsOfBaseMaps)
  }

  private initLayer() {
    const filter1 = this.allLayersOfBaseMap.filter(item => this.currentIdOfBaseMap[1].includes(item.id));
    for (const f of filter1) {
      f.func()
    }
    const filter2 = this.allLayersOfRoadData.filter(item => this.currentIdOfRoadData[1].includes(item.id));
    for (const f of filter2) {
      f.func()
    }
    this.setLabel()
  }

  private setLabel() {
    const allLabels: string[][] = []
    const filter1 = this.allLayersOfBaseMap.filter(item => this.currentIdOfBaseMap[1].includes(item.id));
    for (const f of filter1) {
      allLabels.push([f.id, f.dataType, f.fromCompany, f.fromUrl])
    }
    const filter2 = this.allLayersOfRoadData.filter(item => this.currentIdOfRoadData[1].includes(item.id));
    for (const f of filter2) {
      allLabels.push([f.id, f.dataType, f.fromCompany, f.fromUrl])
    }
    this.allLabels = allLabels
  }
}
