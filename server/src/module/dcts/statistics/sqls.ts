import { VehicleFlowStatisticsDto } from "./dto";
import { final } from "../../../util/base";

export function vehicleFlowSql(dto: VehicleFlowStatisticsDto): string {
  const pointsString = dto.points
    .map(p => `${p.lon} ${p.lat}`)
    .join(', ');
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

export function activeVehiclesLast5MinSql(): string {
  return `
    SELECT COUNT(DISTINCT vehicle_id)::int AS "activeCount"
    FROM public.vehicle_track_point
    WHERE create_time >= NOW() - INTERVAL '5 minutes'
      AND deleted = '${final.N}'
  `;
}
