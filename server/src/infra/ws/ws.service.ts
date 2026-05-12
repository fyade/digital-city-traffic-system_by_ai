import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import * as http from 'node:http';
import { serverConfig } from '@dcts/config';
import { CacheTokenService } from '../cache/cache.token.service';
import { getTokenUuidFromAuth } from '../../util/RequestUtils';
import { TokenDto, WsTokenDto } from '../../common/token';
import { idUtils, timeUtils } from '@dcts/common';
import { QueueoService } from '../queue/queueo.service';
import { final } from '../../util/base';
import { UAParser } from 'ua-parser-js';
import { IpInfoDto } from '../../common/ipInfo';
import { base, objectUtils } from '@dcts/common';
import { PrismaoService } from '../prisma/prismao.service';
import { MysqlPrismaoService } from '../prisma/mysql.prismao.service';

const currentConfig = serverConfig.currentConfig();

class EventDataType {
  perm: string;
  msg: string;
  code: string;
  sendTime: string;
  sendTimestamp: number;

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
  socketId: string;
  userInfo: TokenDto;

  constructor(perm: string, msg: string, code: string, socketId: string, userInfo: TokenDto) {
    super(perm, msg, code);
    this.socketId = socketId;
    this.userInfo = userInfo;
  }
}

@Injectable()
export class WsService {
  private defaultCode = 'dcts200';
  private LOGIN_ROLE__USER_ID = 'LOGIN_ROLE:::USER_ID:::';
  private PAGE_CONTEXT = 'PAGE_CONTEXT:::';

  private io: Server | null = null;
  private events = new Map<string, [string, (data: WsEventDataFuncParamType) => Promise<void>][]>();

  private onlineUsers = new Map<string, WsTokenDto>();

  constructor(
    private readonly prismao: PrismaoService,
    private readonly mysqlPrismao: MysqlPrismaoService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly queueo: QueueoService,
  ) {
    this.init();
  }

  getOnlineUsers() {
    return this.onlineUsers;
  }

  /**
   * 初始化
   * @private
   */
  private async init() {
    const httpServer = http.createServer();
    this.io = new Server(httpServer, { path: '/' });
    this.io.use(async (socket, next) => {
      let ifSuccess = true;
      let failType = '';
      let remark = '';
      const token: string | undefined = socket.handshake.auth.token;
      if (!token) {
        ifSuccess = false;
        failType = 'NOT_HAVE_TOKEN';
        remark = 'WS连接未提供token';
      }
      const decoded = await this.cacheTokenService.verifyToken(getTokenUuidFromAuth(token));
      if (!decoded) {
        ifSuccess = false;
        failType = 'INVALID_TOKEN';
        remark = 'WS连接token无效';
      }
      const pageContext: string | undefined = socket.handshake.auth.pageContext;
      const ua = UAParser(socket.handshake.headers['user-agent']);
      const ipInfo = {
        ip: socket.handshake.address,
        host: socket.handshake.headers.host,
        browser: ua.browser.toString(),
        os: ua.os.toString(),
        proto: '???',
        referer: socket.handshake.headers.referer,
      };
      if (ifSuccess) {
        socket.data.user = { ...decoded, pageContext: objectUtils.ifValid(pageContext) ? pageContext : null };
        socket.data.ipInfo = ipInfo;
        socket.join(`${this.LOGIN_ROLE__USER_ID}${decoded.loginRole}:::${decoded.userid}`);
        if (pageContext) {
          socket.join(`${this.PAGE_CONTEXT}${pageContext}`);
        }
      }
      await this.mysqlPrismao.log_user_login_ws.create({
        data: {
          user_id: decoded.userid,
          login_role: decoded.loginRole,
          login_ip: ipInfo.ip,
          login_position: '',
          login_browser: ipInfo.browser,
          login_os: ipInfo.os,
          if_success: ifSuccess ? final.Y : final.N,
          fail_type: failType,
          remark: remark,
          ...this.prismao.defaultInsArg({
            ifCreateRole: false,
            ifUpdateRole: false,
            ifCreateBy: false,
            ifUpdateBy: false,
            ifUpdateTime: false,
            ifDeleted: false,
          }).data,
        },
      });
      if (!ifSuccess) {
        next(new Error(remark));
      }
      next();
    });
    this.io.on('connection', async (socket) => {
      this.onlineUsers.set(`${socket.data.user.loginRole}:::${socket.data.user.userid}`, socket.data.user);
      socket.on('message', async (data) => {
        try {
          const parse = JSON.parse(data) as EventDataType;
          await this.runEvent(parse, socket.id, socket.data.user, socket.data.ipInfo);
        } catch {
          // Ignore malformed WebSocket messages
        }
      });
      socket.on('disconnect', () => {
        this.onlineUsers.delete(`${socket.data.user.loginRole}:::${socket.data.user.userid}`);
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
  public sendMsg(loginRole: string, userId: string, perm: string, msg: string, code: string = this.defaultCode) {
    const userSocketRoomId = `${this.LOGIN_ROLE__USER_ID}${loginRole}:::${userId}`;
    this.io.to(userSocketRoomId).emit('message', JSON.stringify(new EventDataType(perm, msg, code)));
  }

  /**
   * 发送消息(根据页面上下文)
   * @param pageContext
   * @param perm
   * @param msg
   * @param code
   */
  public sendMsgByPageContext(pageContext: string, perm: string, msg: string, code: string = this.defaultCode) {
    const userSocketRoomId = `${this.PAGE_CONTEXT}${pageContext}`;
    this.io.to(userSocketRoomId).emit('message', JSON.stringify(new EventDataType(perm, msg, code)));
  }

  /**
   * 添加事件
   * @param perm
   * @param funcs
   */
  public addEventListener(perm: string, ...funcs: ((data: WsEventDataFuncParamType) => Promise<void>)[]): string[] {
    if (!this.events.get(perm)) {
      this.events.set(perm, []);
    }
    const _funcs = this.events.get(perm);
    const ids: string[] = [];
    for (const func of funcs) {
      const id = idUtils.genId();
      _funcs!.push([id, func]);
      ids.push(id);
    }
    this.events.set(perm, _funcs!);
    return ids;
  }

  /**
   * 移除事件
   * @param perm
   * @param ids
   */
  public removeEventListener(perm: string, ...ids: string[]) {
    const funcs = this.events.get(perm);
    if (!funcs) {
      return;
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
   * @param ipInfo
   * @private
   */
  private async runEvent(parse: EventDataType, socketId: string, userInfo: TokenDto, ipInfo: IpInfoDto) {
    if (parse && parse.perm) {
      const funcs = this.events.get(parse.perm);
      if (funcs) {
        for (const func of funcs) {
          await func[1]({ ...parse, socketId: socketId, userInfo: userInfo });
        }
      }
    }
    await this.queueo.addLogOperationWsQueue('ins', {
      socketId: socketId,
      callIp: ipInfo.ip,
      hostName: ipInfo.host,
      wsPerms: parse.perm,
      userId: userInfo.userid,
      loginRole: userInfo.loginRole,
      reqParam: parse.msg,
      from: base.LOWSFTypeEnum.T_USER,
      ifSuccess: final.O,
      remark: '',
      createTime: new Date(),
    });
  }
}
