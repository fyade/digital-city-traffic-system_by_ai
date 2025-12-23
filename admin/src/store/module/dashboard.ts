import { defineStore } from "pinia";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { ref } from "vue";

export const useDashboardStore = defineStore('dashboardStore', () => {
  const currentCacheData = new Map<string, any>()
  const setCurrentCacheData = <T>(index: number, data: T) => {
    for (const key of currentCacheData.keys()) {
      if (!key.startsWith(`${location.pathname} `)) {
        currentCacheData.delete(key)
      }
    }
    currentCacheData.set(`${location.pathname} ${index}`, deepClone(data))
  }
  const getCurrentCacheData = <T>(index: number): T | null => {
    const data = currentCacheData.get(`${location.pathname} ${index}`);
    if (data) {
      return deepClone(data)
    }
    return null
  }
  const clearCurrentCacheData = () => {
    currentCacheData.clear()
  }

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

  const ifShowSignalLight = ref<boolean | null>(null)
  const setIfShowSignalLight = (value: boolean) => {
    ifShowSignalLight.value = value
  }
  const getIfShowSignalLight = () => {
    return ifShowSignalLight.value
  }

  const ifShowVehicleRealTime = ref<boolean | null>(null)
  const setIfShowVehicleRealTime = (value: boolean) => {
    ifShowVehicleRealTime.value = value
  }
  const getIfShowVehicleRealTime = () => {
    return ifShowVehicleRealTime.value
  }

  const lastActiveInterval = ref<number | null>(null)
  const setLastActiveInterval = (value: number) => {
    lastActiveInterval.value = value
  }
  const getLastActiveInterval = () => {
    return lastActiveInterval.value
  }

  const ifShowAirspace = ref<boolean | null>(null)
  const setIfShowAirspace = (value: boolean) => {
    ifShowAirspace.value = value
  }
  const getIfShowAirspace = () => {
    return ifShowAirspace.value
  }

  const showAroundDate1 = ref<number | null>(null)
  const setShowAroundDate1 = (value: number) => {
    showAroundDate1.value = value
  }
  const getShowAroundDate1 = () => {
    return showAroundDate1.value
  }

  const showAroundDate2 = ref<number | null>(null)
  const setShowAroundDate2 = (value: number) => {
    showAroundDate2.value = value
  }
  const getShowAroundDate2 = () => {
    return showAroundDate2.value
  }

  const ifShowAircraftRealTime = ref<boolean | null>(null)
  const setIfShowAircraftRealTime = (value: boolean) => {
    ifShowAircraftRealTime.value = value
  }
  const getIfShowAircraftRealTime = () => {
    return ifShowAircraftRealTime.value
  }

  const lastActiveInterval2 = ref<number | null>(null)
  const setLastActiveInterval2 = (value: number) => {
    lastActiveInterval2.value = value
  }
  const getLastActiveInterval2 = () => {
    return lastActiveInterval2.value
  }

  return {
    currentCacheData,
    setCurrentCacheData,
    getCurrentCacheData,
    clearCurrentCacheData,
    idsOfBaseMaps,
    setIdsOfBaseMaps,
    getIdsOfBaseMaps,
    ifShowSignalLight,
    setIfShowSignalLight,
    getIfShowSignalLight,
    ifShowVehicleRealTime,
    setIfShowVehicleRealTime,
    getIfShowVehicleRealTime,
    lastActiveInterval,
    setLastActiveInterval,
    getLastActiveInterval,
    ifShowAirspace,
    setIfShowAirspace,
    getIfShowAirspace,
    showAroundDate1,
    setShowAroundDate1,
    getShowAroundDate1,
    showAroundDate2,
    setShowAroundDate2,
    getShowAroundDate2,
    ifShowAircraftRealTime,
    setIfShowAircraftRealTime,
    getIfShowAircraftRealTime,
    lastActiveInterval2,
    setLastActiveInterval2,
    getLastActiveInterval2,
  }
}, {
  persist: true
})
