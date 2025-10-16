import { GetAirspaceInPolygonVo, SignalLightGroupsInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import { deepClone } from "@/utils/ObjectUtils.ts";

class VersionDataType<T> {
  index!: number
  timestamp!: number
  data!: T

  constructor(index: number, data: T) {
    this.index = index;
    this.timestamp = new Date().getTime()
    this.data = data;
  }
}

/**
 * 版本化数据模块
 */
export class VersionDataModule {
  // ===== ===== ===== ===== ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== ===== ===== ===== ===== =====


  // 最大保留数量
  private MAX_LENGTH = 100

  // 曾经选择的实体
  private _history_selectedEntityIds: VersionDataType<string[]>[] = []

  public setHistorySelectedEntityIds(value: string[]) {
    this._history_selectedEntityIds = this.__(value, this._history_selectedEntityIds)
  }

  public getHistorySelectedEntityIds(index = 0, ifLast = true) {
    return this.___(index, this._history_selectedEntityIds, ifLast)
  }

  // 曾经地图可视区域内的信号灯组
  private _history_signalLightGroupsInPolygonVo: VersionDataType<SignalLightGroupsInPolygonVo>[] = []

  public setHistorySignalLightGroupsInPolygonVo(value: SignalLightGroupsInPolygonVo) {
    this._history_signalLightGroupsInPolygonVo = this.__(value, this._history_signalLightGroupsInPolygonVo)
  }

  public getHistorySignalLightGroupsInPolygonVo(index = 0, ifLast = true) {
    return this.___(index, this._history_signalLightGroupsInPolygonVo, ifLast)
  }

  // 运行中（有颜色状态）的子信号灯id
  private _history_runningSignalLightIds: VersionDataType<number[]>[] = []

  public setHistoryRunningSignalLightIds(value: number[]) {
    this._history_runningSignalLightIds = this.__(value, this._history_runningSignalLightIds)
  }

  public getHistoryRunningSignalLightIds(index = 0, ifLast = true) {
    return this.___(index, this._history_runningSignalLightIds, ifLast)
  }

  // 曾经地图可视区域内的空域
  private _history_airspaceInPolygonVo: VersionDataType<GetAirspaceInPolygonVo[]>[] = []

  public setHistoryAirspaceInPolygonVo(value: GetAirspaceInPolygonVo[]) {
    this._history_airspaceInPolygonVo = this.__(value, this._history_airspaceInPolygonVo)
  }

  public getHistoryAirspaceInPolygonVo(index = 0, ifLast = true) {
    return this.___(index, this._history_airspaceInPolygonVo, ifLast)
  }

  //
  private ___<T>(index: number, sour: VersionDataType<T>[], ifLast: boolean) {
    if (ifLast) {
      index = -index
      if (index < 0 || index > sour.length - 1) {
        return null
      }
      return sour[sour.length - 1 - index]
    } else {
      if (index < 0 || index > sour.length - 1) {
        return null
      }
      return sour[index]
    }
  }

  //
  private __<T>(val: T, sour: VersionDataType<T>[], maxLength = this.MAX_LENGTH) {
    const index = this._(sour)
    const oldd = deepClone(sour)
    sour = [
      ...oldd,
      new VersionDataType(index, val)
    ]
    if (sour.length > maxLength) {
      sour.splice(0, 1)
    }
    return sour
  }

  //
  private _<T>(arg: VersionDataType<T>[]) {
    return arg.length === 0 ? 0 : (arg[arg.length - 1].index + 1)
  }
}
