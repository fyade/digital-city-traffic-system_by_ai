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

-- 信号灯策略类型-信号灯策略调度关联表
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

-- ===== ===== ===== ===== ===== ===== 2025.07.11 ===== ===== ===== ===== ===== =====

-- 信号灯策略参数表
create table public.signal_light_strategy_param
(
    id              serial PRIMARY KEY,
    red_duration    int                      not null,
    yellow_duration int                      not null,
    green_duration  int                      not null,
    create_role     VARCHAR(30)              NOT NULL,
    update_role     VARCHAR(30)              NOT NULL,
    create_by       VARCHAR(10)              NOT NULL,
    update_by       VARCHAR(10)              NOT NULL,
    create_time     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted         CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- 信号灯策略调度-信号灯策略参数关联表
create table public.signal_light_strategy_schedule_strategy_param_mapping
(
    id                   serial PRIMARY KEY,
    strategy_schedule_id INT                      NOT NULL,
    strategy_param_id    INT                      NOT NULL,
    create_role          VARCHAR(30)              NOT NULL,
    update_role          VARCHAR(30)              NOT NULL,
    create_by            VARCHAR(10)              NOT NULL,
    update_by            VARCHAR(10)              NOT NULL,
    create_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted              CHAR(1)                  NOT NULL DEFAULT 'N'
);

alter table public.signal_light_strategy_type
    add if_disabled char(1);
alter table public.signal_light_strategy_type
    add order_num int;
alter table public.signal_light_strategy_type
    add remark varchar(300);
alter table public.signal_light_strategy_type
    alter column if_disabled set not null;
alter table public.signal_light_strategy_type
    alter column order_num set not null;

alter table public.signal_light_strategy_schedule
    add if_disabled char(1);
alter table public.signal_light_strategy_schedule
    add order_num int;
alter table public.signal_light_strategy_schedule
    add remark varchar(300);
alter table public.signal_light_strategy_schedule
    alter column if_disabled set not null;
alter table public.signal_light_strategy_schedule
    alter column order_num set not null;

alter table public.signal_light_strategy_param
    add if_disabled char(1);
alter table public.signal_light_strategy_param
    add order_num int;
alter table public.signal_light_strategy_param
    add remark varchar(300);
alter table public.signal_light_strategy_param
    alter column if_disabled set not null;
alter table public.signal_light_strategy_param
    alter column order_num set not null;

-- ===== ===== ===== ===== ===== ===== 已同步至此 ===== ===== ===== ===== ===== =====
-- ===== ===== ===== ===== ===== ===== 2025.07.18 ===== ===== ===== ===== ===== =====

delete
from signal_light_group_strategy_type_mapping
where '1' = '1';
delete
from signal_light_child_strategy_schedule_mapping
where '1' = '1';
delete
from signal_light_strategy_type_strategy_schedule_mapping
where '1' = '1';
delete
from signal_light_strategy_schedule_strategy_param_mapping
where '1' = '1';

delete
from signal_light_strategy_type
where '1' = '1';
delete
from signal_light_strategy_schedule
where '1' = '1';
delete
from signal_light_strategy_param
where '1' = '1';

alter table public.signal_light_strategy_type
    add schedule_type varchar(30) not null;
alter table public.signal_light_strategy_type
    add start_time timestamp with time zone not null;
alter table public.signal_light_strategy_type
    add end_time timestamp with time zone not null;

alter table public.signal_light_strategy_schedule
drop
column schedule_type;
alter table public.signal_light_strategy_schedule
drop
column start_time;
alter table public.signal_light_strategy_schedule
drop
column end_time;
alter table public.signal_light_strategy_schedule
drop
column cron_expression;

alter table public.signal_light_strategy_param
drop
column red_duration;
alter table public.signal_light_strategy_param
drop
column yellow_duration;
alter table public.signal_light_strategy_param
drop
column green_duration;
alter table public.signal_light_strategy_param
    add light_type varchar(100) not null;
alter table public.signal_light_strategy_param
    add round int not null;
alter table public.signal_light_strategy_param
    add duration int not null;
alter table public.signal_light_strategy_param
    add current_light varchar(30) not null;

-- 信号灯样式表
create table public.signal_light_style
(
    id          serial PRIMARY KEY,
    name        VARCHAR(100)             NOT NULL,
    style       VARCHAR(200)             NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
);

-- 子信号灯-信号灯样式关联表
create table public.signal_light_child_style_mapping
(
    id          serial PRIMARY KEY,
    child_id    INT                      NOT NULL,
    style_id    INT                      NOT NULL,
    create_role VARCHAR(30)              NOT NULL,
    update_role VARCHAR(30)              NOT NULL,
    create_by   VARCHAR(10)              NOT NULL,
    update_by   VARCHAR(10)              NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted     CHAR(1)                  NOT NULL DEFAULT 'N'
)

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
