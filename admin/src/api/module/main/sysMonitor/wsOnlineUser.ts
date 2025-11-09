import request from "@/api/request.ts";
import { ApiConfig } from "@/type/tablePage.ts";
import { WsOnlineUserDto, WsOnlineUserUpdDto } from "@/type/module/main/sysMonitor/wsOnlineUser.ts";

export const wsOnlineUserApi: ApiConfig<WsOnlineUserDto, WsOnlineUserUpdDto> = {
  selectList: (params) => request({
    url: "/main/sys-monitor/ws-online-user",
    method: "GET",
    params: params,
  }),
  selectAll: () => request({}),
  selectById: () => request({}),
  selectByIds: () => request({}),
  insertOne: () => request({}),
  updateOne: () => request({}),
  insertMore: () => request({}),
  updateMore: () => request({}),
  deleteList: () => request({}),
};
