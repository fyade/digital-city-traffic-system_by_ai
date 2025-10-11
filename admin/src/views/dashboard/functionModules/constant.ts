import * as Cesium from 'cesium'
import { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption } from "naive-ui";

export const ID_PREFIX_POINT = 'ID_PREFIX_POINT::::::::::'
export const ID_PREFIX_LINE = 'ID_PREFIX_LINE::::::::::'

const ID_PREFIX_SPECIAL = 'ID_PREFIX_SPECIAL::::::::::'
export const ID_SPECIAL_MouseMovingPoint = `${ID_PREFIX_SPECIAL}MouseMovingPoint`

// 信号灯组
export const ID_PREFIX_SIGNAL_LIGHT_GROUP = 'ID_PREFIX_SIGNAL_LIGHT_GROUP::::::::::'
// 子信号灯
export const ID_PREFIX_SIGNAL_LIGHT = 'ID_PREFIX_SIGNAL_LIGHT::::::::::'
// 新增子信号灯
export const EDIT_TYPE_1 = {
  label: '新增子信号灯',
  value: 'EDIT_TYPE_1'
}

// 车辆
export const ID_PREFIX_VEHICLE_REAL_TIME = 'ID_PREFIX_VEHICLE_REAL_TIME::::::::::'

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== 默认值 ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
export const CESIUM_DEFAULT = {
  // 点高度
  HEIGHT_POINT: 0,
  // 点颜色
  COLOR_POINT: Cesium.Color.WHITE,

  // 线高度
  HEIGHT_LINE: 0,
  // 线颜色
  COLOR_LINE: Cesium.Color.WHITE,

  // 信号灯组高度
  HEIGHT_SIGNAL_LIGHT_GROUP: 0,
  // 信号灯组图片宽度
  SIGNAL_LIGHT_GROUP_PIC_WIDTH: 32,
  // 信号灯组图片高度
  SIGNAL_LIGHT_GROUP_PIC_HEIGHT: 32,

  // 子信号灯高度
  HEIGHT_SIGNAL_LIGHT: 0.01,
  // 子信号灯图片宽度
  SIGNAL_LIGHT_PIC_WIDTH: 24,
  // 子信号灯图片高度
  SIGNAL_LIGHT_PIC_HEIGHT: 24,

  // 车辆高度
  HEIGHT_VEHICLE: 0.1,
  // 车辆轨迹颜色
  COLOR_VEHICLE_TRAJECTORY: Cesium.Color.GREEN,
  // 车辆轨迹标识高度
  HEIGHT_VEHICLE_TRAJECTORY_MARK: 0.1
}

export type ContextMenuOptionType = Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>;
