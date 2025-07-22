// 菜单
export enum MenuTypeEnum {
  T_MENU = 'mm',
  T_COMP = 'mc',
  T_IS = 'ma',
  T_Inter = 'mb',
}

export const menuTypeDict = {
  [MenuTypeEnum.T_MENU]: '菜单',
  [MenuTypeEnum.T_COMP]: '组件',
  [MenuTypeEnum.T_IS]: '接口组',
  [MenuTypeEnum.T_Inter]: '接口',
};

// 菜单 IP 限制
export enum TMWLTypeEnum {
  T_IP = 'ip',
  T_HOST = 'ho',
}

export const mIWLTypeDict = {
  [TMWLTypeEnum.T_IP]: 'ip',
  [TMWLTypeEnum.T_HOST]: 'host',
};

// 接口限流
export enum MTTypeEnum {
  T_IP = 'ip',
}

export const mTTypeDict = {
  [MTTypeEnum.T_IP]: 'ip',
};

// 权限身份类型
export enum UTDPTypeEnum {
  T_ROLE = 'ro',
  T_DEPT = 'de',
  T_UG = 'ug',
}

export const uTDPTypeDict = {
  [UTDPTypeEnum.T_ROLE]: '角色',
  [UTDPTypeEnum.T_DEPT]: '部门',
  [UTDPTypeEnum.T_UG]: '用户组',
};

// 信号灯策略类型类型
export enum SLSTTTypeEnum {
  T_CUSTOM = 'custom',
  T_FINE_TUNING = 'fineTuning',
  T_TOP = 'top',
}

export const sLSTTTypeDict = {
  [SLSTTTypeEnum.T_CUSTOM]: '固定策略',
  [SLSTTTypeEnum.T_FINE_TUNING]: '微调策略',
  [SLSTTTypeEnum.T_TOP]: '紧急策略',
}

// 信号灯策略调度类型
export enum SLSSTTypeEnum {
  T_DAY = 'day',
}

export const sLSSTTypeDict = {
  [SLSSTTypeEnum.T_DAY]: '日循环',
}

// 信号灯策略参数灯类型
export enum SLSPLTTypeEnum {
  AROUND = 'around',
  LEFT = 'left',
  STRAIGHT = 'straight',
  RIGHT = 'right',
}

export const sLSPLTTypeDict = {
  [SLSPLTTypeEnum.AROUND]: '掉头',
  [SLSPLTTypeEnum.LEFT]: '左转',
  [SLSPLTTypeEnum.STRAIGHT]: '直行',
  [SLSPLTTypeEnum.RIGHT]: '右转',
}

// 信号灯策略参数灯色
export enum SignalLightColorEnum {
  GREEN = 'green',
  YELLOW = 'yellow',
  RED = 'red',
  NONE = 'none',
}

export const signalLightColorDict = {
  [SignalLightColorEnum.GREEN]: '绿',
  [SignalLightColorEnum.YELLOW]: '黄',
  [SignalLightColorEnum.RED]: '红',
  [SignalLightColorEnum.NONE]: '无',
}

// 信号灯样式类型
export enum SignalLightUnitStyleEnum {
  AROUND = 'around',
  LEFT = 'left',
  STRAIGHT = 'straight',
  RIGHT = 'right',
  ROUND = 'round',
  NUMBER = 'number',
}

export const signalLightUnitStyleDict = {
  [SignalLightUnitStyleEnum.AROUND]: '掉头灯',
  [SignalLightUnitStyleEnum.LEFT]: '左转灯',
  [SignalLightUnitStyleEnum.STRAIGHT]: '直行灯',
  [SignalLightUnitStyleEnum.RIGHT]: '右转灯',
  [SignalLightUnitStyleEnum.ROUND]: '圆灯',
  [SignalLightUnitStyleEnum.NUMBER]: '倒计时',
}

export enum AuthTypeEnum {
  token = 'token',
  apiKey = 'apiKey',
  unknown = '???',
}

export const base = {
  Y: 'Y',
  N: 'N',
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
};

export type CountSqlReturnDto = [{ count: number }]
