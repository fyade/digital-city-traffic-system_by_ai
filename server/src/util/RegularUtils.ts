// 匹配该格式：数值,数值
export const REGEX_DCTS_GEOM = /^[0-9]+(|.[0-9]+),[0-9]+(|.[0-9]+)$/
export const REGEX_DCTS_GEOM_DESCR = '数值(可包含一个小数点),数值(可包含一个小数点)'

// ===== ===== ===== ===== ===== ===== 字符串匹配 ===== ===== ===== ===== ===== =====
// 至少一个 大小写字母或下划线
export const REGEX_MAIN_STRING_1 = /([a-zA-Z_]+)/g
export const REGEX_MAIN_STRING_1_match = (str: string) => str.match(REGEX_MAIN_STRING_1)

// ===== ===== ===== ===== ===== ===== 全局异常处理 ===== ===== ===== ===== ===== =====
export const REGEX_GLOBAL_EXCEPTION_1 = /^items\.(\d+)\./
export const REGEX_GLOBAL_EXCEPTION_1_match = (str: string) => str.match(REGEX_GLOBAL_EXCEPTION_1)

// ===== ===== ===== ===== ===== ===== 获取数据库信息 ===== ===== ===== ===== ===== =====
export const REGEX_MAIN_APP_1 = /@Authorize\('([^']*)'\)/g
export const REGEX_MAIN_APP_2 = /@Authorize\(\s*{[^}]*}\s*\)/g
export const REGEX_MAIN_APP_3 = /'([^']*)'/
export const REGEX_MAIN_APP_1_match = (str: string) => str.match(REGEX_MAIN_APP_1)
export const REGEX_MAIN_APP_2_match = (str: string) => str.match(REGEX_MAIN_APP_2)
export const REGEX_MAIN_APP_3_match = (str: string) => str.match(REGEX_MAIN_APP_3)

// ===== ===== ===== ===== ===== ===== 代码生成 ===== ===== ===== ===== ===== =====
export const REGEX_MAIN_CODEGEN_regex1 = /\/\/(|\/) .+/;
export const REGEX_MAIN_CODEGEN_regex2 = /^model (\w+) {/;
export const REGEX_MAIN_CODEGEN_regex3 = /^ *([\w-]+) +([\w-?]+) +([\w-@(). "']+) */;
export const REGEX_MAIN_CODEGEN_regex1_test = (str: string) => REGEX_MAIN_CODEGEN_regex1.test(str)
export const REGEX_MAIN_CODEGEN_regex2_test = (str: string) => REGEX_MAIN_CODEGEN_regex2.test(str)
export const REGEX_MAIN_CODEGEN_regex3_test = (str: string) => REGEX_MAIN_CODEGEN_regex3.test(str)

/**
 * 获取数据表名
 * @param str
 */
export function getDBTableName(str: string): string {
  const regExpMatchArray = str.match(/[\u4e00-\u9fa5-]+/);
  let aaa = (regExpMatchArray && regExpMatchArray.length > 0) ? regExpMatchArray[0] : str;
  if (aaa.endsWith('表') && !aaa.endsWith('-表')) {
    aaa = aaa.substring(0, aaa.length - 1);
  }
  return aaa;
}

/**
 * 把字符串根据/或者\分割
 * @param path
 */
export function splitStrByLine(path: string) {
  // 使用正则表达式匹配斜杠或反斜杠，并分割字符串
  return path.split(/\/|\\/).filter(_ => _);
}
