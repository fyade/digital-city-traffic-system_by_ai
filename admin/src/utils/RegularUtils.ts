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
  return arr
}

/**
 * 把url按照/分割
 * @param url
 */
export function splitUrlByX(url: string): string[] {
  return url.match(/\/[a-zA-Z0-9-]+/g) || []
}

/**
 * 从 RowRemark 中匹配数值，代码生成页面用
 * @param str
 */
export function mysqlLengthFromRowRemark(str: string): string | null {
  const match = str.match(/\@db\.(?:Var|)Char\((\d+)\)/);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

/**
 * 路由路径是否以:参数匹配结尾
 * @param str
 */
export function ifRouterEndsWithParam(str: string) {
  return /\/:[0-9a-zA-Z]+/.test(str);
}

// ===== ===== ===== ===== ===== ===== 以下为 dcts 专用 ===== ===== ===== ===== ===== =====
export function getLonlatFromLinestring(str: string): { lon: number, lat: number }[] {
  const match = str.match(/[0-9., ]+/);
  if (!match) {
    return []
  }
  const ret: { lon: number, lat: number }[] = []
  for (const string of match[0].split(',')) {
    const strings = string.split(' ');
    ret.push({lon: Number(strings[0]), lat: Number(strings[1])})
  }
  return ret
}
