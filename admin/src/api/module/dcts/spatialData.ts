import { NodesWithWaysInPolygonDto } from "@/type/module/dcts/spatialData.ts";
import request from "@/api/request.ts";

/**
 * 查询多边形内的所有节点及有连接的道路
 * @param data
 */
export function nodesWithWaysInPolygonApi(data: NodesWithWaysInPolygonDto) {
  return request({
    url: '/dcts/spatial-data/nodes-with-ways-in-polygon',
    method: 'POST',
    data: data,
  })
}
