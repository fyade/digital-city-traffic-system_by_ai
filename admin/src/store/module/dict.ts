import { defineStore } from "pinia";
import { DicDataDto } from "@/type/module/main/sysManage/dicData.ts";
import { computed, reactive, Ref, ref } from "vue";
import { dicDataOfPerm } from "@/api/module/main/sysManage/dicData.ts";

export const useDictStore = defineStore('dictStore', () => {
  const dicts = reactive(new Map<string, Ref<DicDataDto[]>>())
  const loadingStatus = reactive(new Map<string, boolean>())
  const errorStatus = reactive(new Map<string, Error>())

  /**
   * 获取字典
   * @param perm
   *
   * // 使用示例
   * // const dict = dictStore.getDict('');
   * // watchEffect(() => {
   * //   if (dict.isLoading.value) {
   * //     console.log('Loading...')
   * //   } else if (dict.error.value) {
   * //     console.error('Error:', dict.error.value)
   * //   } else {
   * //     console.log('Data:', dict.data.value)
   * //   }
   * // })
   */
  const getDict = (perm: string) => {
    if (!dicts.has(perm)) {
      const dataRef = ref<DicDataDto[]>([])
      dicts.set(perm, dataRef)
      loadingStatus.set(perm, true)
      dicDataOfPerm(perm).then(res => {
        dataRef.value = res
      }).catch(err => {
        errorStatus.set(perm, err)
      }).finally(() => {
        loadingStatus.set(perm, false)
      })
    }
    return {
      data: dicts.get(perm)!,
      isLoading: computed(() => loadingStatus.get(perm) || false),
      error: computed(() => errorStatus.get(perm))
    }
  }

  /**
   * 刷新字典
   * @param perm
   */
  const refreshDict = async (perm: string) => {
    loadingStatus.set(perm, true)
    try {
      const data = await dicDataOfPerm(perm)
      if (dicts.has(perm)) {
        dicts.get(perm)!.value = data
      } else {
        dicts.set(perm, ref(data))
      }
      errorStatus.delete(perm)
    } catch (err) {
      errorStatus.set(perm, err as Error)
    } finally {
      loadingStatus.set(perm, false)
    }
  }

  return {
    getDict,
    refreshDict,
  }
})
