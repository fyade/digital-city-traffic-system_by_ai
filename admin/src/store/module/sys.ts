import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { getButtons, getSystems, getSysVersion } from "@/api/common/sys.ts";
import { SysDto } from "@/type/module/main/sysManage/sys.ts";
import { useUserStore } from "@/store/module/user.ts";
import { adminConfig } from '@dcts/config'

export const useSysStore = defineStore('sysStore', () => {
  const version = reactive({
    hd: '-.-.--.-',
    qd: adminConfig.currentVersion
  })
  getSysVersion().then(res => {
    version.hd = res
  })

  const currentSystem = ref<SysDto>(new SysDto())
  const setCurrentSystem = (dto: SysDto | null) => {
    currentSystem.value = dto ? dto : new SysDto();
  };
  const getCurrentSystem = computed(() => {
    return currentSystem.value;
  })

  const publicHeader = (): Record<string, string> => ({
    'authorization': `Bearer ${useUserStore().token}`
  })

  const urlAddAuth = (url: string) => {
    const header = publicHeader();
    return `${url}?` + Object.keys(header).map(key => `${key}=${header[key]}`).join('&')
  }

  const visibleButtons = ref(new Map<string, string[]>())
  const setVisibleButtons = (sysPerm: string, buttonPerms: string[]) => {
    visibleButtons.value.set(sysPerm, buttonPerms)
  }
  const getVisibleButtons = () => {
    return visibleButtons.value
  }
  const getVisibleButton = (sysPerm: string, buttonPerm: string) => {
    const newVar = visibleButtons.value.get(sysPerm);
    if (newVar && newVar.includes(buttonPerm)) {
      return true
    }
    return false
  }
  const refreshVisibleButton = async (sysPerm: string) => {
    const systems = await getSystems();
    const find = systems.find(item => item.perms === sysPerm);
    if (!find) {
      return
    }
    const buttons = await getButtons(find.id);
    const buttonPerms = buttons.map(item => item.perms);
    setVisibleButtons(sysPerm, buttonPerms)
  }

  return {
    version,
    setCurrentSystem,
    getCurrentSystem,
    publicHeader,
    urlAddAuth,
    setVisibleButtons,
    getVisibleButtons,
    getVisibleButton,
    refreshVisibleButton,
  }
})
