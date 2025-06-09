## 一、命令

OSM数据导入PostgreSQL：

```
osm2pgsql -c -d your_database -U your_user -W -H localhost -P 5432 --slim -G --hstore your_data.osm.pbf
```

## 二、数据库结构说明

### 2.1、PostgreSQL：

#### 2.1.1、digital-city-traffic-system：

##### 2.1.1.1、public库：

| 表名                   | 含义                     |
|----------------------|------------------------|
| osm2pgsql_properties | osm2pgsql将一些属性存储在这张表中  |
| planet_osm_line      | 存储线数据（如道路、河流、铁路等）      |
| planet_osm_nodes     | 存储原始 OSM 节点数据          |
| planet_osm_point     | 存储点数据（如 POI、树、标志等）     |
| planet_osm_polygon   | 存储多边形数据（如建筑物、湖泊、土地覆盖等） |
| planet_osm_rels      | 存储原始 OSM 关系数据          |
| planet_osm_roads     | 存储主要道路（优化渲染性能）         |
| planet_osm_ways      | 存储原始 OSM 路径数据          |
| spatial_ref_sys      | 单元格                    |

##### 2.1.1.2、字段含义：

###### osm2pgsql_properties表：

| 字段名      | 字段含义 |
|----------|------|
| property | 属性名称 |
| value    | 属性值  |

###### planet_osm_line表：

| 字段名                | 字段含义                            |
|--------------------|---------------------------------|
| osm_id             | OSM 对象 ID（正数为 way，负数为 relation） |
| access             | 访问权限（如 private、permissive）      |
| addr:housename     | 建筑物名称（非编号）                      |
| addr:housenumber   | 门牌号码                            |
| addr:interpolation | 地址插值方式（如 even、odd）              |
| admin_level        | 行政等级（如 2=国家，4=省）                |
| aerialway          | 架空索道类型（如 cable_car、gondola）     |
| aeroway            | 航空设施（如 runway、taxiway）          |
| amenity            | 便利设施（如 school、hospital）         |
| area               | 是否作为面处理（yes/no）                 |
| barrier            | 障碍物类型（如 fence、wall）             |
| bicycle            |                                 |
| brand              |                                 |
| bridge             |                                 |
| boundary           |                                 |
| building           |                                 |
| construction       |                                 |
| covered            |                                 |
| culvert            |                                 |
| cutting            |                                 |
| denomination       |                                 |
| disused            |                                 |
| embankment         |                                 |
| foot               |                                 |
| generator:source   |                                 |
| harbour            |                                 |
| highway            | 道路类型（如 motorway、footway）        |
| historic           |                                 |
| horse              |                                 |
| intermittent       |                                 |
| junction           |                                 |
| landuse            |                                 |
| layer              |                                 |
| leisure            |                                 |
| lock               |                                 |
| man_made           |                                 |
| military           |                                 |
| motorcar           |                                 |
| name               |                                 |
| natural            |                                 |
| office             |                                 |
| oneway             |                                 |
| operator           |                                 |
| place              |                                 |
| population         |                                 |
| power              |                                 |
| power_source       |                                 |
| public_transport   |                                 |
| railway            | 铁路类型（如 rail、tram）               |
| ref                |                                 |
| religion           |                                 |
| route              |                                 |
| service            |                                 |
| shop               |                                 |
| sport              |                                 |
| surface            |                                 |
| toll               |                                 |
| tourism            |                                 |
| tower:type         |                                 |
| tracktype          |                                 |
| tunnel             |                                 |
| water              |                                 |
| waterway           | 水道类型（如 river、canal）             |
| wetland            |                                 |
| width              |                                 |
| wood               |                                 |
| z_order            | 渲染层级（由 layer、bridge 等计算得出）      |
| way_area           |                                 |
| tags               | 未单独存储的 OSM 标签（hstore 或 JSON）    |
| way                | 几何数据（线类型，PostGIS 格式）            |

**注**：其他字段（如 building、landuse）虽存在，但线表中通常为空（这些标签多用于面数据）。

###### planet_osm_nodes表：

| 字段名  | 字段含义                         |
|------|------------------------------|
| id   | OSM 节点 ID                    |
| lat  | 纬度（WGS84）                    |
| lon  | 经度（WGS84）                    |
| tags | 节点标签（如 {"amenity": "bench"}） |

###### planet_osm_point表：

| 字段名                | 字段含义                                            |
|--------------------|-------------------------------------------------|
| osm_id             | OSM 对象 ID（负数为 node，正数为 way/relation 的 centroid） |
| access             |                                                 |
| addr:housename     |                                                 |
| addr:housenumber   |                                                 |
| addr:interpolation |                                                 |
| admin_level        |                                                 |
| aerialway          |                                                 |
| aeroway            |                                                 |
| amenity            |                                                 |
| area               |                                                 |
| barrier            |                                                 |
| bicycle            |                                                 |
| brand              |                                                 |
| bridge             |                                                 |
| boundary           |                                                 |
| building           |                                                 |
| capital            |                                                 |
| construction       |                                                 |
| covered            |                                                 |
| culvert            |                                                 |
| cutting            |                                                 |
| denomination       |                                                 |
| disused            |                                                 |
| ele                | 海拔高度（单位：米）                                      |
| embankment         |                                                 |
| foot               |                                                 |
| generator:source   |                                                 |
| harbour            |                                                 |
| highway            |                                                 |
| historic           |                                                 |
| horse              |                                                 |
| intermittent       |                                                 |
| junction           |                                                 |
| landuse            |                                                 |
| layer              |                                                 |
| leisure            |                                                 |
| lock               |                                                 |
| man_made           |                                                 |
| military           |                                                 |
| motorcar           |                                                 |
| name               |                                                 |
| natural            |                                                 |
| office             |                                                 |
| oneway             |                                                 |
| operator           |                                                 |
| place              | 地点类型（如 city、village）                            |
| population         |                                                 |
| power              |                                                 |
| power_source       |                                                 |
| public_transport   |                                                 |
| railway            |                                                 |
| ref                |                                                 |
| religion           |                                                 |
| route              |                                                 |
| service            |                                                 |
| shop               | 商店类型（如 supermarket、bakery）                      |
| sport              |                                                 |
| surface            |                                                 |
| toll               |                                                 |
| tourism            | 旅游相关（如 hotel、attraction）                        |
| tower:type         |                                                 |
| tunnel             |                                                 |
| water              |                                                 |
| waterway           |                                                 |
| wetland            |                                                 |
| width              |                                                 |
| wood               |                                                 |
| z_order            |                                                 |
| tags               |                                                 |
| way                | 几何数据（点类型，PostGIS 格式）                            |

**注**：其他字段与 line/polygon 表类似，但仅适用于点状对象（如 POI）。

###### planet_osm_polygon表：

| 字段名                | 字段含义                               |
|--------------------|------------------------------------|
| osm_id             |                                    |
| access             |                                    |
| addr:housename     |                                    |
| addr:housenumber   |                                    |
| addr:interpolation |                                    |
| admin_level        |                                    |
| aerialway          |                                    |
| aeroway            |                                    |
| amenity            |                                    |
| area               |                                    |
| barrier            |                                    |
| bicycle            |                                    |
| brand              |                                    |
| bridge             |                                    |
| boundary           |                                    |
| building           | 建筑物类型（如 yes、house）                 |
| construction       |                                    |
| covered            |                                    |
| culvert            |                                    |
| cutting            |                                    |
| denomination       |                                    |
| disused            |                                    |
| embankment         |                                    |
| foot               |                                    |
| generator:source   |                                    |
| harbour            |                                    |
| highway            |                                    |
| historic           |                                    |
| horse              |                                    |
| intermittent       |                                    |
| junction           |                                    |
| landuse            | 土地用途（如 residential、forest）         |
| layer              |                                    |
| leisure            |                                    |
| lock               |                                    |
| man_made           |                                    |
| military           |                                    |
| motorcar           |                                    |
| name               |                                    |
| natural            | 自然特征（如 water、wood）                 |
| office             |                                    |
| oneway             |                                    |
| operator           |                                    |
| place              |                                    |
| population         |                                    |
| power              |                                    |
| power_source       |                                    |
| public_transport   |                                    |
| railway            |                                    |
| ref                |                                    |
| religion           |                                    |
| route              |                                    |
| service            |                                    |
| shop               |                                    |
| sport              |                                    |
| surface            |                                    |
| toll               |                                    |
| tourism            |                                    |
| tower:type         |                                    |
| tracktype          |                                    |
| tunnel             |                                    |
| water              |                                    |
| waterway           | 面状水道（如 riverbank、dock）             |
| wetland            |                                    |
| width              |                                    |
| wood               |                                    |
| z_order            |                                    |
| way_area           | 多边形面积（单位：投影坐标系，如 Web Mercator 平方米） |
| tags               |                                    |
| way                |                                    |

**注**：面表包含所有可能的多边形标签（如 aeroway=runway 也可能是面）。

###### planet_osm_rels表：

| 字段名     | 字段含义                                  |
|---------|---------------------------------------|
| id      | OSM 关系 ID                             |
| members | 关系成员列表（格式：way/node/relation@role 的数组） |
| tags    | 关系标签（如 {"type": "multipolygon"}）      |

###### planet_osm_roads表：

| 字段名                | 字段含义 |
|--------------------|------|
| osm_id             |      |
| access             |      |
| addr:housename     |      |
| addr:housenumber   |      |
| addr:interpolation |      |
| admin_level        |      |
| aerialway          |      |
| aeroway            |      |
| amenity            |      |
| area               |      |
| barrier            |      |
| bicycle            |      |
| brand              |      |
| bridge             |      |
| boundary           |      |
| building           |      |
| construction       |      |
| covered            |      |
| culvert            |      |
| cutting            |      |
| denomination       |      |
| disused            |      |
| embankment         |      |
| foot               |      |
| generator:source   |      |
| harbour            |      |
| highway            |      |
| historic           |      |
| horse              |      |
| intermittent       |      |
| junction           |      |
| landuse            |      |
| layer              |      |
| leisure            |      |
| lock               |      |
| man_made           |      |
| military           |      |
| motorcar           |      |
| name               |      |
| natural            |      |
| office             |      |
| oneway             |      |
| operator           |      |
| place              |      |
| population         |      |
| power              |      |
| power_source       |      |
| public_transport   |      |
| railway            |      |
| ref                |      |
| religion           |      |
| route              |      |
| service            |      |
| shop               |      |
| sport              |      |
| surface            |      |
| toll               |      |
| tourism            |      |
| tower:type         |      |
| tracktype          |      |
| tunnel             |      |
| water              |      |
| waterway           |      |
| wetland            |      |
| width              |      |
| wood               |      |
| z_order            |      |
| way_area           |      |
| tags               |      |
| way                |      |

**注**：字段与 planet_osm_line 完全一致，但仅包含重要道路（通过 highway 标签筛选，如 motorway、primary）。

###### planet_osm_ways表：

| 字段名   | 字段含义                               |
|-------|------------------------------------|
| id    | OSM 路径 ID                          |
| nodes | 节点 ID 数组（构成路径的点）                   |
| tags  | 路径标签（如 {"highway": "residential"}） |

###### spatial_ref_sys表：

| 字段名       | 字段含义                                      |
|-----------|-------------------------------------------|
| srid      | 空间参考系统 ID（如 4326=WGS84，3857=Web Mercator） |
| auth_name | 标准组织（如 EPSG）                              |
| auth_srid | 该组织定义的 SRS ID                             |
| srtext    | WKT（Well-Known Text）格式的坐标系统描述             |
| proj4text | Proj4 格式的坐标系统定义                           |
