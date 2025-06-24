-- 查询多边形内的道路
WITH polygon AS (SELECT ST_SetSRID(
                                ST_GeomFromText('POLYGON((118.91183425663839 32.117620723240584, 118.9450945985852 32.117620725643945, 118.94509851601823 32.139332902678326, 118.91183033923444 32.13933290520689, 118.91183425663839 32.117620723240584))'),
                                4326
                        ) AS geom)
SELECT osm_id, name, highway, motorcar, st_astext(way) as way
FROM planet_osm_line,
     polygon
WHERE ST_Intersects(planet_osm_line.way, polygon.geom)
  AND highway IN ('motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'service')
  AND (access IS NULL OR access NOT IN ('no', 'private'));

-- 查询多边形内的道路的节点
WITH polygon AS (SELECT ST_SetSRID(
                                ST_GeomFromText('POLYGON((118.91183425663839 32.117620723240584, 118.9450945985852 32.117620725643945, 118.94509851601823 32.139332902678326, 118.91183033923444 32.13933290520689, 118.91183425663839 32.117620723240584))'),
                                4326
                        ) AS geom),
     motor_vehicle_roads AS (SELECT osm_id, name, highway, motorcar, way
                             FROM planet_osm_line,
                                  polygon
                             WHERE ST_Intersects(planet_osm_line.way, polygon.geom)
                               AND highway IN ('motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified',
                                               'residential', 'service')
                               AND (access IS NULL OR access NOT IN ('no', 'private'))),
     nodes_in_polygon AS (SELECT id,
                                 lat,
                                 lon,
                                 tags,
                                 ST_SetSRID(ST_MakePoint(lon / 10000000.0, lat / 10000000.0), 4326) AS geom
                          FROM public.planet_osm_nodes
                          WHERE ST_Contains((SELECT geom FROM polygon),
                                            ST_SetSRID(ST_MakePoint(lon / 10000000.0, lat / 10000000.0), 4326))),
     nodes_linked_to_roads AS (SELECT DISTINCT n.id, n.lat, n.lon, n.tags
                               FROM nodes_in_polygon n
                                        JOIN motor_vehicle_roads r
                                             ON ST_DWithin(n.geom, r.way, 0.00001) -- 约1米距离阈值
     )
SELECT *
FROM nodes_linked_to_roads;

