-- ===== ===== ===== ===== ===== ===== 2025.07.07 ===== ===== ===== ===== ===== =====

-- 信号灯策略类型表、信号灯策略调度表(主要关注日期、时间)，这两个表为一对多关系
-- 信号灯组-信号灯策略类型关联表、子信号灯-信号灯策略调度关联表
-- 信号灯策略参数表(主要关注信号灯颜色、时长)、信号灯策略调度-信号灯策略参数对应表

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

-- ===== ===== ===== ===== ===== =====  ===== ===== ===== ===== ===== =====
