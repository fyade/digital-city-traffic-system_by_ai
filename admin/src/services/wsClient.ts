import { io, Socket } from 'socket.io-client'
import { adminConfig } from "@dcts/config";
import { useUserStore } from "@/store/module/user.ts";
import { idUtils, timeUtils } from "@dcts/common";
import { NMessage } from "@/utils/naiveUtils.ts";

const currentConfig = adminConfig.currentConfig();

class EventDataType {
  perm: string
  msg: string
  code: string
  sendTime: string
  sendTimestamp: number

  constructor(perm: string, msg: string, code: string) {
    this.perm = perm;
    this.msg = msg;
    this.code = code;
    const date = new Date();
    this.sendTime = timeUtils.formatDate(date);
    this.sendTimestamp = date.getTime();
  }
}

export class WsClient {
  private static instance: WsClient | null = null;
  private socket: Socket | null = null;
  private events = new Map<string, [string, (data: EventDataType) => Promise<void>][]>();

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
        NMessage.success('WS连接成功。')
        if (!this.socket) {
          return;
        }
      });
      this.socket.on('message', async (data) => {
        const parse = JSON.parse(data) as EventDataType;
        await this.runEvent(parse)
      });
      this.socket.on('disconnect', () => {
        NMessage.error('WS连接断开。')
        this.socket = null
      });
      this.socket.on('connect_error', (err) => {
        NMessage.error('WS连接发生错误。')
        console.error('WS错误', err);
      })
      WsClient.instance = this
    }
    return WsClient.instance
  }

  /**
   * 发送消息
   * @param perm
   * @param msg
   * @param code
   */
  public sendMsg(perm: string, msg: string, code: string = 'dcts200') {
    if (!this.socket) {
      return;
    }
    this.socket.send(JSON.stringify(new EventDataType(perm, msg, code)));
  }

  /**
   * 添加事件
   * @param perm
   * @param funcs
   */
  public addEventListener(perm: string, ...funcs: ((data: EventDataType) => Promise<void>)[]): string[] {
    if (!this.events.get(perm)) {
      this.events.set(perm, [])
    }
    const _funcs = this.events.get(perm);
    const ids: string[] = []
    for (const func of funcs) {
      const id = idUtils.genId();
      _funcs!.push([id, func])
      ids.push(id)
    }
    this.events.set(perm, _funcs!)
    return ids
  }

  /**
   * 移除事件
   * @param perm
   * @param ids
   */
  public removeEventListener(perm: string, ...ids: string[]) {
    const funcs = this.events.get(perm);
    if (!funcs) {
      return
    }
    for (let i = funcs.length - 1; i >= 0; i--) {
      if (ids.includes(funcs[i][0])) {
        funcs.splice(i, 1);
      }
    }
  }

  /**
   * 运行事件
   * @param parse
   * @private
   */
  private async runEvent(parse: EventDataType) {
    if (parse && parse.perm) {
      const funcs = this.events.get(parse.perm);
      if (funcs) {
        for (const func of funcs) {
          await func[1](parse)
        }
      }
    }
  }
}
