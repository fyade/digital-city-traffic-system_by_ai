import {
  GetAirspaceInPolygonDto,
  GetVehiclesInPolygonDto,
  NodesWithWaysInPolygonDto,
  QueryVehicleTrajectoryDto,
  SignalLightGroupsInPolygonDto,
} from "./dto";
import { final } from "../../../util/base";
import { publicSqlSelectKey } from "../../../infra/prisma/custom.dto";

export function nodesWithWaysInPolygon(dto: NodesWithWaysInPolygonDto) {
  // 点数组转为字符串
  const pointsstring = dto.points
      .map(item => `${item.lon} ${item.lat}`)
      .join(', ');
  // 公共sql
  const publicSql = `
        FROM planet_osm_line,
             polygon
        WHERE ST_Intersects(planet_osm_line.way, polygon.geom)
          AND highway IN ('motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'service')
          AND (access IS NULL OR access NOT IN ('no', 'private'))
    `;
  // 查询所有道路
  const selAllRoadsSql = `
      WITH polygon AS (SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${pointsstring}))'), 4326) AS geom)
      SELECT osm_id::varchar,
             name,
             highway,
             motorcar,
             st_astext(way) as "way"
          ${publicSql};
  `
  // 查询所有节点
  const selAllNodesSql = `
      WITH polygon AS (SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${pointsstring}))'), 4326) AS geom),
           motor_vehicle_roads AS (SELECT osm_id::varchar,
                                          name,
                                          highway,
                                          motorcar,
                                          way
                                              ${publicSql}),
           nodes_in_polygon AS (SELECT id::varchar,
                                       lat,
                                       lon,
                                       tags,
                                       ST_SetSRID(ST_MakePoint(lon / 10000000.0, lat / 10000000.0), 4326) AS geom
                                FROM planet_osm_nodes
                                WHERE ST_Contains((SELECT geom FROM polygon)
                                          , ST_SetSRID(ST_MakePoint(lon / 10000000.0, lat / 10000000.0), 4326))),
           node_road_connections AS (select n.id,
                                            n.lat,
                                            n.lon,
                                            n.tags,
                                            count(DISTINCT r.osm_id) as "road_count"
                                     from nodes_in_polygon n
                                              join motor_vehicle_roads r on st_dwithin(n.geom, r.way, 0.00001)
                                     group by n.id, n.lat, n.lon, n.tags
                                     having count(distinct r.osm_id) >= 2)
      SELECT id, CAST((lon / 10000000.0) AS FLOAT) AS lon, CAST((lat / 10000000.0) AS FLOAT) AS lat, tags
      FROM node_road_connections;
  `
  const relation = (ids: string[]) => `
      select id::varchar, nodes::varchar[], tags
      from planet_osm_ways
      where id in (${ids.join(', ')});
  `
  return {
    selAllRoadsSql,
    selAllNodesSql,
    relation
  }
}

export function signalLightGroupsInPolygon(points: SignalLightGroupsInPolygonDto['points']) {
  const pointsstring = points
      .map(item => `${item.lon} ${item.lat}`)
      .join(', ');
  const sql = `
      select id                                                      as "id",
             name                                                    as "name",
             concat(st_x(location)::text, ',', st_y(location)::text) as "location",
             description                                             as "description",
             ${publicSqlSelectKey.toString}
      FROM signal_light_group_info
      WHERE deleted = '${final.N}'
        AND ST_Within(location, ST_SetSRID(ST_GeomFromText('POLYGON((${pointsstring}))'), 4326));
  `
  return sql
}

export function signalLightGroupsInPolygon2(ids: number[]) {
  return `
      select id             as "id",
             group_id       as "groupId",
             child_light_id as "childLightId",
             ${publicSqlSelectKey.toString}
      from signal_light_group_child_mapping
      where deleted = '${final.N}'
        and group_id in (${ids.join(', ')});
  `
}

export function signalLightGroupsInPolygon3(ids: number[]) {
  return `
      select id                                                      as "id",
             name                                                    as "name",
             concat(st_x(location)::text, ',', st_y(location)::text) as "location",
             description                                             as "description",
             ${publicSqlSelectKey.toString}
      from signal_light_info
      where deleted = '${final.N}'
        and id in (${ids.join(', ')});
  `
}

export function getVehiclesInPolygon(dto: GetVehiclesInPolygonDto) {
  let end = new Date()
  let start = new Date(end.getTime() - 1000 * dto.lastActiveInterval)
  if (dto.timeRange) {
    start = new Date(dto.timeRange[0])
    end = new Date(dto.timeRange[1])
  }
  return `
      select vtp.id                               as "id",
             vtp.vehicle_id                       as "vehicleId",
             ST_AsText(vtp.point)                 as "point",
             vtp.create_role                      as "createRole",
             vtp.update_role                      as "updateRole",
             vtp.create_by                        as "createBy",
             vtp.update_by                        as "updateBy",
             ${publicSqlSelectKey.kvs.createTime} as "createTime",
             ${publicSqlSelectKey.kvs.updateTime} as "updateTime",
             vtp.deleted                          as "deleted",
             vtp.heading                          as "heading"
      FROM public.vehicle_track_point vtp
      WHERE ST_Within(vtp.point, ST_GeomFromText('POLYGON((${dto.points.map(p => `${p.lon} ${p.lat}`).join(`,`)}))', 4326))
        AND vtp.create_time BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'
        AND vtp.deleted = '${final.N}'
      order by vehicle_id asc, create_time desc;
  `
}

export function queryVehicleTrajectory(dto: QueryVehicleTrajectoryDto, vehicleId: number) {
  return `
      select vtp.id                               as "id",
             vtp.vehicle_id                       as "vehicleId",
             ST_AsText(vtp.point)                 as "point",
             vtp.create_role                      as "createRole",
             vtp.update_role                      as "updateRole",
             vtp.create_by                        as "createBy",
             vtp.update_by                        as "updateBy",
             ${publicSqlSelectKey.kvs.createTime} as "createTime",
             ${publicSqlSelectKey.kvs.updateTime} as "updateTime",
             vtp.deleted                          as "deleted",
             vtp.heading                          as "heading"
      FROM public.vehicle_track_point vtp
      WHERE vtp.vehicle_id = ${vehicleId}
        AND vtp.create_time BETWEEN '${new Date(dto.startTime).toISOString()}' AND '${new Date(dto.endTime).toISOString()}'
        AND vtp.deleted = '${final.N}'
      order by vehicle_id asc, create_time desc;
  `
}

export function getAirspaceInPolygon(dto: GetAirspaceInPolygonDto) {
  const pointsStr = dto.points.map(point => `${point.lon} ${point.lat}`).join(', ');
  const sql1 =  `
      select id                                                                                   as "id",
             name                                                                                 as "name",
             code                                                                                 as "code",
             type                                                                                 as "type",
             replace(replace(replace(st_astext(geometry), 'POLYGON((', ''), '))', ''), ',', ', ') as "geometry",
             descr                                                                                as "descr",
             create_role                                                                          as "createRole",
             update_role                                                                          as "updateRole",
             create_by                                                                            as "createBy",
             update_by                                                                            as "updateBy",
             create_time                                                                          as "createTime",
             update_time                                                                          as "updateTime",
             deleted                                                                              as "deleted"
      from flight_restriction_zone
      where deleted = '${final.N}'
        and st_intersects(
              geometry,
              st_geomfromtext('POLYGON((${pointsStr}))', 4326)
            );
  `
  const sql2 = `
      select id                                                                                   as "id",
             name                                                                                 as "name",
             replace(replace(replace(st_astext(path), 'LINESTRING Z (', ''), ')', ''), ',', ', ') as "path",
             color                                                                                as "color",
             create_role                                                                          as "createRole",
             update_role                                                                          as "updateRole",
             create_by                                                                            as "createBy",
             update_by                                                                            as "updateBy",
             create_time                                                                          as "createTime",
             update_time                                                                          as "updateTime",
             deleted                                                                              as "deleted"
      from flight_route
      where deleted = '${final.N}'
        and st_intersects(
              path,
              st_geomfromtext('POLYGON((${pointsStr}))', 4326)
            );
  `
  return {
    sql1,
    sql2,
  }
}
