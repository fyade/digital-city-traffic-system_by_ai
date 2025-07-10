import { createDiscreteApi } from "naive-ui";

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
