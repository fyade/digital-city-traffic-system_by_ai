import { createDiscreteApi, darkTheme, lightTheme, SelectGroupOption, SelectOption } from "naive-ui";
import { final } from "@/utils/base.ts";
import { base } from "@dcts/common";

let discreteApi = createDiscrete();
export let NDialog = discreteApi.dialog
export let NMessage = discreteApi.message
export let NNotification = discreteApi.notification

function createDiscrete(theme: typeof lightTheme | typeof darkTheme | null = null) {
  return createDiscreteApi(
      [
        'dialog',
        'message',
        'notification'
      ],
      {
        configProviderProps: {
          theme: theme
        },
        notificationProviderProps: {
          scrollable: false
        }
      }
  );
}

export function reCreateDiscrete(theme: typeof lightTheme | typeof darkTheme | null = null) {
  discreteApi = createDiscrete(theme)
  NDialog = discreteApi.dialog
  NMessage = discreteApi.message
  NNotification = discreteApi.notification
}

export const nOptionSLSTT: Array<SelectOption | SelectGroupOption> = [
  {label: base.sLSTTTypeDict[base.SLSTTTypeEnum.T_CUSTOM], value: base.SLSTTTypeEnum.T_CUSTOM},
  {label: base.sLSTTTypeDict[base.SLSTTTypeEnum.T_FINE_TUNING], value: base.SLSTTTypeEnum.T_FINE_TUNING},
  {label: base.sLSTTTypeDict[base.SLSTTTypeEnum.T_TOP], value: base.SLSTTTypeEnum.T_TOP},
]
export const nOptionSLSST: Array<SelectOption | SelectGroupOption> = [
  {label: base.sLSSTTypeDict[base.SLSSTTypeEnum.T_DAY], value: base.SLSSTTypeEnum.T_DAY},
]
export const nOptionIfDisabled: Array<SelectOption | SelectGroupOption> = [
  {label: '是', value: final.Y},
  {label: '否', value: final.N},
]
