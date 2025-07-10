-- ===== ===== ===== ===== ===== ===== 2025.07.07 ===== ===== ===== ===== ===== =====

-- 信号灯策略类型表
create table public.signal_light_strategy_type
(
    id          serial PRIMARY KEY,
    name        VARCHAR(100)             NOT NULL,
    description VARCHAR(100)             NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- 信号灯策略调度表
create table public.signal_light_strategy_scheduling
(
    id              serial PRIMARY KEY,
    type_id         integer                  not null,
    schedule_type   varchar(30)              not null,
    start_time      timestamp with time zone not null,
    end_time        timestamp with time zone not null,
    cron_expression varchar(30)              not null,
    create_role     VARCHAR(30)              NOT NULL,
    update_role     VARCHAR(30)              NOT NULL,
    create_by       VARCHAR(10)              NOT NULL,
    update_by       VARCHAR(10)              NOT NULL,
    create_time     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         CHAR(1)                  NOT NULL DEFAULT 'N'
);

alter table public.signal_light_strategy_type
    add strategy_type varchar(100) not null;

alter table public.signal_light_strategy_scheduling
    rename to signal_light_strategy_schedule;

alter table public.signal_light_strategy_schedule
    add constraint signal_light_strategy_scheduling_signal_light_strategy_type_id_fk
        foreign key (type_id) references public.signal_light_strategy_type;

-- 信号灯组-信号灯策略类型关联表
create table public.signal_light_group_strategy_type_mapping
(
    id               serial PRIMARY KEY,
    group_id         INT                      NOT NULL,
    strategy_type_id INT                      NOT NULL,
    create_role      VARCHAR(30)              NOT NULL,
    update_role      VARCHAR(30)              NOT NULL,
    create_by        VARCHAR(10)              NOT NULL,
    update_by        VARCHAR(10)              NOT NULL,
    create_time      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted          CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- ===== ===== ===== ===== ===== ===== 2025.07.09 ===== ===== ===== ===== ===== =====

-- 子信号灯-信号灯策略调度关联表
create table public.signal_light_child_strategy_schedule_mapping
(
    id                   serial PRIMARY KEY,
    child_light_id       INT                      NOT NULL,
    strategy_schedule_id INT                      NOT NULL,
    location             geometry(Point, 4326)    NOT NULL,
    create_role          VARCHAR(30)              NOT NULL,
    update_role          VARCHAR(30)              NOT NULL,
    create_by            VARCHAR(10)              NOT NULL,
    update_by            VARCHAR(10)              NOT NULL,
    create_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted              CHAR(1)                  NOT NULL DEFAULT 'N'
);
create index idx_signal_light_child_strategy_schedule_mapping_location on signal_light_child_strategy_schedule_mapping using gist(location);

alter table public.signal_light_child_strategy_schedule_mapping
drop
column location;

-- ===== ===== ===== ===== ===== ===== 2025.07.10 ===== ===== ===== ===== ===== =====

alter table public.signal_light_strategy_schedule
    add name varchar(100);
alter table public.signal_light_strategy_schedule
    add description varchar(100);

alter table public.signal_light_strategy_schedule
    alter column name set not null;
alter table public.signal_light_strategy_schedule
    alter column description set not null;

alter table public.signal_light_strategy_schedule
drop
column type_id;

create table public.signal_light_strategy_type_strategy_schedule_mapping
(
    id                   serial PRIMARY KEY,
    strategy_type_id     INT                      NOT NULL,
    strategy_schedule_id INT                      NOT NULL,
    create_role          VARCHAR(30)              NOT NULL,
    update_role          VARCHAR(30)              NOT NULL,
    create_by            VARCHAR(10)              NOT NULL,
    update_by            VARCHAR(10)              NOT NULL,
    create_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted              CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
