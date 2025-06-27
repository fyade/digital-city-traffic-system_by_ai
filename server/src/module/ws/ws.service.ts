import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from "socket.io";
import * as http from "node:http";
import { serverConfig } from "@dcts/config";
import { CacheTokenService } from "../cache/cache.token.service";
import { getTokenUuidFromAuth } from "../../util/RequestUtils";
import { TokenDto } from "../../common/token";

const currentConfig = serverConfig.currentConfig();

@Injectable()
export class WsService implements OnModuleInit {
  private sidTokenMap = new Map<string, TokenDto>();
  private userroleidSocketMap = new Map<string, Socket>();

  constructor(
      private readonly cacheTokenService: CacheTokenService
  ) {
  }

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
    io.on('connection', (socket) => {
      socket.on('message', (data) => {
        const parse = JSON.parse(data) as { msg: string, code: string };
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
   * @param msg
   * @param code
   */
  public async sendMsg(loginRole: string, userId: string, msg: string, code: string = 'dcts200') {
    const socket = this.userroleidSocketMap.get(`${loginRole}---${userId}`);
    if (!socket) {
      return
    }
    socket.emit('message', {msg, code})
  }
}
