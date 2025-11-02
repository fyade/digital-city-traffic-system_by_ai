// ===== ===== ===== ===== ===== ===== 原生匹配 ===== ===== ===== ===== ===== =====
/**
 * 原生reg匹配
 * @param reg
 * @param str
 * @constructor
 */
export function RegTest(reg: RegExp, str: string) {
  return reg.test(str);
}

/**
 * 原生reg匹配
 * @param reg
 * @param str
 * @constructor
 */
export function StrRegTest(reg: string, str: string) {
  let ques = reg;
  if (ques.startsWith("/")) ques = ques.substring(1);
  if (ques.endsWith("/")) ques = ques.substring(0, ques.length - 1);
  return new RegExp(ques).test(str);
}

// ===== ===== ===== ===== ===== ===== 字符串匹配 ===== ===== ===== ===== ===== =====
// 至少一个 大小写字母或下划线
const REGEX_MAIN_STRING_1 = /([a-zA-Z_]+)/g;

export const REGEX_MAIN_STRING_1_match = (str: string) => {
  return str.match(REGEX_MAIN_STRING_1);
};

/**
 * 把字符串根据/或者\分割
 * @param path
 */
export function splitStrByLine(path: string) {
  // 使用正则表达式匹配斜杠或反斜杠，并分割字符串
  return path.split(/\/|\\/).filter((_) => _);
}

// ===== ===== ===== ===== ===== ===== 数值匹配 ===== ===== ===== ===== ===== =====
/**
 * 匹配数值(含负号)
 * @param str
 */
export function matchNumber2(str: string): number | null {
  const match = str.match(/(-)?\d+/);
  if (match && match.length > 0) {
    return Number(match[0]);
  }
  return null;
}

/**
 * 匹配数值(不含负号)
 * @param str
 */
export function matchNumber(str: string): number | null {
  const match = str.match(/\d+/);
  if (match && match.length > 0) {
    return Number(match[0]);
  }
  return null;
}

/**
 * 字符串中至少包含一个数字
 * @param str
 */
export function atLeastHaveOneNumber(str: string) {
  return /^.*[0-9]+.*$/.test(str);
}

/**
 * 字符串中全是数字(不含非空字符串)
 * @param str
 */
export function ifAllNumber(str: string) {
  return /^\d+$/.test(str);
}

// ===== ===== ===== ===== ===== ===== 全局异常处理 ===== ===== ===== ===== ===== =====
const REGEX_GLOBAL_EXCEPTION_1 = /^items\.(\d+)\./;

export const REGEX_GLOBAL_EXCEPTION_1_match = (str: string) => {
  return str.match(REGEX_GLOBAL_EXCEPTION_1);
};

// ===== ===== ===== ===== ===== ===== 获取数据库信息 ===== ===== ===== ===== ===== =====
const REGEX_MAIN_APP_1 = /@Authorize\('([^']*)'\)/g;

const REGEX_MAIN_APP_2 = /@Authorize\(\s*{[^}]*}\s*\)/g;

const REGEX_MAIN_APP_3 = /'([^']*)'/;

export const REGEX_MAIN_APP_1_match = (str: string) => {
  return str.match(REGEX_MAIN_APP_1);
};

export const REGEX_MAIN_APP_2_match = (str: string) => {
  return str.match(REGEX_MAIN_APP_2);
};

export const REGEX_MAIN_APP_3_match = (str: string) => {
  return str.match(REGEX_MAIN_APP_3);
};

// ===== ===== ===== ===== ===== ===== 代码生成 ===== ===== ===== ===== ===== =====
const REGEX_MAIN_CODEGEN_regex1 = /\/\/(|\/) .+/;

const REGEX_MAIN_CODEGEN_regex2 = /^model (\w+) {/;

export const REGEX_MAIN_CODEGEN_regex3 =
  /^ *([\w-]+) +([\w-?]+) +([\w-@(). "']+) */;

export const REGEX_MAIN_CODEGEN_regex1_test = (str: string) => {
  return REGEX_MAIN_CODEGEN_regex1.test(str);
};

export const REGEX_MAIN_CODEGEN_regex2_test = (str: string) => {
  return REGEX_MAIN_CODEGEN_regex2.test(str);
};

export const REGEX_MAIN_CODEGEN_regex3_test = (str: string) => {
  return REGEX_MAIN_CODEGEN_regex3.test(str);
};

/**
 * 获取数据表名
 * @param str
 */
export function getDBTableName(str: string): string {
  const regExpMatchArray = str.match(/[\u4e00-\u9fa5-]+/);
  let aaa =
    regExpMatchArray && regExpMatchArray.length > 0 ? regExpMatchArray[0] : str;
  if (aaa.endsWith("表") && !aaa.endsWith("-表")) {
    aaa = aaa.substring(0, aaa.length - 1);
  }
  return aaa;
}

/**
 * 从 RowRemark 中匹配数值，代码生成页面用
 * @param str
 */
export function mysqlLengthFromRowRemark(str: string): string | null {
  const match = str.match(/\.(?:Var|)Char\((\d+)\)/);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

// ===== ===== ===== ===== ===== ===== 其他 ===== ===== ===== ===== ===== =====
/**
 * 获取文件名中除了后缀的部分
 * @param str
 */
export function getFilenameWithoutSuffix(str: string) {
  const match = str.match(/^(.*)\.[^\.]+$/);
  if (match) {
    return match[1];
  }
  return str;
}

/**
 * 从 html 文本中提取 script 标签及其 src 指向的地址
 * @param html
 */
export function getScriptTagFromHtmlText(html: string) {
  const regex = /<script\s+[^>]*src="([^"]+)"[^>]*>/gi;
  let match;
  const arr = [];
  while ((match = regex.exec(html)) !== null) {
    arr.push(match[1]); // 捕获的 src 属性值
  }
  return arr;
}

/**
 * 把url按照/分割
 * @param url
 */
export function splitUrlByX(url: string): string[] {
  return url.match(/\/[a-zA-Z0-9-]+/g) || [];
}

/**
 * 路由路径是否以:参数匹配结尾
 * @param str
 */
export function ifRouterEndsWithParam(str: string) {
  return /\/:[0-9a-zA-Z]+/.test(str);
}

/**
 * 匹配存储信息
 * @param str
 */
export function packageMonitorMatchStorage(str: string) {
  return str.match(/(\d+(?:\.\d+)?G)\s+(\d+(?:\.\d+)?G)\s+(\d+(?:\.\d+)?G)\s+(\d+(?:\.\d+)?)%/);
}








// 匹配该格式：数值,数值
export const REGEX_DCTS_GEOM = /^-?\d+(|.\d+),-?\d+(|.\d+)$/
export const REGEX_DCTS_GEOM_DESCR = '数值可包含一个小数点,数值可包含一个小数点'
export const REGEX_DCTS_GEOMETRY = /^-?\d+(\.\d+)? -?\d+(\.\d+)?(, -?\d+(\.\d+)? -?\d+(\.\d+)?){3,}$/
export const REGEX_DCTS_GEOMETRY_DESCR = '数值可包含一个小数点 数值可包含一个小数点(, 数值可包含一个小数点 数值可包含一个小数点){至少3个}'
export const REGEX_DCTS_PATH_Z = /^-?\d+(\.\d+)? -?\d+(\.\d+)? -?\d+(\.\d+)?(, -?\d+(\.\d+)? -?\d+(\.\d+)? -?\d+(\.\d+)?){1,}$/
export const REGEX_DCTS_PATH_Z_DESCR = '数值可包含一个小数点 数值可包含一个小数点 数值可包含一个小数点(, 数值可包含一个小数点 数值可包含一个小数点 数值可包含一个小数点){至少1个}'
export const REGEX_DCTS_ID_ARRAY = /^\d+(,\d+)*$/
export const REGEX_DCTS_ID_ARRAY_DESCR = '正整数(,正整数){至少0个}'
