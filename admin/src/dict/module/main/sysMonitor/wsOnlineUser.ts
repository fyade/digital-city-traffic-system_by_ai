import { publicDict } from "@/utils/base.ts";
import { WsOnlineUserDto } from "@/type/module/main/sysMonitor/wsOnlineUser.ts";

export const wsOnlineUserDict: { [P in keyof WsOnlineUserDto]: string } = {
  ...publicDict,
  userid: "用户id",
  username: "用户名",
  loginRole: "登录身份",
  loginTime: "登录时间",
  loginIp: "登录ip",
  loginOs: "登录系统",
  loginBrowser: "登录浏览器",
  expireTimeStamp: "到期时间",
  pageContext: "页面上下文",
};
