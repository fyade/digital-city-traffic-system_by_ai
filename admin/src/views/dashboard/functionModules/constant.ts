import * as Cesium from 'cesium'

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
  HEIGHT_POINT: 0,
  COLOR_POINT: Cesium.Color.WHITE,

  HEIGHT_LINE: 0,
  COLOR_LINE: Cesium.Color.WHITE,

  HEIGHT_SIGNAL_LIGHT_GROUP: 0,
  SIGNAL_LIGHT_GROUP_PIC_WIDTH: 32,
  SIGNAL_LIGHT_GROUP_PIC_HEIGHT: 32,

  HEIGHT_SIGNAL_LIGHT: 0.01,
  SIGNAL_LIGHT_PIC_WIDTH: 24,
  SIGNAL_LIGHT_PIC_HEIGHT: 24,

  HEIGHT_VEHICLE: 0.1,
}
