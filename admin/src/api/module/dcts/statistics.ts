import request from '@/api/request.ts';
import type {
  VehicleFlowStatisticsDto,
  VehicleFlowVo,
  SignalLightStatusDistributionDto,
  SignalLightStatusDistributionVo,
  TrafficOverviewVo,
} from '@/type/module/dcts/statistics.ts';

export function vehicleFlowStatisticsApi(data: VehicleFlowStatisticsDto) {
  return request<VehicleFlowVo[]>({
    url: '/dcts/statistics/vehicle-flow',
    method: 'POST',
    data,
  });
}

export function signalLightStatusApi(data: SignalLightStatusDistributionDto) {
  return request<SignalLightStatusDistributionVo[]>({
    url: '/dcts/statistics/signal-light-status',
    method: 'POST',
    data,
  });
}

export function trafficOverviewApi() {
  return request<TrafficOverviewVo>({
    url: '/dcts/statistics/overview',
    method: 'GET',
  });
}

export function activeVehiclesApi() {
  return request<ActiveVehicleVo[]>({
    url: '/dcts/statistics/active-vehicles',
    method: 'GET',
  });
}

export function congestionApi(data: CongestionDto) {
  return request<CongestionCellVo[]>({
    url: '/dcts/statistics/congestion',
    method: 'POST',
    data,
  });
}

export function activeAircraftApi() {
  return request<ActiveAircraftVo[]>({
    url: '/dcts/statistics/active-aircraft',
    method: 'GET',
  });
}

export function aircraftTrajectoryApi(data: { name: string; startTime: number; endTime: number }) {
  return request<AircraftTrajectoryPointVo[]>({
    url: '/dcts/statistics/aircraft-trajectory',
    method: 'POST',
    data,
  });
}
