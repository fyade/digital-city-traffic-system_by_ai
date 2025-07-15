import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from "socket.io";
import * as http from "node:http";
import { serverConfig } from "@dcts/config";
import { CacheTokenService } from "../cache/cache.token.service";
import { getTokenUuidFromAuth } from "../../util/RequestUtils";
import { TokenDto } from "../../common/token";
import { idUtils, timeUtils } from "@dcts/common";
import { QueueoService } from "../queue/queueo.service";

const currentConfig = serverConfig.currentConfig();

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

class WsEventDataFuncParamType extends EventDataType {
  socketId: string
  userInfo: TokenDto

  constructor(perm: string, msg: string, code: string, socketId: string, userInfo: TokenDto) {
    super(perm, msg, code);
    this.socketId = socketId;
    this.userInfo = userInfo;
  }
}

@Injectable()
export class WsService implements OnModuleInit {
  private sidTokenMap = new Map<string, TokenDto>();
  private userroleidSocketMap = new Map<string, Socket>();
  private events = new Map<string, [string, (data: WsEventDataFuncParamType) => Promise<void>][]>();

  constructor(
      private readonly cacheTokenService: CacheTokenService,
      private readonly queueo: QueueoService,
  ) {
  }

  /**
   * 仅供框架调用，禁止外部调用
   */
  async onModuleInit() {
    await this.init();
  }

  /**
   * 初始化
   * @private
   */
  private async init() {
    const httpServer = http.createServer();
    const io = new Server(httpServer, {path: '/'});
    io.use(async (socket, next) => {
      const token: string | undefined = socket.handshake.auth.token
      if (!token) {
        next(new Error('WS连接未提供token'));
      }
      const decoded = await this.cacheTokenService.verifyToken(getTokenUuidFromAuth(token));
      if (!decoded) {
        next(new Error('WS连接token无效'));
      }
      this.sidTokenMap.set(socket.id, decoded)
      this.userroleidSocketMap.set(`${decoded.loginRole}---${decoded.userid}`, socket)
      next()
    })
    io.on('connection', async (socket) => {
      socket.on('message', async (data) => {
        const tokenDto = this.sidTokenMap.get(socket.id);
        const parse = JSON.parse(data) as EventDataType;
        await this.runEvent(parse, socket.id, tokenDto)
      });
      socket.on('disconnect', () => {
        const tokenDto = this.sidTokenMap.get(socket.id);
        if (tokenDto) {
          this.userroleidSocketMap.delete(`${tokenDto.loginRole}---${tokenDto.userid}`)
        }
        this.sidTokenMap.delete(socket.id);
      });
    });
    httpServer.listen(currentConfig.wsPort, () => {
      console.info(`后端 Socket.IO 服务启动，监听端口${currentConfig.wsPort}`);
    });
  }

  /**
   * 发送消息
   * @param loginRole
   * @param userId
   * @param perm
   * @param msg
   * @param code
   */
  public sendMsg(loginRole: string, userId: string, perm: string, msg: string, code: string = 'dcts200') {
    const socket = this.userroleidSocketMap.get(`${loginRole}---${userId}`);
    if (!socket) {
      return
    }
    socket.emit('message', JSON.stringify(new EventDataType(perm, msg, code)))
  }

  /**
   * 添加事件
   * @param perm
   * @param funcs
   */
  public addEventListener(perm: string, ...funcs: ((data: WsEventDataFuncParamType) => Promise<void>)[]): string[] {
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
   * @param socketId
   * @param userInfo
   * @private
   */
  private async runEvent(parse: EventDataType, socketId: string, userInfo: TokenDto) {
    if (parse && parse.perm) {
      const funcs = this.events.get(parse.perm);
      if (funcs) {
        for (const func of funcs) {
          await func[1]({
            ...parse,
            socketId: socketId,
            userInfo: userInfo
          })
        }
      }
    }
    await this.queueo.addLogOperationWsQueue('ins', {
      socketId: socketId,
      callIp: '???',
      hostName: '???',
      wsPerms: parse?.perm || '???',
      userId: userInfo.userid,
      loginRole: userInfo.loginRole,
      ifSuccess: 'O',
      remark: '',
      createTime: new Date
    })
  }
}
