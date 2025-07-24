import { defineStore } from "pinia";
import { ref } from "vue";
import { base } from "@dcts/common";

export const useSysConfigStore = defineStore('sysConfigStore', () => {
  const menuCollapse = ref(false)
  const getMenuCollapse = () => {
    return menuCollapse.value
  }
  const setMenuCollapse = (b: boolean) => {
    menuCollapse.value = b
  }
  const colorStyle = ref<base.ColorStyleEnum>(base.ColorStyleEnum.T_LIGHT)
  const getColorStyle = () => {
    return colorStyle.value
  }
  const setColorStyle = (color: base.ColorStyleEnum) => {
    colorStyle.value = color
  }
  return {
    // 请勿使用 menuCollapse、colorStyle
    menuCollapse,
    getMenuCollapse,
    setMenuCollapse,
    colorStyle,
    getColorStyle,
    setColorStyle,
  }
}, {
  persist: true,
})
