import { typeOf } from "./base-utils.js";

/**
 * 是否null
 * @param val
 */
export function ifNull<T>(val: T): val is Extract<T, null> {
  return val === null
}

/**
 * 是否非null
 * @param val
 */
export function ifNotNull<T>(val: T): val is Exclude<T, null> {
  return !ifNull(val)
}

/**
 * 是否undefined
 * @param val
 */
export function ifUndefined<T>(val: T): val is Extract<T, undefined> {
  return val === void 0
}

/**
 * 是否非undefined
 * @param val
 */
export function ifNotUndefined<T>(val: T): val is Exclude<T, undefined> {
  return !ifUndefined(val)
}

/**
 * 是否有效
 * @param val
 */
export function ifValid<T>(val: T): val is NonNullable<T> {
  return ifNotNull(val) && ifNotUndefined(val)
}

/**
 * 是否无效
 * @param val
 */
export function ifNotValid<T>(val: T): val is T & (null | undefined) {
  return !ifValid(val)
}

/**
 * 对象是否有某键
 * @param obj
 * @param key
 */
export function ifHasKey(obj: object, key: string) {
  return Object.keys(obj).includes(key)
}

/**
 * 深克隆，由于前后端框架差异，需要在前后端分别二次封装一下
 * @param value
 * @param ignoreKeys
 */
export function _deepClone<T>(value: T, ignoreKeys: string[] = []): T {
  function _(value: any, key?: string) {
    if ((key && ignoreKeys.includes(key)) || value === null || !['array', 'object'].includes(typeOf(value))) {
      return value;
    }
    // =====
    // 构造函数及原型等可在这里做处理
    // =====
    const result = Array.isArray(value) ? [] : {} as any;
    for (const key in value) {
      result[key] = _(value[key], key);
    }
    return result;
  }

  return _(value);
}

/**
 * 复制对象
 * @param to
 * @param from
 * @param ignoreKeys
 */
export function copyObject<T = object>(to: T, from: T, ignoreKeys: string[] = []) {
  for (const key in from) {
    if (!ignoreKeys.includes(key)) {
      to[key] = from[key]
    }
  }
}

/**
 * 清除对象所有值
 * @param to
 */
export function clearObject<T = object>(to: T) {
  for (const key in to) {
    (to as Record<string, string>)![key] = ''
  }
}
