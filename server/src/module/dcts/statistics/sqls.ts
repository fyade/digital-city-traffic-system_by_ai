import { VehicleFlowStatisticsDto } from "./dto";
import { final } from "../../../util/base";

export function vehicleFlowSql(dto: VehicleFlowStatisticsDto): string {
  // 确保多边形闭合：如果首尾点不一致，自动补上第一个点
  const pts = dto.points.map(p => ({ lon: p.lon, lat: p.lat }));
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (first.lon !== last.lon || first.lat !== last.lat) {
    pts.push({ lon: first.lon, lat: first.lat });
  }
  const pointsString = pts.map(p => `${p.lon} ${p.lat}`).join(', ');
  const startISO = new Date(dto.startTime).toISOString();
  const endISO = new Date(dto.endTime).toISOString();
  const groupBy = dto.groupBy || 'hour';

  return `
    WITH polygon AS (
      SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${pointsString}))'), 4326) AS geom
    )
    SELECT
      date_trunc('${groupBy}', vtp.create_time AT TIME ZONE 'UTC') AS "timeBucket",
      COUNT(DISTINCT vtp.vehicle_id) AS "vehicleCount"
    FROM public.vehicle_track_point vtp
    WHERE ST_Within(vtp.point, (SELECT geom FROM polygon))
      AND vtp.create_time BETWEEN '${startISO}'::timestamp AND '${endISO}'::timestamp
      AND vtp.deleted = '${final.N}'
    GROUP BY "timeBucket"
    ORDER BY "timeBucket" ASC;
  `;
}

export function activeVehiclesSql(): string {
  return `
    SELECT DISTINCT ON (vtp.vehicle_id)
      vi.id AS "vehicleId",
      vi.plate_number AS "plateNumber",
      vi.vehicle_type AS "vehicleType",
      ST_X(vtp.point) AS "lastLon",
      ST_Y(vtp.point) AS "lastLat",
      vtp.create_time AS "lastSeen"
    FROM vehicle_track_point vtp
    JOIN vehicle_info vi ON vi.id = vtp.vehicle_id AND vi.deleted = '${final.N}'
    WHERE vtp.deleted = '${final.N}'
    ORDER BY vtp.vehicle_id, vtp.create_time DESC
  `;
}

export function activeVehiclesLast5MinSql(): string {
  return `
    SELECT COUNT(DISTINCT vehicle_id)::int AS "activeCount"
    FROM public.vehicle_track_point
    WHERE create_time >= NOW() - INTERVAL '5 minutes'
      AND deleted = '${final.N}'
  `;
}
