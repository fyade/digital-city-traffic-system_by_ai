import {
  CalculateLightsInPolygonDto,
  CalculateLightsInPolygonVo,
  GetVehiclesInPolygonDto,
  NodesWithWaysInPolygonDto,
  NodesWithWaysInPolygonVo,
  QueryVehicleTrajectoryDto,
  SignalLightGroupsInPolygonDto,
  SignalLightGroupsInPolygonVo,
} from "@/type/module/dcts/spatialData.ts";
import request from "@/api/request.ts";
import { VehicleTrackPointDto } from "@/type/module/dcts/vehicle/vehicleTrackPoint.ts";

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

/**
 * 查询多边形内的所有信号灯组
 * @param data
 */
export function signalLightGroupsInPolygonApi(data: SignalLightGroupsInPolygonDto) {
  return request<SignalLightGroupsInPolygonVo>({
    url: '/dcts/spatial-data/signal-light-groups-in-polygon',
    method: 'POST',
    data: data,
  })
}

/**
 * 计算多边形内的所有信号灯
 * @param data
 */
export function calculateLightsInPolygonApi(data: CalculateLightsInPolygonDto) {
  return request<CalculateLightsInPolygonVo[]>({
    url: '/dcts/spatial-data/calculate-lights-in-polygon',
    method: 'POST',
    data: data,
  })
}

/**
 * 计算多边形内的车辆实时信息
 * @param data
 */
export function getVehiclesInPolygonApi(data: GetVehiclesInPolygonDto) {
  return request({
    url: '/dcts/spatial-data/get-vehicles-in-polygon',
    method: 'POST',
    data: data,
  })
}

/**
 * 查询车辆轨迹
 * @param data
 */
export function queryVehicleTrajectoryApi(data: QueryVehicleTrajectoryDto) {
  return request<VehicleTrackPointDto[]>({
    url: '/dcts/spatial-data/query-vehicle-trajectory',
    method: 'POST',
    data: data,
  })
}
