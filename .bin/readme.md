## 一、命令

OSM数据导入PostgreSQL：

```
osm2pgsql -c -d your_database --output-pgsql-schema=schema -U your_user -W -H localhost -P 5432 --slim --proj=4326 --hstore your_data.osm.pbf
```

## 二、数据库结构说明

### 2.1、PostgreSQL：

#### 2.1.1、digital-city-traffic-system：

##### 2.1.1.1、public 架构表：

| 表名                 | 含义                                                  |
|--------------------|-----------------------------------------------------|
| planet_osm_nodes   | nodes                                               |
| planet_osm_ways    | ways                                                |
| planet_osm_rels    | relations                                           |
| planet_osm_point   | 从nodes创建的点几何                                        |
| planet_osm_line    | 根据标记type=route方式和关系创建的线几何                           |
| planet_osm_roads   | 包含与line表相同的部分数据，但选定了用于低缩放渲染的属性，它不仅包含道路              |
| planet_osm_polygon | 通过封闭方式和标记为type=multipolygon或type=boundary关系创建的多边形几何 |

##### 2.1.1.2、public 架构表字段含义：

##### 公共字段：

| 字段名     | 含义       | 备注                   |
|---------|----------|----------------------|
| lat     | 纬度       | (Nodes only)lat*10^7 |
| lon     | 经度       | (Nodes only)lon*10^7 |
| nodes   | 节点id数组   | (Ways only)          |
| members | 包含所有关系成员 | (Relations only)     |
| tags    | 其他属性     |                      |

##### nodes表：

| 字段名  | 含义 | 备注 |
|------|----|----|
| id   |    |    |
| lat  |    |    |
| lon  |    |    |
| tags |    |    |

##### rels表：

| 字段名     | 含义 | 备注 |
|---------|----|----|
| id      |    |    |
| members |    |    |
| tags    |    |    |

##### ways表：

| 字段名   | 含义 | 备注 |
|-------|----|----|
| id    |    |    |
| nodes |    |    |
| tags  |    |    |

##### line、point、polygon、roads表：

| 字段名                  | 含义                                            | 备注                  | wiki(https://wiki.openstreetmap.org/wiki/Key:) |
|----------------------|-----------------------------------------------|---------------------|------------------------------------------------|
| osm_id               | 主键id                                          |                     |                                                |
| access               | 道路、铁路或水路的通行限制，同时也可描述设施的使用限制                   |                     |                                                |
| "addr:housename"     | 房屋或建筑物的名称                                     |                     |                                                |
| "addr:housenumber"   | 门牌号                                           |                     |                                                |
| "addr:interpolation" |                                               |                     |                                                |
| admin_level          | 行政级别                                          |                     |                                                |
| aerialway            | 空中通道，如缆车、吊箱式货车、拖曳式索道、高空滑索等                    |                     |                                                |
| aeroway              | 顶级标签，用于支持飞机和航天器飞行的物理基础设施                      |                     |                                                |
| amenity              | 顶级标签，用于描述对游客及居民有用且重要的设施，例如厕所、电话亭、银行、药店、监狱、学校等 |                     |                                                |
| area                 | yes表示这是一条闭合折线围成的区域，no表示折线特征                   |                     |                                                |
| barrier              | 阻挡或阻碍移动的物理结构，仅适用于地面屏障，不适用于水道屏障                |                     |                                                |
| bicycle              | 在道路上骑行时对自行车的限制                                |                     |                                                |
| brand                | 在商店销售的商品或服务的主要品牌，或代表个人拥有或经营的商店的通用身份           |                     |                                                |
| bridge               | 描述某条道路位于桥梁上                                   |                     |                                                |
| boundary             | 指定边界关系的性质，描述行政区域、自然保护区或其他规定区域的范围              |                     |                                                |
| building             | 将给定对象标记为建筑物                                   |                     |                                                |
| capital              | 用于标记一个国家或国家内行政区的首都                            | (point only)        |                                                |
| construction         | 用于标记当前建筑物正在建设                                 |                     |                                                |
| covered              | 用于表示是否被覆盖                                     |                     |                                                |
| culvert              | 涵洞类型                                          |                     |                                                |
| cutting              | 公路或铁路明显低于路面                                   |                     |                                                |
| denomination         | 定义特定宗教的子群体                                    |                     |                                                |
| disused              | 处于合理维修状态但当前未使用                                |                     |                                                |
| ele                  | 海拔高度                                          | (point only)        |                                                |
| embankment           | 供公路、铁路或运河穿越低洼或潮湿区域的堤坝或高架堤岸                    |                     |                                                |
| foot                 | 对行人的通行限制                                      |                     |                                                |
| "generator:source"   | generator产生的能量来源                              |                     |                                                |
| harbour              | 港口标签                                          |                     |                                                |
| highway              | 道路类型                                          |                     |                                                |
| historic             | 具有历史意义的特征                                     |                     |                                                |
| horse                | 骑马的人在道路上的通行权限                                 |                     |                                                |
| intermittent         | 水道和水体是否非永久含水                                  |                     |                                                |
| junction             | 交叉路口的类型                                       |                     |                                                |
| landuse              | 土地的用途                                         |                     |                                                |
| layer                | 交叉元素之间的垂直关系                                   |                     |                                                |
| leisure              | 休闲活动的类型                                       |                     |                                                |
| lock                 | 标记一段以闸门为界的水道，形成船闸                             |                     |                                                |
| man_made             | 添加到景观中的人造结构                                   |                     |                                                |
| military             | 军队使用的设施                                       |                     |                                                |
| motorcar             | 汽车通行限制                                        |                     |                                                |
| name                 | 名称                                            |                     |                                                |
| "natural"            | 自然的景观特征                                       |                     |                                                |
| office               | 主要提供服务的营业场所                                   |                     |                                                |
| oneway               | 单行道                                           |                     |                                                |
| operator             | 直接负责地图对象当前操作的公司、企业、个人或任何其他实体                  |                     |                                                |
| place                | 定义已命名地点的中心或轮廓                                 |                     |                                                |
| population           | 某地大致的公民数量                                     |                     |                                                |
| power                | 发电和配电设施                                       |                     |                                                |
| power_source         |                                               |                     |                                                |
| public_transport     | 公共交通设施                                        |                     |                                                |
| railway              | 铁路和铁路基础设施                                     |                     |                                                |
| ref                  | 参考编号或代码。常用于道路、高速公路出口、路线、大型建筑物入口等              |                     |                                                |
| religion             | 涵盖各种社区设施，包括教堂和忏悔学校                            |                     |                                                |
| route                | 惯常或定期的通行或旅行路线，通常是预先确定并公布的                     |                     |                                                |
| service              | 关于服务公路/铁路/水路，或企业所提供服务的其他信息                    |                     |                                                |
| shop                 | 商店的定位                                         |                     |                                                |
| sport                | 运动场所的定位                                       |                     |                                                |
| surface              | 用于提供表面特征的附加信息                                 |                     |                                                |
| toll                 | 收费站                                           |                     |                                                |
| tourism              | 标记游客感兴趣的地方或事物                                 |                     |                                                |
| "tower:type"         | 塔的类型                                          |                     |                                                |
| tracktype            | 道路类型                                          | (only not in point) |                                                |
| tunnel               | 在隧道中运行的铁路、道路、运河等                              |                     |                                                |
| water                | 内陆水体类型                                        |                     |                                                |
| waterway             | 标记河流或其他类型的水道                                  |                     |                                                |
| wetland              | 湿地类型                                          |                     |                                                |
| width                | 地图项的宽度                                        |                     |                                                |
| wood                 |                                               |                     |                                                |
| z_order              |                                               |                     |                                                |
| way_area             |                                               | (only not in point) |                                                |
| tags                 |                                               |                     |                                                |
| way                  |                                               |                     |                                                |
