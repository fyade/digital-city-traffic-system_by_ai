-- ===== ===== ===== ===== ===== ===== 2025.06.11 ===== ===== ===== ===== ===== =====

CREATE TABLE manual_junctions
(
    id            SERIAL PRIMARY KEY,
    -- 几何字段必须使用PostGIS的geometry类型且带SRID
    geom          GEOMETRY(POINT, 4326) NOT NULL,       -- 路口坐标，WGS84坐标系
    -- GeoServer发布需要的字段
    feature_id    INTEGER GENERATED ALWAYS AS IDENTITY, -- 兼容GeoServer的feature ID

    name          VARCHAR(255),                         -- 路口名
    junction_type VARCHAR(50),                          -- 路口类型

    create_role   VARCHAR(30)              NOT NULL,
    update_role   VARCHAR(30)              NOT NULL,
    create_by     VARCHAR(10)              NOT NULL,
    update_by     VARCHAR(10)              NOT NULL,
    create_time   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted       CHAR(1)                  NOT NULL DEFAULT 'N',

    -- 约束，确保geom字段只能存储点数据
    CONSTRAINT enforce_geotype_geom CHECK (ST_GeometryType(geom) = 'ST_Point'::text
) ,
    -- 约束，确保所有几何数据使用WGS84坐标系（EPSG:4326）
    CONSTRAINT enforce_srid_geom CHECK (ST_SRID(geom) = 4326)
);

-- 创建空间索引
CREATE INDEX idx_manual_junctions_geom ON manual_junctions USING GIST(geom);

-- ===== ===== ===== ===== ===== ===== 2025.06.21 ===== ===== ===== ===== ===== =====

drop table manual_junctions;

CREATE TABLE manual_junctions
(
    id            SERIAL PRIMARY KEY,
    -- 几何字段必须使用PostGIS的geometry类型且带SRID
    geom          GEOMETRY(POINT, 4326) NOT NULL,       -- 路口坐标，WGS84坐标系
    -- GeoServer发布需要的字段
    feature_id    INTEGER GENERATED ALWAYS AS IDENTITY, -- 兼容GeoServer的feature ID

    name          VARCHAR(255),                         -- 路口名
    junction_type VARCHAR(50),                          -- 路口类型

    create_role   VARCHAR(30)              NOT NULL,
    update_role   VARCHAR(30)              NOT NULL,
    create_by     VARCHAR(10)              NOT NULL,
    update_by     VARCHAR(10)              NOT NULL,
    create_time   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted       CHAR(1)                  NOT NULL DEFAULT 'N',

    -- 约束，确保geom字段只能存储点数据
    CONSTRAINT enforce_geotype_geom CHECK (ST_GeometryType(geom) = 'ST_Point'::text
) ,
    -- 约束，确保所有几何数据使用WGS84坐标系（EPSG:4326）
    CONSTRAINT enforce_srid_geom CHECK (ST_SRID(geom) = 4326)
);

-- 创建空间索引
CREATE INDEX idx_manual_junctions_geom ON manual_junctions USING GIST(geom);

-- 创建一个视图，带相比较nodes表多了一个geom字段
CREATE
OR REPLACE VIEW planet_osm_nodes_view AS
SELECT *,
       ST_SetSRID(ST_MakePoint(lon, lat), 4326) AS geom
FROM planet_osm_nodes;

-- ===== ===== ===== ===== ===== ===== 2025.06.22 ===== ===== ===== ===== ===== =====

-- ##################################################
-- 清空 pgsql 中的所有数据，单独导入 江苏省 的数据到 jiangsu schema
-- ##################################################

-- ===== ===== ===== ===== ===== ===== 2025.06.23 ===== ===== ===== ===== ===== =====

set
search_path to jiangsu;

create table jiangsu.table_name
(
    column_name integer not null
        constraint table_name_pk
            primary key
);

-- ===== ===== ===== ===== ===== ===== 2025.06.24 ===== ===== ===== ===== ===== =====

-- ##################################################
-- 清空 pgsql 中的所有数据，单独导入 江苏省 的数据到 public schema
-- ##################################################

-- ===== ===== ===== ===== ===== ===== 2025.06.28 ===== ===== ===== ===== ===== =====

set
search_path to public;

-- 信号灯信息表
create table signal_light_info
(
    id          serial primary key,
    name        varchar(100)             not null,
    location    geometry(Point, 4326)    not null,
    description varchar(100),
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);
create index idx_signal_light_info_location on signal_light_info using gist (location);
alter table public.signal_light_info
    alter column description set not null;

-- ===== ===== ===== ===== ===== ===== 2025.06.30 ===== ===== ===== ===== ===== =====

-- 信号灯信息表 改为 信号灯组信息表
ALTER TABLE signal_light_info RENAME TO signal_light_group_info;
-- 创建子信号灯信息表，结构与信号灯组信息表相同
CREATE TABLE signal_light_info
(
    id          serial PRIMARY KEY,
    name        VARCHAR(100)             NOT NULL,
    location    geometry(Point, 4326)    NOT NULL,
    description VARCHAR(100)             NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- 重命名信号灯组信息表上的索引
ALTER
INDEX idx_signal_light_info_location RENAME TO idx_signal_light_group_info_location;
CREATE INDEX idx_signal_light_info_location ON signal_light_info USING gist (location);
-- 创建信号灯组 - 子信号灯对应表
CREATE TABLE signal_light_group_child_mapping
(
    id             serial PRIMARY KEY,
    group_id       INT NOT NULL,
    child_light_id INT NOT NULL
);

-- 创建子信号灯 - 受控道路对应表
CREATE TABLE signal_light_child_road_mapping
(
    id             serial PRIMARY KEY,
    child_light_id INT NOT NULL,
    road_id        INT NOT NULL
);

-- 给信号灯组-子信号灯对应表添加字段
ALTER TABLE signal_light_group_child_mapping
    ADD COLUMN create_role VARCHAR(30) NOT NULL,
ADD COLUMN update_role VARCHAR(30) NOT NULL,
ADD COLUMN create_by VARCHAR(10) NOT NULL,
ADD COLUMN update_by VARCHAR(10) NOT NULL,
ADD COLUMN create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN deleted CHAR(1) NOT NULL DEFAULT 'N';

-- 给子信号灯-受控道路对应表添加字段
ALTER TABLE signal_light_child_road_mapping
    ADD COLUMN create_role VARCHAR(30) NOT NULL,
ADD COLUMN update_role VARCHAR(30) NOT NULL,
ADD COLUMN create_by VARCHAR(10) NOT NULL,
ADD COLUMN update_by VARCHAR(10) NOT NULL,
ADD COLUMN create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN deleted CHAR(1) NOT NULL DEFAULT 'N';

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
