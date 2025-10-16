import * as Cesium from 'cesium'
import { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption } from "naive-ui";

export enum EDIT_TYPE_ENUM {
  DEFAULT = 'default',
  INS_SIGNAL_LIGHT_GROUP = 'INS_SIGNAL_LIGHT_GROUP',
  UPD_SIGNAL_LIGHT_GROUP = 'UPD_SIGNAL_LIGHT_GROUP',
  INS_SIGNAL_LIGHT = 'INS_SIGNAL_LIGHT',
  UPD_SIGNAL_LIGHT = 'UPD_SIGNAL_LIGHT',
  INS_FLIGHT_RESTRICTION_ZONE = 'INS_FLIGHT_RESTRICTION_ZONE',
  UPD_FLIGHT_RESTRICTION_ZONE = 'UPD_FLIGHT_RESTRICTION_ZONE',
}

export const EDIT_TYPE_DICT = {
  [EDIT_TYPE_ENUM.DEFAULT]: '',
  [EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT_GROUP]: '新增信号灯组',
  [EDIT_TYPE_ENUM.UPD_SIGNAL_LIGHT_GROUP]: '修改信号灯组',
  [EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT]: '新增子信号灯',
  [EDIT_TYPE_ENUM.UPD_SIGNAL_LIGHT]: '修改子信号灯',
  [EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE]: '新增限飞区',
  [EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE]: '修改限飞区',
}
export const NOT_END_EDIT_TYPE = [
  EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE,
  EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE
]

export const ID_PREFIX_POINT = 'ID_PREFIX_POINT::::::::::'
export const ID_PREFIX_LINE = 'ID_PREFIX_LINE::::::::::'

const ID_PREFIX_SPECIAL = 'ID_PREFIX_SPECIAL::::::::::'
export const ID_SPECIAL_MouseMovingPoint = `${ID_PREFIX_SPECIAL}MouseMovingPoint`
export const ID_SPECIAL_MouseMovingGeometry = `${ID_PREFIX_SPECIAL}MouseMovingGeometry`

// 信号灯组
export const ID_PREFIX_SIGNAL_LIGHT_GROUP = 'ID_PREFIX_SIGNAL_LIGHT_GROUP::::::::::'
// 子信号灯
export const ID_PREFIX_SIGNAL_LIGHT = 'ID_PREFIX_SIGNAL_LIGHT::::::::::'

// 车辆
export const ID_PREFIX_VEHICLE_REAL_TIME = 'ID_PREFIX_VEHICLE_REAL_TIME::::::::::'

// 限飞区
export const ID_PREFIX_FLIGHT_RESTRICTION_ZONE = 'ID_PREFIX_FLIGHT_RESTRICTION_ZONE::::::::::'

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
  HEIGHT_VEHICLE_TRAJECTORY_MARK: 0.1,

  // 限飞区高度
  HEIGHT_FLIGHT_RESTRICTION_ZONE: 0.02,
  // 限飞区默认颜色
  COLOR_DEFAULT_FLIGHT_RESTRICTION_ZONE: Cesium.Color.BLUE.withAlpha(0.2),
  COLOR_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE: Cesium.Color.BLUE.withAlpha(0.35),
  WIDTH_OUTLINE_DEFAULT_FLIGHT_RESTRICTION_ZONE: 10,
  // 禁飞区
  COLOR_JFQ_FLIGHT_RESTRICTION_ZONE: Cesium.Color.RED.withAlpha(0.2),
  COLOR_OUTLINE_JFQ_FLIGHT_RESTRICTION_ZONE: Cesium.Color.RED.withAlpha(0.35),
  // 限高区
  COLOR_XGQ_FLIGHT_RESTRICTION_ZONE: Cesium.Color.GREY.withAlpha(0.2),
  COLOR_OUTLINE_XGQ_FLIGHT_RESTRICTION_ZONE: Cesium.Color.GREY.withAlpha(0.35),
}

export type ContextMenuOptionType = Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>;
