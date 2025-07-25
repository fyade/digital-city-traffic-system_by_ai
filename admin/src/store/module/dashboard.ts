import { defineStore } from "pinia";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { ref } from "vue";

export const useDashboardStore = defineStore('dashboardStore', () => {
  const idsOfBaseMaps = ref<string[][]>([])
  const setIdsOfBaseMaps = (val: string[][]) => {
    const va = deepClone(val);
    for (let i = 0; i < va.length; i++) {
      if (idsOfBaseMaps.value.length <= i) {
        idsOfBaseMaps.value.push(va[i])
      } else {
        idsOfBaseMaps.value[i] = va[i]
      }
    }
  }
  const getIdsOfBaseMaps = () => {
    return idsOfBaseMaps.value
  }

  return {
    idsOfBaseMaps,
    setIdsOfBaseMaps,
    getIdsOfBaseMaps,
  }
}, {
  persist: true
})
