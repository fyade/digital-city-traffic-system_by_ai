-- ===== ===== ===== ===== ===== ===== 2025.11.01 ===== ===== ===== ===== ===== =====

alter table public.low_altitude_aircraft
    add type varchar(50);

alter table public.low_altitude_aircraft
    alter column type set not null;

create table public.flight_restriction_zone_user_apply
(
    id          serial PRIMARY KEY,
    aircraft_id int[]                    not null,
    task_name   VARCHAR(500)             NOT NULL,
    geometry    GEOMETRY(POLYGON, 4326)  NOT NULL,
    start_time  TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time    TIMESTAMP WITH TIME ZONE NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);
create table public.flight_route_user_apply
(
    id          serial PRIMARY KEY,
    aircraft_id int[]                    not null,
    task_name   VARCHAR(500)                NOT NULL,
    path        geometry(LineStringZ, 4326) NOT NULL,
    start_time  TIMESTAMP WITH TIME ZONE    NOT NULL,
    end_time    TIMESTAMP WITH TIME ZONE    NOT NULL,
    create_role VARCHAR(30)                 NOT NULL,
    update_role VARCHAR(30)                 NOT NULL,
    create_by   VARCHAR(10)                 NOT NULL,
    update_by   VARCHAR(10)                 NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                     NOT NULL DEFAULT 'N'
);

-- ===== ===== ===== ===== ===== ===== 2025.11.09 ===== ===== ===== ===== ===== =====

alter table public.flight_restriction_zone_user_apply
    add apply_status varchar(20);
alter table public.flight_restriction_zone_user_apply
    add apply_opinion varchar(300);
alter table public.flight_restriction_zone_user_apply
    add files varchar(200);

alter table public.flight_route_user_apply
    add apply_status varchar(20);
alter table public.flight_route_user_apply
    add apply_opinion varchar(300);
alter table public.flight_route_user_apply
    add files varchar(200);

alter table public.flight_restriction_zone_user_apply
    alter column apply_status set not null;
alter table public.flight_restriction_zone_user_apply
    alter column apply_opinion set not null;
alter table public.flight_restriction_zone_user_apply
    alter column files set not null;

alter table public.flight_route_user_apply
    alter column apply_status set not null;
alter table public.flight_route_user_apply
    alter column apply_opinion set not null;
alter table public.flight_route_user_apply
    alter column files set not null;

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
