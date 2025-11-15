export const isBrowser = typeof window !== 'undefined' && typeof window.crypto !== 'undefined';

// 用户登录角色
export enum LoginRoleEnum {
  admin = "admin",
  visitor = "visitor",
  dcts = "dcts",
}

export const loginRoleDict = {
  [LoginRoleEnum.admin]: "系统管理员",
  [LoginRoleEnum.visitor]: "访客",
  [LoginRoleEnum.dcts]: "数智交通全域调度系统用户",
};

// 用户登录方式
export enum LoginTypeEnum {
  pw = "pw",
  wai = "wai",
}

export const loginTypeDict = {
  [LoginTypeEnum.pw]: "账号密码登录",
  [LoginTypeEnum.wai]: "WebAuthn登录",
}

// 用户认证类型
export enum AuthTypeEnum {
  token = "token",
  apiKey = "apiKey",
  unknown = "???",
}

export const authTypeDict = {
  [AuthTypeEnum.token]: "token认证",
  [AuthTypeEnum.apiKey]: "apiKey认证",
  [AuthTypeEnum.unknown]: "未知",
};

// 颜色主题
export enum ColorStyleEnum {
  T_LIGHT = "light",
  T_DARK = "dark",
  T_INHERIT = "inherit",
}

export const colorStyleDict = {
  [ColorStyleEnum.T_LIGHT]: "浅色",
  [ColorStyleEnum.T_DARK]: "深色",
  [ColorStyleEnum.T_INHERIT]: "跟随系统",
};

// 菜单
export enum MenuTypeEnum {
  T_MENU = "mm",
  T_COMP = "mc",
  T_IS = "ma",
  T_Inter = "mb",
}

export const menuTypeDict = {
  [MenuTypeEnum.T_MENU]: "菜单",
  [MenuTypeEnum.T_COMP]: "组件",
  [MenuTypeEnum.T_IS]: "接口组",
  [MenuTypeEnum.T_Inter]: "接口",
};

// 菜单 IP 限制
export enum TMWLTypeEnum {
  T_IP = "ip",
  T_HOST = "ho",
}

export const mIWLTypeDict = {
  [TMWLTypeEnum.T_IP]: "ip",
  [TMWLTypeEnum.T_HOST]: "host",
};

// 接口限流
export enum MTTypeEnum {
  T_IP = "ip",
}

export const mTTypeDict = {
  [MTTypeEnum.T_IP]: "ip",
};

// 权限身份类型
export enum UTDPTypeEnum {
  T_ROLE = "ro",
  T_DEPT = "de",
  T_UG = "ug",
}

export const uTDPTypeDict = {
  [UTDPTypeEnum.T_ROLE]: "角色",
  [UTDPTypeEnum.T_DEPT]: "部门",
  [UTDPTypeEnum.T_UG]: "用户组",
};

// 定时任务执行类型
export enum LSTOTTypeEnum {
  T_BYSELF = "by:self",
  T_USERTRIGGER = "user:trigger",
}

export const lSTOTTypeDict = {
  [LSTOTTypeEnum.T_BYSELF]: "系统自动触发",
  [LSTOTTypeEnum.T_USERTRIGGER]: "用户手动触发",
};

// WS操作日志信息来源方
export enum LOWSFTypeEnum {
  T_SYSTEM = "T_SYSTEM",
  T_USER = "T_USER",
}

export const lOWSFTypeDict = {
  [LOWSFTypeEnum.T_SYSTEM]: "系统",
  [LOWSFTypeEnum.T_USER]: "用户",
}


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
  T_WEEK = 'week',
  T_MONTH = 'month',
  T_YEAR = 'year',
  T_FIXED_TIME_PERIOD = 'ftp',
}

export const sLSSTTypeDict = {
  [SLSSTTypeEnum.T_DAY]: '日循环',
  [SLSSTTypeEnum.T_WEEK]: '周循环',
  [SLSSTTypeEnum.T_MONTH]: '月循环',
  [SLSSTTypeEnum.T_YEAR]: '年循环',
  [SLSSTTypeEnum.T_FIXED_TIME_PERIOD]: '固定时间段',
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

// 空域/航线申请状态
export enum AFRASTypeEnum {
  aaa = 'aaa',
  approved = 'approved',
  rejected = 'rejected',
  canceled = 'canceled',
}

export const aFRASTypeDict = {
  [AFRASTypeEnum.aaa]: '待审核',
  [AFRASTypeEnum.approved]: '申请通过',
  [AFRASTypeEnum.rejected]: '申请拒绝',
  [AFRASTypeEnum.canceled]: '已取消',
}
