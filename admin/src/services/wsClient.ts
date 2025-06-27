import { io, Socket } from 'socket.io-client'
import { adminConfig } from "@dcts/config";
import { useUserStore } from "@/store/module/user.ts";

const currentConfig = adminConfig.currentConfig();

export class WsClient {
  private static instance: WsClient | null = null;
  private socket: Socket | null = null;

  constructor() {
    if (!WsClient.instance) {
      this.socket = io(location.origin, {
        path: currentConfig.VITE_API_WS_PREFIX,
        auth: {
          token: `Bearer ${useUserStore().token}`
        }
      });
      if (!this.socket) {
        return;
      }
      this.socket.on('connect', () => {
        if (!this.socket) {
          return;
        }
      });
      this.socket.on('message', (data) => {
        const parse = JSON.parse(data) as { msg: string, code: string };
      });
      this.socket.on('disconnect', () => {
        this.socket = null
      });
      this.socket.on('connect_error', (err) => {
        console.error('WS错误', err);
      })
      WsClient.instance = this
    }
    return WsClient.instance
  }

  public async sendMsg(msg: string, code: string = 'dcts200') {
    if (!this.socket) {
      return;
    }
    this.socket.send({msg, code})
  }
}
