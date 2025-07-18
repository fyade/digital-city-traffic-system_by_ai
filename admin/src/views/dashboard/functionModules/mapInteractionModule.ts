import {
  EDIT_TYPE_1,
  ID_PREFIX_SIGNAL_LIGHT_GROUP,
  ID_SPECIAL_MouseMovingPoint
} from "@/views/dashboard/functionModules/constant.ts";
import * as Cesium from "cesium";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { routerPushByName } from "@/utils/RouterUtils.ts";

/**
 * 地图交互
 */
export class MapInteractionModule {
  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: MapEntityModule) {
    this.meModule = meModule;
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: VersionDataModule) {
    this.vdModule = vdModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: Cesium.Viewer) {
    this.viewer = viewer;
  }

  private getMouseMovePosition: (() => [number, number]) | null = null

  public setGetMouseMovePosition(func: () => [number, number]) {
    this.getMouseMovePosition = func
  }


  public init() {
    if (!this.viewer) {
      return
    }
    this.viewer.entities.add({
      position: Cesium.Cartesian3.ZERO,
      point: {
        pixelSize: 12,
        color: Cesium.Color.YELLOW.withAlpha(0.9),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND // 贴地
      },
      show: false, // 初始隐藏
      id: ID_SPECIAL_MouseMovingPoint
    });
  }

  public setMovingPointPosition() {
    if (!this.viewer) {
      return
    }
    if (!this.getMouseMovePosition) {
      return;
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_MouseMovingPoint);
    if (!entity) {
      return;
    }
    const lonlat = this.getMouseMovePosition();
    const position = Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1]);
    entity.position = new Cesium.ConstantPositionProperty(position)
  }

  // 是否处于编辑状态
  private _ifEditing = false
  get ifEditing(): boolean {
    return this._ifEditing;
  }

  public set ifEditing(value: boolean) {
    this._ifEditing = value;
    this.setMovingPointPosition()
    if (!this.viewer) {
      return
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_MouseMovingPoint);
    if (!entity) {
      return
    }
    if (value) {
      entity.show = true
    } else {
      entity.show = false
    }
  }

  // 编辑所属业务
  public editType = ''
  // 对应的事件
  private editHandles: { id: string, func: () => void }[] = [
    {
      id: EDIT_TYPE_1.value,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.vdModule) {
          return
        }
        let pid = ''
        const hseids = this.vdModule.getHistorySelectedEntityIds(-1);
        if (hseids) {
          pid = hseids.data[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        routerPushByName('~fp~:signalLight:signalLightInfo:ins', {pid: pid})
      }
    }
  ]

  public doEditHandles() {
    this.ifEditing = false
    const find = this.editHandles.find(item => item.id === this.editType);
    if (find) {
      find.func()
    }
  }
}
