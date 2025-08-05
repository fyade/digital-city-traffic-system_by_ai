-- ===== ===== ===== ===== ===== ===== 2025.08.06 ===== ===== ===== ===== ===== =====

-- 车辆信息表
create table public.vehicle_info
(
    id           serial PRIMARY KEY,
    plate_number VARCHAR(20)              NOT NULL,
    vehicle_type VARCHAR(20)              NOT NULL,
    brand        VARCHAR(50)              NOT NULL,
    color        VARCHAR(20)              NOT NULL,
    create_role  VARCHAR(30)              NOT NULL,
    update_role  VARCHAR(30)              NOT NULL,
    create_by    VARCHAR(10)              NOT NULL,
    update_by    VARCHAR(10)              NOT NULL,
    create_time  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted      CHAR(1)                  NOT NULL DEFAULT 'N'
);
-- 车辆轨迹点表
create table public.vehicle_track_point
(
    id          serial PRIMARY KEY,
    vehicle_id  INT                      NOT NULL,
    point       GEOMETRY(POINT, 4326) NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);
CREATE INDEX idx_track_point ON vehicle_track_point USING GIST(point);

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
