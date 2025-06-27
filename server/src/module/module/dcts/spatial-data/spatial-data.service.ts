import { Injectable } from '@nestjs/common';
import { R } from "../../../../common/R";
import { NodesWithWaysInPolygonDto } from "./dto";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";

@Injectable()
export class SpatialDataService {
  constructor(
      private readonly pgprismao: PostgresqlPrismaoService
  ) {
  }

  async nodesWithWaysInPolygon(dto: NodesWithWaysInPolygonDto): Promise<R> {
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
        SELECT osm_id,
               name,
               highway,
               motorcar,
               st_astext(way) as way
        ${publicSql};
    `
    // 查询所有节点
    const selAllNodesSql = `
        WITH polygon AS (SELECT ST_SetSRID(ST_GeomFromText('POLYGON((${pointsstring}))'), 4326) AS geom),
             motor_vehicle_roads AS (SELECT osm_id,
                                            name,
                                            highway,
                                            motorcar,
                                            way
                                     ${publicSql}),
             nodes_in_polygon AS (SELECT id,
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
                                              count(DISTINCT r.osm_id) as road_count
                                       from nodes_in_polygon n
                                                join motor_vehicle_roads r on st_dwithin(n.geom, r.way, 0.00001)
                                       group by n.id, n.lat, n.lon, n.tags
                                       having count(distinct r.osm_id) >= 2)
        SELECT id, CAST((lon / 10000000.0) AS FLOAT) AS lon, CAST((lat / 10000000.0) AS FLOAT) AS lat, tags
        FROM node_road_connections;
    `
    const allRoads = await this.pgprismao.$queryRawUnsafe(selAllRoadsSql);
    const allNodes = await this.pgprismao.$queryRawUnsafe(selAllNodesSql);
    return R.ok({
      allRoads,
      allNodes
    });
  }
}
