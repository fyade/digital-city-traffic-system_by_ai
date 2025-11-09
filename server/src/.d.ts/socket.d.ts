import { WsTokenDto } from '../common/token';
import { IpInfoDto } from '../common/ipInfo';

interface SocketDataUser extends WsTokenDto {}

interface SocketDataIpInfo extends IpInfoDto {}

interface SocketData {
  user: SocketDataUser;
  ipInfo: SocketDataIpInfo;
}

declare module 'socket.io' {
  interface Socket {
    data: SocketData;
  }
}
