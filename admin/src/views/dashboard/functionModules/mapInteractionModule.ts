import {
  CESIUM_DEFAULT,
  EDIT_TYPE_ENUM,
  EDIT_TYPES_SPECIAL_1,
  EDIT_TYPES_SPECIAL_1_GEOMETRY,
  EDIT_TYPES_SPECIAL_1_POLYLINE,
  ID_PREFIX_SIGNAL_LIGHT,
  ID_PREFIX_SIGNAL_LIGHT_GROUP,
  ID_SPECIAL_MouseMovingGeometry,
  ID_SPECIAL_MouseMovingPoint,
  ID_SPECIAL_MouseMovingPolyline
} from "@/views/dashboard/functionModules/constant.ts";
import * as Cesium from "cesium";
import { MapEntityModule } from "@/views/dashboard/functionModules/mapEntityModule.ts";
import { VersionDataModule } from "@/views/dashboard/functionModules/versionDataModule.ts";
import { routerPushByName } from "@/utils/RouterUtils.ts";
import { AirspaceModule } from "@/views/dashboard/functionModules/airspaceModule.ts";
import { funcUtils } from "@dcts/common";

/**
 * 地图交互模块
 */
export class MapInteractionModule {
  private asModule: AirspaceModule | null = null

  public setAsModule(asModule: NonNullable<typeof this.asModule>) {
    this.asModule = asModule;
  }

  private meModule: MapEntityModule | null = null

  public setMeModule(meModule: NonNullable<typeof this.meModule>) {
    this.meModule = meModule;
  }

  private vdModule: VersionDataModule | null = null

  public setVdModule(vdModule: NonNullable<typeof this.vdModule>) {
    this.vdModule = vdModule;
  }

  private viewer: Cesium.Viewer | null = null

  public setViewer(viewer: NonNullable<typeof this.viewer>) {
    this.viewer = viewer;
  }

  private getMouseMovePosition: (() => [number, number]) | null = null

  public setGetMouseMovePosition(func: NonNullable<typeof this.getMouseMovePosition>) {
    this.getMouseMovePosition = func
  }

  private setIfEditingCB: ((data: boolean) => void) | null = null

  public setSetIfEditingCB(func: NonNullable<typeof this.setIfEditingCB>) {
    this.setIfEditingCB = func
  }

  private setEditTypeCB: ((data: EDIT_TYPE_ENUM) => void) | null = null

  public setSetEditTypeCB(func: NonNullable<typeof this.setEditTypeCB>) {
    this.setEditTypeCB = func
  }

  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


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
      },
      show: false, // 初始隐藏
      id: ID_SPECIAL_MouseMovingPoint
    });
    this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy([]),
        material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_RESTRICTION_ZONE,
        outline: true,
        outlineColor: CESIUM_DEFAULT.COLOR_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
        outlineWidth: CESIUM_DEFAULT.WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE,
      },
      show: false, // 初始隐藏
      id: ID_SPECIAL_MouseMovingGeometry
    });
    this.viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([0, 0, 0]),
        width: 3,
        material: CESIUM_DEFAULT.COLOR_DEFAULT_FLIGHT_ROUTE,
        arcType: Cesium.ArcType.NONE
      },
      show: false, // 初始隐藏
      id: ID_SPECIAL_MouseMovingPolyline
    });
  }

  public setMovingPointPosition() {
    this.setMovingPointPosition_drawPoint()
    this.setMovingPointPosition_drawGeometry()
    this.setMovingPointPosition_drawPolyline()
  }

  private setMovingPointPosition_drawPoint() {
    if (!this.ifEditing) {
      return;
    }
    if (!this.viewer) {
      return
    }
    if (!this.getMouseMovePosition) {
      return;
    }
    const entity = this.viewer.entities.getById(ID_SPECIAL_MouseMovingPoint);
    if (entity) {
      const lonlat = this.getMouseMovePosition();
      const position = Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1]);
      entity.position = new Cesium.ConstantPositionProperty(position)
    }
  }

  private setMovingPointPosition_drawGeometry = funcUtils.throttle(this.setMovingPointPosition_drawGeometry_.bind(this), 25)

  private setMovingPointPosition_drawGeometry_() {
    if (!this.ifEditing) {
      return;
    }
    if (!this.viewer) {
      return;
    }
    if (!this.asModule) {
      return;
    }
    if (!EDIT_TYPES_SPECIAL_1_GEOMETRY.includes(this.editType)) {
      return;
    }
    const tempPoints_ = this.asModule.getTempPoints();
    if (!this.getMouseMovePosition) {
      return;
    }
    const lonlat = this.getMouseMovePosition();
    const tempPoints = [...tempPoints_, lonlat]
    const positions = tempPoints.map(point => Cesium.Cartesian3.fromDegrees(point[0], point[1], CESIUM_DEFAULT.HEIGHT_FLIGHT_RESTRICTION_ZONE))
    const entity = this.viewer.entities.getById(ID_SPECIAL_MouseMovingGeometry);
    if (entity && entity.polygon) {
      entity.polygon.hierarchy = new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(positions))
    }
  }

  private setMovingPointPosition_drawPolyline = funcUtils.throttle(this.setMovingPointPosition_drawPolyline_.bind(this), 25)

  private setMovingPointPosition_drawPolyline_() {
    if (!this.ifEditing) {
      return;
    }
    if (!this.viewer) {
      return;
    }
    if (!this.asModule) {
      return;
    }
    if (!EDIT_TYPES_SPECIAL_1_POLYLINE.includes(this.editType)) {
      return;
    }
    const tempPoints_ = this.asModule.getTempPoints();
    if (!this.getMouseMovePosition) {
      return;
    }
    const lonlat = this.getMouseMovePosition();
    const tempPoints = [...tempPoints_, lonlat].map(point => [...point, CESIUM_DEFAULT.HEIGHT_DEFAULT_FLIGHT_ROUTE])
    const positions = Cesium.Cartesian3.fromDegreesArrayHeights([...tempPoints.flat()])
    const entity = this.viewer.entities.getById(ID_SPECIAL_MouseMovingPolyline);
    if (entity && entity.polyline) {
      entity.polyline.positions = new Cesium.ConstantProperty(positions)
    }
  }

  // 是否处于编辑状态
  private _ifEditing = false
  public get ifEditing(): boolean {
    return this._ifEditing;
  }

  private set ifEditing(value: boolean) {
    this._ifEditing = value;
    if (this.setIfEditingCB) {
      this.setIfEditingCB(this.ifEditing)
    }
    this.setMovingPointPosition()
    if (!this.viewer) {
      return
    }
    const ids = [
      ID_SPECIAL_MouseMovingPoint,
      ID_SPECIAL_MouseMovingGeometry,
      ID_SPECIAL_MouseMovingPolyline,
    ]
    if (value) {
      for (const id of ids) {
        const entity = this.viewer.entities.getById(id);
        if (entity) {
          entity.show = value
        }
      }
    } else {
      for (const id of ids) {
        const entity = this.viewer.entities.getById(id);
        if (entity) {
          this.viewer.entities.removeById(id)
        }
      }
      this.init()
    }
  }

  // 编辑所属业务
  private _editType: EDIT_TYPE_ENUM = EDIT_TYPE_ENUM.DEFAULT

  private get editType(): EDIT_TYPE_ENUM {
    return this._editType;
  }

  private set editType(value: EDIT_TYPE_ENUM) {
    this._editType = value;
    if (this.setEditTypeCB) {
      this.setEditTypeCB(this.editType)
    }
  }

  public getEditType() {
    return this.editType
  }

  // 对应的事件
  private editHandles: { id: EDIT_TYPE_ENUM, func: () => void }[] = [
    {
      id: EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT_GROUP,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.vdModule) {
          return
        }
        routerPushByName('~fp~:signalLight:signalLightGroupInfo:ins', {xy: 'true'})
      }
    },
    {
      id: EDIT_TYPE_ENUM.UPD_SIGNAL_LIGHT_GROUP,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.vdModule) {
          return
        }
        let id = ''
        const hseids = this.vdModule.getHistorySelectedEntityIds(0);
        if (hseids) {
          id = hseids.data[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        routerPushByName('~fp~:signalLight:signalLightGroupInfo:upd', {id: id, xy: 'true'})
      }
    },
    {
      id: EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.vdModule) {
          return
        }
        let pid = ''
        const hseids = this.vdModule.getHistorySelectedEntityIds(0);
        if (hseids) {
          pid = hseids.data[0].replace(ID_PREFIX_SIGNAL_LIGHT_GROUP, '')
        }
        routerPushByName('~fp~:signalLight:signalLightInfo:ins', {pid: pid, xy: 'true'})
      }
    },
    {
      id: EDIT_TYPE_ENUM.UPD_SIGNAL_LIGHT,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.vdModule) {
          return
        }
        let id = ''
        const hseids = this.vdModule.getHistorySelectedEntityIds(0);
        if (hseids) {
          id = hseids.data[0].replace(ID_PREFIX_SIGNAL_LIGHT, '')
        }
        routerPushByName('~fp~:signalLight:signalLightInfo:upd', {id: id, xy: 'true'})
      }
    },
    {
      id: EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.asModule) {
          return;
        }
        const mouseMovePosition = this.getMouseMovePosition();
        this.asModule.addTempPoints(mouseMovePosition)
      }
    },
    {
      id: EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.asModule) {
          return;
        }
        const mouseMovePosition = this.getMouseMovePosition();
        this.asModule.addTempPoints(mouseMovePosition)
      }
    },
    {
      id: EDIT_TYPE_ENUM.INS_FLIGHT_ROUTE,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.asModule) {
          return;
        }
        const mouseMovePosition = this.getMouseMovePosition();
        this.asModule.addTempPoints(mouseMovePosition)
      }
    },
    {
      id: EDIT_TYPE_ENUM.UPD_FLIGHT_ROUTE,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.asModule) {
          return;
        }
        const mouseMovePosition = this.getMouseMovePosition();
        this.asModule.addTempPoints(mouseMovePosition)
      }
    },
    {
      id: EDIT_TYPE_ENUM.INS_APPLY_AIRSPACE,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.asModule) {
          return;
        }
        const mouseMovePosition = this.getMouseMovePosition();
        this.asModule.addTempPoints(mouseMovePosition)
      }
    },
    {
      id: EDIT_TYPE_ENUM.INS_APPLY_FLIGHT_ROUTE,
      func: () => {
        if (!this.getMouseMovePosition) {
          return
        }
        if (!this.asModule) {
          return;
        }
        const mouseMovePosition = this.getMouseMovePosition();
        this.asModule.addTempPoints(mouseMovePosition)
      }
    }
  ]

  public setEditType(editType: EDIT_TYPE_ENUM | null) {
    if (editType) {
      this.editType = editType;
      this.ifEditing = true;
    } else {
      this.editType = EDIT_TYPE_ENUM.DEFAULT;
      this.ifEditing = false;
    }
  }

  public doEditHandles() {
    if (this.editType && !EDIT_TYPES_SPECIAL_1.includes(this.editType)) {
      this.ifEditing = false
    }
    const find = this.editHandles.find(item => item.id === this.editType);
    if (find) {
      find.func()
    }
  }
}
