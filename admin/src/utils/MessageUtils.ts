import { NDialog, NMessage } from "@/utils/naiveUtils.ts";
import { ifDashboardPage } from "@/utils/DashboardUtils.ts";

/**
 * message.error
 * @param msg
 */
export function messageError(msg: string) {
  if (ifDashboardPage()) {
    NMessage.error(msg)
  } else {
    ElMessage.error(msg)
  }
}

/**
 * messageBox.warning
 * @param msg
 */
export function messageBoxWarning(msg: string) {
  return new Promise((resolve, reject) => {
    if (ifDashboardPage()) {
      NDialog.warning({
        title: '警告',
        content: msg,
        positiveText: '确定',
        closeOnEsc: false,
        maskClosable: false,
        onPositiveClick: () => resolve(null),
        onClose: () => reject(null)
      })
    } else {
      ElMessageBox.alert(msg, '警告')
          .then(() => resolve(null))
          .catch(() => reject(null))
    }
  })
}
