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

alter table public.flight_route
    add color varchar(20);

alter table public.flight_route
    alter column color set not null;

-- ===== ===== ===== ===== ===== ===== 2025.10.23 ===== ===== ===== ===== ===== =====

create table public.dcts_user
(
    id          varchar(10)                               not null primary key,
    username    varchar(50)                               not null,
    nickname    varchar(50)                               null,
    password    varchar(100)                              not null,
    avatar      varchar(200)                              null,
    sex         varchar(10)                               null,
    email       varchar(50)                               null,
    tel         varchar(15)                               null,
    create_role varchar(30)                               not null,
    update_role varchar(30)                               not null,
    create_by   varchar(10)                               not null,
    update_by   varchar(10)                               not null,
    create_time timestamp(3) default CURRENT_TIMESTAMP(3) not null,
    update_time timestamp(3)                              not null,
    deleted     char         default 'N'                  not null
);

-- ===== ===== ===== ===== ===== ===== 2025.10.25 ===== ===== ===== ===== ===== =====

create table public.low_altitude_aircraft
(
    id                  serial PRIMARY KEY,
    aircraft_name       varchar(300)                              not null,
    serial_number       varchar(300)                              not null,
    registration_number varchar(300)                              not null,
    create_role         varchar(30)                               not null,
    update_role         varchar(30)                               not null,
    create_by           varchar(10)                               not null,
    update_by           varchar(10)                               not null,
    create_time         timestamp(3) default CURRENT_TIMESTAMP(3) not null,
    update_time         timestamp(3)                              not null,
    deleted             char         default 'N'                  not null
);

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
