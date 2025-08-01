import { _deepClone } from "./object-utils.js";

/**
 * 数组不重复
 * @param arr
 */
export function arrNoRepeat<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 两数组是否一样
 * @param arr1
 * @param arr2
 */
export function ifSameArray<T>(arr1: T[], arr2: T[]) {
  const a1 = _deepClone(arr1).sort();
  const a2 = _deepClone(arr2).sort();
  return a1.length === a2.length && a1.every((item, index) => a2[index] === item)
}

/**
 * 两个数段是否含有交集
 * @param arr1
 * @param arr2
 */
export function ifHasOverlap<T>(arr1: [T, T], arr2: [T, T]) {
  return (arr1[0] <= arr2[0] && arr2[0] <= arr1[1])
      || (arr1[0] <= arr2[1] && arr2[1] <= arr1[1])
      || (arr1[0] <= arr2[0] && arr2[1] <= arr1[1])
      || (arr2[0] <= arr1[0] && arr1[1] <= arr2[1])
}

/**
 * 两数值数值差值
 * @param arr1
 * @param arr2
 */
export function arrayDelta<T>(arr1: T[], arr2: T[]) {
}

/**
 * 返回删除数组特定下标位置的数据后的数组
 * @param arr
 * @param indices
 * @returns
 */
export function removeElementsByIndices<T>(arr: T[], ...indices: number[]): T[] {
  return arr.filter((_, index) => !indices.includes(index));
}
