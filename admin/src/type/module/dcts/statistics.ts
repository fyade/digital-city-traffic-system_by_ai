export class PolygonPointDto {
  lon!: number;
  lat!: number;
}

export class VehicleFlowStatisticsDto {
  version?: string;
  points!: PolygonPointDto[];
  startTime!: number;
  endTime!: number;
  groupBy?: 'hour' | 'day';
}

export class VehicleFlowVo {
  timeBucket!: string;
  vehicleCount!: number;
}

export class SignalLightStatusDistributionDto {
  version?: string;
  groupIds!: number[];
  timeRange!: [number, number];
}

export class SignalLightStatusDistributionVo {
  signalLightGroupId!: number;
  signalLightChildId!: number;
  color!: string;
  totalDurationMs!: number;
}

export class TrafficOverviewVo {
  totalVehicles!: number;
  totalSignalLightGroups!: number;
  activeVehiclesLast5Min!: number;
}

export class ActiveVehicleVo {
  vehicleId!: number;
  plateNumber!: string;
  vehicleType!: string;
  lastLon!: number;
  lastLat!: number;
  lastSeen!: string;
}
