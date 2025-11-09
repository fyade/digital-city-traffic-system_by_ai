import { publicDict } from "@/utils/base.ts";
import { LogUserLoginWsDto } from "@/type/module/main/sysLog/logUserLoginWs.ts";

export const logUserLoginWsDict: { [P in keyof LogUserLoginWsDto]: string } = {
  ...publicDict,
  userId: '用户id',
  loginRole: '登录身份',
  loginIp: '登录ip',
  loginPosition: '登录地',
  loginBrowser: '登录浏览器',
  loginOs: '登录系统',
  ifSuccess: '是否成功',
  failType: '失败类型',
}
