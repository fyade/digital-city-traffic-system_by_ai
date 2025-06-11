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
