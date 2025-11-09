import { publicDict } from "@/utils/base.ts";
import { LogOperationWsDto } from "@/type/module/main/sysLog/logOperationWs.ts";

export const logOperationWsDict: { [P in keyof LogOperationWsDto]: string } = {
  ...publicDict,
  socketId: 'socketId',
  callIp: '请求源ip',
  hostName: '请求源地址',
  wsPerms: '权限标识',
  userId: '用户id',
  loginRole: '登录身份',
  reqParam: '请求参数',
  from: '请求方',
  ifSuccess: '是否成功',
}
