import { isProxy, toRaw } from "vue";
import { objectUtils } from "@dcts/common";

/**
 * 深克隆
 * @param value_
 * @param ignoreKeys
 */
export function deepClone<T>(value_: T, {
                               ignoreKeys = []
                             }: {
                               ignoreKeys?: string[]
                             } = {}
): T {
  const value = isProxy(value_) ? toRaw(value_) : value_;
  return objectUtils._deepClone(value, ignoreKeys)
}
