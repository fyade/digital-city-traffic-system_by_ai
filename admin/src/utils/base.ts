import { CascaderProps } from "element-plus";
import { INS, MORE, N, ONE, UPD, Y } from "@/type/utils/base.ts";

export const allLoginRoles: LV[] = [
  {label: "系统管理员", value: "admin"},
  {label: "访客", value: "visitor"},
];

export class LV {
  label!: string;
  value!: string;
}

export const allTRPDataTypes: LV[] = [
  {label: "全部", value: "ALL"},
  {label: "本部门", value: "SELF_DEPT"},
  {label: "本部门及直属子部门", value: "DEPT_ONE_SON"},
  {label: "本部门及全部子部门", value: "DEPT_ALL_SON"},
  {label: "本角色", value: "SELF_ROLE"},
  {label: "自己", value: "SELF"},
];

export const CONFIG = {
  dialog_width: "800px",
  dialog_width_wider: "calc(100% - 50px)",
  dialog_form_label_width: "120px",
  drawer_size: "calc(100% - 200px)",
};

export const PAGINATION = {
  pageNum: 1,
  pageSize: 10,
};

export const publicDict = {
  id: "主键id",
  remark: "备注",
  orderNum: "顺序",
  ifDefault: "是否默认",
  ifDisabled: "是否禁用",
  createRole: "createRole",
  updateRole: "updateRole",
  createBy: "createBy",
  updateBy: "updateBy",
  createTime: "createTime",
  updateTime: "updateTime",
  deleted: "逻辑删除",
};

export const final: {
  Y: Y;
  N: N;
  DEV: 'dev';
  TEST: 'test';
  PROD: 'prod';
  DEFAULT_PARENT_ID: 0;
  DEFAULT_ORDER_NUM: 0;
  one: ONE;
  more: MORE;
  ins: INS;
  upd: UPD;
} = {
  Y: "Y",
  N: "N",
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
  DEFAULT_PARENT_ID: 0,
  DEFAULT_ORDER_NUM: 0,
  one: "ONE",
  more: "MORE",
  ins: "INS",
  upd: "UPD",
};

export interface PublicDictInterface {
  id: string;
  remark: string;
  orderNum: string;
  ifDefault: string;
  ifDisabled: string;
  createRole: string;
  updateRole: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  deleted: string;
}

export const Operate = {
  success: "操作成功。",
};

export const shift_yes_no = {
  Y: "N",
  N: "Y",
};

export const publicCascaderProps = {
  value: "id",
  label: "label",
  disabled: "casDisbaled",
} as CascaderProps;
// 只能选择最子层
export const cascaderProps3 = {
  disabled: "casDisbaled",
  expandTrigger: "hover",
  emitPath: false, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
} as CascaderProps;
// 可以选择任何层
export const cascaderProps2 = {
  ...publicCascaderProps,
  expandTrigger: "hover",
  emitPath: false, // 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
  checkStrictly: true, // 是否严格的遵守父子节点不互相关联
} as CascaderProps;
// 可以选择任何层且支持多选
export const cascaderProps4 = {
  ...cascaderProps2,
  multiple: true,
} as CascaderProps;
export const cascaderProps1 = {
  ...publicCascaderProps,
  ...cascaderProps3,
} as CascaderProps;
export const cascaderProps1_ = {
  ...{
    ...publicCascaderProps,
    value: "perms",
    label: "name",
  },
  ...cascaderProps3,
} as CascaderProps;

export const datePickerShortcuts = [
  {
    text: '前一小时',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setHours(start.getHours() - 1)
      return [start, end]
    }
  },
  {
    text: '前两小时',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setHours(start.getHours() - 2)
      return [start, end]
    }
  },
  {
    text: '前三小时',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setHours(start.getHours() - 3)
      return [start, end]
    }
  },
  {
    text: '前一天',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 1)
      return [start, end]
    }
  },
  {
    text: '前两天',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 2)
      return [start, end]
    }
  },
  {
    text: '前三天',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 3)
      return [start, end]
    }
  },
  {
    text: '前一周',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '前两周',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 14)
      return [start, end]
    },
  },
  {
    text: '前三周',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 21)
      return [start, end]
    },
  },
  {
    text: '前一月',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '前两月',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 2)
      return [start, end]
    },
  },
  {
    text: '前三月',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
  {
    text: '前半年',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '前一年',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
  {
    text: '前两年',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setFullYear(start.getFullYear() - 2)
      return [start, end]
    },
  },
  {
    text: '前三年',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setFullYear(start.getFullYear() - 3)
      return [start, end]
    },
  },
]
