-- ===== ===== ===== ===== ===== ===== 2025.10.09 ===== ===== ===== ===== ===== =====

create table public.three_d_file_group
(
    id          serial PRIMARY KEY,
    name        VARCHAR(100)             NOT NULL,
    description VARCHAR(100)             NOT NULL,
    order_num   INT                      NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

create table public.three_d_file_unit
(
    id          serial PRIMARY KEY,
    group_id    INT                      NOT NULL,
    name        VARCHAR(100)             NOT NULL,
    description VARCHAR(100)             NOT NULL,
    order_num   INT                      NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

create table public.three_d_file
(
    id          serial PRIMARY KEY,
    unit_id     INT                      NOT NULL,
    file_name   VARCHAR(200)             NOT NULL,
    order_num   INT                      NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

drop table manual_junctions;

-- ===== ===== ===== ===== ===== ===== 2025.10.15 ===== ===== ===== ===== ===== =====

create table public.flight_restriction_zone
(
    id          serial PRIMARY KEY,
    name        VARCHAR(100)             NOT NULL,
    code        VARCHAR(50)              NOT NULL,
    type        VARCHAR(50)              NOT NULL,
    geometry    GEOMETRY(POLYGON, 4326)  NOT NULL,
    descr       VARCHAR(500)             NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- ===== ===== ===== ===== ===== ===== 2025.10.17 ===== ===== ===== ===== ===== =====

create table public.flight_route
(
    id          serial PRIMARY KEY,
    name        VARCHAR(100)                NOT NULL,
    path        geometry(LineStringZ, 4326) NOT NULL,
    create_role VARCHAR(30)                 NOT NULL,
    update_role VARCHAR(30)                 NOT NULL,
    create_by   VARCHAR(10)                 NOT NULL,
    update_by   VARCHAR(10)                 NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                     NOT NULL DEFAULT 'N'
);

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
