import { objectUtils } from "@dcts/common";

/**
 * 深克隆
 * @param value
 * @param ignoreKeys
 */
export function deepClone<T>(value: T, {
                               ignoreKeys = [],
                             }: {
                               ignoreKeys?: string[]
                             } = {},
): T {
  return objectUtils._deepClone(value, ignoreKeys);
}
