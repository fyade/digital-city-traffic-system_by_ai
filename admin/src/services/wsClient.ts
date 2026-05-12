import { io, Socket } from 'socket.io-client'
import { adminConfig } from "@dcts/config";
import { useUserStore } from "@/store/module/user.ts";
import { idUtils, timeUtils } from "@dcts/common";
import { messageError, messageSuccess } from "@/utils/MessageUtils.ts";

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
  private defaultCode = 'dcts200';
  private static instance: WsClient | null = null;
  private socket: Socket | null = null;
  private events = new Map<string, [string, (data: EventDataType) => void][]>();
  private ifSelfDisConnect = false

  constructor({
                ifInit = true,
                pageContext = ''
              }: {
                ifInit?: boolean,
                pageContext?: string
              } = {}
  ) {
    this.init({ifInit, pageContext})
  }

  public init({
                ifInit = true,
                pageContext = ''
              }: {
                ifInit?: boolean,
                pageContext?: string
              } = {}
  ) {
    if (ifInit) {
      if (!WsClient.instance) {
        this.socket = io(location.origin, {
          path: currentConfig.VITE_API_WS_PREFIX,
          auth: {
            token: `Bearer ${useUserStore().token}`,
            pageContext: pageContext
          }
        });
        if (!this.socket) {
          return;
        }
        this.socket.on('connect', () => {
          messageSuccess('服务端实时通信连接成功。')
          if (!this.socket) {
            return;
          }
        });
        this.socket.on('message', (data) => {
          try {
            const parse = JSON.parse(data) as EventDataType;
            this.runEvent(parse)
          } catch {
            // Ignore malformed messages
          }
        });
        this.socket.on('disconnect', () => {
          if (this.ifSelfDisConnect) {
            messageSuccess('服务端实时通信连接已正常断开。')
            this.socket = null
          } else {
            messageError('服务端实时通信连接断开，正在尝试重连...')
          }
        });
        this.socket.on('connect_error', (err) => {
          messageError('服务端实时通信连接发生错误。')
          console.error('服务端实时通信错误', err);
        })
        WsClient.instance = this
      }
    }
    return WsClient.instance
  }

  public destroy() {
    if (this.socket) {
      this.ifSelfDisConnect = true
      this.socket.io.reconnection(false)
      this.socket.disconnect()
      this.socket = null
    }
    WsClient.instance = null
  }

  /**
   * 发送消息
   * @param perm
   * @param msg
   * @param code
   */
  public sendMsg(perm: string, msg: string, code: string = this.defaultCode) {
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
  public addEventListener(perm: string, ...funcs: ((data: EventDataType) => void)[]): string[] {
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
  private runEvent(parse: EventDataType) {
    if (parse && parse.perm) {
      const funcs = this.events.get(parse.perm);
      if (funcs) {
        for (const func of funcs) {
          func[1](parse)
        }
      }
    }
  }
}
