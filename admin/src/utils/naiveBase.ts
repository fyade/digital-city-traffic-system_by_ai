import { createDiscreteApi, SelectGroupOption, SelectOption } from "naive-ui";
import { final, sLSSTTypeDict, SLSSTTypeEnum, sLSTTTypeDict, SLSTTTypeEnum } from "@/utils/base.ts";

export const {
  dialog: NDialog,
  message: NMessage,
  notification: NNotification
} = createDiscreteApi(
    [
      'dialog',
      'message',
      'notification'
    ],
    {
      notificationProviderProps: {
        scrollable: false
      }
    }
)

export const nOptionSLSTT: Array<SelectOption | SelectGroupOption> = [
  {label: sLSTTTypeDict[SLSTTTypeEnum.T_CUSTOM], value: SLSTTTypeEnum.T_CUSTOM},
  {label: sLSTTTypeDict[SLSTTTypeEnum.T_FINE_TUNING], value: SLSTTTypeEnum.T_FINE_TUNING},
  {label: sLSTTTypeDict[SLSTTTypeEnum.T_TOP], value: SLSTTTypeEnum.T_TOP},
]
export const nOptionSLSST: Array<SelectOption | SelectGroupOption> = [
  {label: sLSSTTypeDict[SLSSTTypeEnum.T_DAY], value: SLSSTTypeEnum.T_DAY},
]
export const nOptionIfDisabled: Array<SelectOption | SelectGroupOption> = [
  {label: '是', value: final.Y},
  {label: '否', value: final.N},
]
