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

export function congestionSql(
  minLon: number,
  maxLon: number,
  minLat: number,
  maxLat: number,
  cellsPerSide: number,
): string {
  const lonStep = (maxLon - minLon) / cellsPerSide;
  const latStep = (maxLat - minLat) / cellsPerSide;

  // 生成网格cell的UNION ALL
  const cells: string[] = [];
  for (let i = 0; i < cellsPerSide; i++) {
    for (let j = 0; j < cellsPerSide; j++) {
      const cellMinLon = minLon + i * lonStep;
      const cellMaxLon = cellMinLon + lonStep;
      const cellMinLat = minLat + j * latStep;
      const cellMaxLat = cellMinLat + latStep;
      cells.push(
        `SELECT ${i} AS "cellX", ${j} AS "cellY", ${cellMinLon} AS "minLon", ${cellMaxLon} AS "maxLon", ${cellMinLat} AS "minLat", ${cellMaxLat} AS "maxLat"`,
      );
    }
  }

  return `
    WITH cells AS (
      ${cells.join('\n      UNION ALL\n      ')}
    ),
    active_points AS (
      SELECT vtp.point
      FROM vehicle_track_point vtp
      WHERE vtp.create_time >= NOW() - INTERVAL '15 minutes'
        AND vtp.deleted = '${final.N}'
        AND vtp.point && ST_MakeEnvelope(${minLon}, ${minLat}, ${maxLon}, ${maxLat}, 4326)
    )
    SELECT
      c."cellX",
      c."cellY",
      (c."minLon" + c."maxLon") / 2 AS "cellLon",
      (c."minLat" + c."maxLat") / 2 AS "cellLat",
      COUNT(ap.point)::int AS "vehicleCount",
      CASE
        WHEN COUNT(ap.point) >= 5 THEN 'high'
        WHEN COUNT(ap.point) >= 3 THEN 'medium'
        ELSE 'low'
      END AS "level"
    FROM cells c
    LEFT JOIN active_points ap ON
      ST_X(ap.point) BETWEEN c."minLon" AND c."maxLon"
      AND ST_Y(ap.point) BETWEEN c."minLat" AND c."maxLat"
    GROUP BY c."cellX", c."cellY", c."minLon", c."maxLon", c."minLat", c."maxLat"
    HAVING COUNT(ap.point) > 0
    ORDER BY "vehicleCount" DESC
  `;
}

export function activeAircraftSql(): string {
  return `
    SELECT DISTINCT ON (atp.aircraft_id)
      la.id AS "aircraftId",
      la.name AS "name",
      la.model AS "model",
      ST_X(atp.point) AS "lastLon",
      ST_Y(atp.point) AS "lastLat",
      atp.create_time AS "lastSeen"
    FROM aircraft_track_point atp
    JOIN low_altitude_aircraft la ON la.id = atp.aircraft_id AND la.deleted = '${final.N}'
    WHERE atp.deleted = '${final.N}'
    ORDER BY atp.aircraft_id, atp.create_time DESC
  `;
}

export function aircraftTrajectorySql(aircraftName: string, startTime: number, endTime: number): string {
  const startISO = new Date(startTime).toISOString();
  const endISO = new Date(endTime).toISOString();
  return `
    SELECT
      atp.id,
      atp.aircraft_id AS "aircraftId",
      ST_X(atp.point) AS "lon",
      ST_Y(atp.point) AS "lat",
      atp.heading,
      atp.create_time AS "createTime"
    FROM aircraft_track_point atp
    JOIN low_altitude_aircraft la ON la.id = atp.aircraft_id
    WHERE la.name = '${aircraftName.replace(/'/g, "''")}'
      AND atp.create_time BETWEEN '${startISO}'::timestamp AND '${endISO}'::timestamp
      AND atp.deleted = '${final.N}'
    ORDER BY atp.create_time ASC
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
