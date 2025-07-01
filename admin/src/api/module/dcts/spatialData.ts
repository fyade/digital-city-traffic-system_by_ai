import {
  NodesWithWaysInPolygonDto,
  NodesWithWaysInPolygonVo,
  SignalLightGroupsInPolygonDto
} from "@/type/module/dcts/spatialData.ts";
import request from "@/api/request.ts";
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";

/**
 * 查询多边形内的所有节点及有连接的道路
 * @param data
 */
export function nodesWithWaysInPolygonApi(data: NodesWithWaysInPolygonDto) {
  return request<NodesWithWaysInPolygonVo>({
    url: '/dcts/spatial-data/nodes-with-ways-in-polygon',
    method: 'POST',
    data: data,
  })
}

export function signalLightGroupsInPolygonApi(data: SignalLightGroupsInPolygonDto) {
  return request<SignalLightGroupInfoDto[]>({
    url: '/dcts/spatial-data/signal-light-groups-in-polygon',
    method: 'POST',
    data: data,
  })
}
