# 数智交通全域调度系统 — 完整技术分析报告

> 生成日期: 2026-05-09

## 一、技术栈概览

| 层级 | 技术 | 备注 |
|------|------|------|
| 前端框架 | Vue 3.5 + TypeScript 5.8 | Composition API |
| 构建工具 | Vite 7 (admin) / Webpack 5 (server) | admin用Vite，server用NestJS webpack |
| UI库 | Element Plus 2.11 (管理端) + Naive UI 2.42 (大屏端) | 两个UI库共存于同一入口 |
| 地图/3D引擎 | Cesium 1.131 + Three.js 0.175 | Cesium仅用于dashboard页 |
| 后端框架 | NestJS 11 | Express平台 |
| ORM | Prisma 6.15 | 双数据库客户端 |
| 数据库 | MySQL (主库) + PostgreSQL/PostGIS (空间库) | 物理隔离 |
| 缓存/队列 | Redis (ioredis) + BullMQ 5.56 | DB 19用于缓存，DB 29用于队列 |
| 实时通信 | Socket.IO 4.8 (后端) + socket.io-client 4.8 (前端) | 自建http server挂载 |
| 认证 | JWT (jsonwebtoken) + bcryptjs | token有效期24h |
| 日志 | Winston + winston-daily-rotate-file | 按日切割 |
| 定时任务 | @nestjs/schedule + cron | |
| 包管理 | pnpm 10.13 workspace | monorepo |

## 二、项目结构与模块关系

```
dcts (monorepo root)
├── admin/                    @dcts/admin      前端 (446 个 .vue/.ts 文件)
│   └── src/
│       ├── views/dashboard/                   大屏Cesium地图主战场
│       │   ├── core/         useCesium.ts / useDashboardCesium.ts
│       │   ├── functionModules/  vehicle/signalLight/aircraft/airspace/...Module.ts
│       │   ├── formPanel/    信号灯/策略/空域/航线CRUD表单
│       │   └── index/        主页面布局+数据层+entityHub
│       ├── views/module/
│       │   ├── main/         系统管理模块页面（用户/角色/菜单/部门/字典/日志）
│       │   ├── dcts/         交通业务模块页面（信号灯/路口/车辆/空域/航空器）
│       │   └── algorithm/    算法接口管理页面
│       ├── views/three/      Three.js独立三维页面
│       ├── store/module/     Pinia状态（user/sys/router/dict/dashboard/sysConfig）
│       ├── type/module/      类型定义（与server module一一对应）
│       └── services/         wsClient / broadcastChannel / eventBus
│
├── server/                   @dcts/server     后端 (424 个 .ts 文件)
│   └── src/
│       ├── module/
│       │   ├── main/         系统管理模块（38个子模块，含代码生成器）
│       │   ├── dcts/         交通业务域（13个子域）
│       │   ├── algorithm/    算法接口调度（SF权限体系）
│       │   └── proxy/        API代理（几乎未实现）
│       ├── infra/            基础设施层
│       │   ├── prisma/       Prisma封装（PrismaService/PrismaoService）
│       │   ├── ws/           Socket.IO服务
│       │   ├── queue/        BullMQ队列（3个消费者）
│       │   ├── cache/        Redis缓存（token/permission）
│       │   ├── auth/         认证授权服务
│       │   ├── base-context/ 请求级线程上下文
│       │   ├── redis/        Redis连接
│       │   ├── winston/      日志服务
│       │   ├── schedule/     定时任务调度
│       │   ├── sender/       邮件/短信发送
│       │   └── static/       静态资源服务
│       ├── guard/            PermissionGuard / ThrottleGuard / StaticGuard
│       ├── decorator/        @PreAuthorize / @Throttle
│       ├── interceptor/      ResponseInterceptor (操作日志自动记录)
│       ├── filter/           GlobalExceptionFilter
│       └── common/           R<T>响应包装 / PageDto / Enum
│
├── common/                   @dcts/common     共享工具库（14个util模块）
├── config/                   @dcts/config     环境配置（dev/prod分离）
├── prisma/                   MySQL + PostgreSQL schema (38+34=72个model)
└── prisma-generated/         @dcts/prisma-generated  生成的Prisma客户端
```

### pnpm workspace包依赖关系

```
@dcts/config (无依赖，最先构建)
@dcts/common (无依赖，最先构建)
@dcts/prisma-generated (由prisma generate生成)
@dcts/server → @dcts/config, @dcts/common, @dcts/prisma-generated
@dcts/admin → @dcts/config, @dcts/common
@dcts/script → @dcts/config
```

**构建顺序**: config → common → 其他

## 三、后端架构深度分析

### 3.1 模块层次

```
AppModule
├── IdentityModule (@Global)            用户身份服务(全局)
├── InfraModule                         基础设施
│   ├── PrismaModule (@Global)          Prisma双客户端封装
│   ├── CacheModule (@Global)           Redis缓存(token/permission)
│   ├── QueueModule (@Global)           BullMQ队列(3个消费者)
│   ├── RedisModule (@Global)           Redis连接
│   ├── AuthModule                      认证授权逻辑
│   ├── WsModule                        Socket.IO WebSocket
│   ├── ScheduleModule                  定时任务调度
│   ├── WinstonModule                   日志(Winston)
│   ├── BaseContextModule               请求上下文(nestjs-cls)
│   ├── CommonModule                    通用工具
│   ├── StaticModule                    静态文件服务
│   ├── MailModule                      邮件发送
│   └── SmsModule                       短信发送
├── MainModule                          系统管理业务(38个子模块)
│   ├── sys-manage/   user/role/menu/dept/dict/sys/permission...
│   ├── sys-log/      login/operation/scheduled-task/ws...
│   ├── sys-monitor/  online-user/scheduled-task/ws-online-user
│   ├── sys-util/     code-generation (代码自动生成器)
│   └── other-user/   visitor/table-default-permission
├── DctsModule                          交通核心业务(13个子域)
│   ├── core/              核心调度 + 信号灯计算
│   ├── signal-light/      信号灯组/子灯/样式/关联
│   ├── signal-light-strategy/  策略类型/调度/参数(6张多对多表)
│   ├── junction/          路口位置/连接关系
│   ├── spatial-data/      空间数据查询(PostGIS)
│   ├── vehicle/           车辆信息/轨迹点
│   ├── airspace/          空域/航线/用户申请
│   ├── aircraft-manage/   低空航空器/轨迹点
│   ├── asset/             3D文件组/单元/文件
│   ├── external/          外部服务对接
│   ├── script/            脚本执行
│   └── user/              DCTS用户管理
├── AlgorithmModule                     算法接口调度
│   ├── algorithm/         接口调用
│   ├── interface/         API接口注册
│   ├── interface-group/   API接口分组
│   ├── user-group/        用户组
│   └── log-algorithm-call/ 调用日志
└── ProxyModule                         API代理转发(未实现)
```

### 3.2 核心设计模式

#### PrismaService 封装层 (`server/src/infra/prisma/prisma.service.ts`)

在Prisma之上自建的ORM抽象层（727行），提供统一的CRUD接口：

| 方法 | 功能 |
|------|------|
| `findPage<T>()` | 分页查询，返回 `PageVo<T>` |
| `findAll<T>()` | 全量查询 |
| `findFirst<T>()` | 查询单条 |
| `findById<T>()` | 按ID查询 |
| `findByIds<T>()` | 按ID批量查询 |
| `count<T>()` | 计数 |
| `create<T>()` | 新增(自动填充审计字段) |
| `createMany<T>()` | 批量新增 |
| `updateById<T>()` | 按ID更新 |
| `updateMany<T>()` | 批量更新 |
| `deleteById<T>()` | 软删除(deleted='Y') |
| `delete<T>()` | 条件软删除 |

**特性**:
- 自动 snake_case ↔ CamelCase 转换（`baseUtils.objToSnakeCase` / `objToCamelCase`）
- 内置软删除过滤（`deleted = 'N'`，通过 `FieldSelectParam.ifDeleted` 控制）
- 动态查询条件构造：模糊匹配(contains)、精确匹配、数值范围、日期between
- 自动注入审计字段（`create_by`/`update_by`/`create_role`/`update_role`/`create_time`/`update_time`）
- 支持自定义查询字段过滤（`selKeys`）、非空字段（`notNullKeys`）、数值字段（`numberKeys`）
- `genSelParamSql()` 手动拼接原生SQL（用于需要绕过Prisma限制的场景）
- `getUserAccessibleDataSql()` 生成数据权限过滤SQL

**两种实例**:
- `MysqlPrismaService` → 继承PrismaService，操作 `prisma-generated/client-mysql`
- `PostgresqlPrismaService` → 继承PrismaService，操作 `prisma-generated/client-postgresql`，额外支持 `$queryRawUnsafe`

#### BaseContextService (`server/src/infra/base-context/`)

基于 `nestjs-cls` 的请求级线程上下文，存储：

```typescript
CurrentUser {
  userId: string
  loginRole: string
  token: string
  topAdmin: boolean      // 是否超级管理员
  authType: AuthTypeEnum // token | apiKey
  reqId: string          // 请求唯一ID
}

FieldSelectParam {       // 每个表的字段控制参数
  ifDeleted: boolean
  ifCreateRole: boolean
  ifUpdateRole: boolean
  ifCreateBy: boolean
  ifUpdateBy: boolean
  ifCreateTime: boolean
  ifUpdateTime: boolean
  numberKeys: string[]
  notNullKeys: string[]
  completeMatchingKeys: string[]
}
```

#### 三层Service分层（业务模块标准模式）

```
Controller → FacadeService → Service → PrismaService
                ↑                    ↑
           业务聚合+跨表关联      单表CRUD
```

- **Controller**: 路由定义、参数校验、权限装饰器、调用Facade
- **FacadeService**: 跨表查询编排、业务逻辑组合
- **Service**: 单表CRUD操作（继承PrismaService）
- **Module**: 注册Controller + Service + FacadeService

#### 权限体系 (`PermissionGuard`)

完整的7层鉴权链：

```
请求进入
  ↓
1. Token验证 (JWT → Redis缓存查询)
  ↓
2. API Key验证 (header: dcts-api-key)
  ↓
3. 公共接口白名单 (ifIgnore装饰器标记) → 放行
  ↓
4. IP白名单检查 (接口级)
  ↓
5. 接口禁用检查
  ↓
6. 超级管理员检查 (topAdmin) → 放行
  ↓
7. 角色-权限点匹配 → 通过/403
```

**SF权限体系**(算法接口专用): 额外需要 `pperms`(分组权限) + `perms`(接口权限) 两层验证，支持 `ifUseUp` 向上继承。

### 3.3 数据流

```
HTTP请求
  ↓
GlobalExceptionFilter (全局异常捕获)
  ↓
PermissionGuard (认证+鉴权)
  ↓  → BaseContextService.setUserData()
  ↓  → BaseContextService.setUserAuthType()
  ↓
Controller (路由处理)
  ↓
FacadeService / Service (业务逻辑)
  ↓
PrismaService (数据库操作)
  ↓
ResponseInterceptor.map() → 注入reqId
  ↓
ResponseInterceptor.tap() → 异步写操作日志到BullMQ
  ↓
R<T> 格式JSON响应
```

**异常处理**: GlobalExceptionFilter 捕获所有异常（HttpException、Prisma错误、未知异常），统一转为 `R(code, null, msg, reqId)` 返回。Winston记录全部错误堆栈。

**操作日志**: ResponseInterceptor在请求成功/失败后，自动将请求信息（IP、参数、响应码、耗时等）通过BullMQ异步入库，不影响主请求响应。

### 3.4 WebSocket架构

```
客户端(socket.io-client)
  ↓ auth: { token, pageContext }
  ↓
Socket.IO Server (独立HTTP Server, 端口8938)
  ↓
JWT认证中间件(io.use)
  ↓
按 loginRole:::userId 和 pageContext 分组
  ↓
connection事件 → 记录在线用户
message事件 → runEvent() → 事件分发
disconnect事件 → 移除在线用户
```

**消息格式**:
```typescript
EventDataType {
  perm: string      // 事件标识
  msg: string       // 消息体(JSON)
  code: string      // 状态码(默认'dcts200')
  sendTime: string
  sendTimestamp: number
}
```

**发送模式**:
- `sendMsg(loginRole, userId, perm, msg)` → 发送给特定用户
- `sendMsgByPageContext(pageContext, perm, msg)` → 广播给所有同一页面的用户

**关键路径**:
- 信号灯数据变更 → `DctsCoreService.refreshLightWhenDatabaseChange()` → WS广播 `dcts:spatialData:refreshLightWhenDatabaseChange` → 前端全量刷新
- 信号灯计算结果 → `calculateLightsInPolygon()` → WS推送给请求用户

### 3.5 BullMQ队列系统

| 队列名 | 消费者 | 用途 |
|--------|--------|------|
| `log-operation-queue` | LogOperationConsumer | HTTP操作日志批量写入MySQL |
| `log-operation-ws-queue` | LogOperationWsConsumer | WS操作日志批量写入MySQL |
| `log-scheduled-task-queue` | LogScheduledTaskConsumer | 定时任务执行日志 |

配置: `removeOnComplete: true`（消费完即删），`removeOnFail: false`（失败保留）。使用Redis DB 29。

### 3.6 信号灯计算核心算法

`DctsCalculateService.calculateLight()` — 系统核心算法（555行）

**输入**: 信号灯组ID列表 + 可选时间范围
**输出**: `SignalLightRunParam[]`（每个子信号灯每秒钟的颜色状态序列）

**执行流程**:

1. **数据加载**: 六层关联查询
   ```
   信号灯组 → 子灯映射 → 子灯信息
   信号灯组 → 策略类型映射 → 策略类型
   子灯 → 策略调度映射 → 策略调度
   策略类型 → 策略调度映射 → 策略调度
   策略调度 → 策略参数映射 → 策略参数
   ```

2. **时间窗口计算**: 按排程类型对齐当前时间
   - `T_DAY`: 日周期
   - `T_WEEK`: 周周期
   - `T_MONTH`: 月周期
   - `T_YEAR`: 年周期

3. **策略优先级合并**: 
   - 紧急策略(T_TOP) > 微调策略(T_FINE_TUNING) > 固定策略(T_CUSTOM)
   - 当T_TOP激活时，T_CUSTOM和T_FINE_TUNING自动失效
   - T_FINE_TUNING可微调T_CUSTOM的绿灯时长

4. **逐轮次逐参数计算**: 
   - 按round分组 → 取最大duration作为该轮时长
   - 叠加微调策略的时间偏移
   - 紧急策略时段内跳过非紧急参数
   - 绿灯结束前3秒自动插入黄灯过渡

5. **后处理**（6次排序+合并）:
   - 时间间隙填充红灯
   - 相邻同色同类型段合并
   - 绿灯<3秒的直接变红灯
   - 红-黄-红 → 黄变红
   - 绿-黄-绿 → 合并绿

**性能**: 控制台输出 `calculateLight查询所需时间 X ms，计算所需时间 Y ms`

## 四、前端架构深度分析

### 4.1 入口初始化

```typescript
// admin/src/main.ts
createApp(App)
  .use(router)
  .use(createPinia() + pinia-plugin-persistedstate)  // 状态持久化到localStorage
  .use(naive)                                         // Naive UI全局注册
  .use(directives)                                    // 自定义指令
  .mount('#app')
```

同时加载: Element Plus (通过unplugin-auto-import按需) + Cesium + 全局SCSS

### 4.2 双UI体系路由分发

| 路由前缀 | UI体系 | 用途 |
|----------|--------|------|
| `/home`, `/user/*` | Element Plus | 系统管理后台 |
| `/dashboard/*` | Naive UI + Cesium | 大屏可视化 |
| `/three/*` | Three.js | 独立3D场景 |
| `/login` | 自定义 | 登录页(Element Plus风格) |

### 4.3 Cesium大屏模块结构

```
useDashboardCesium.ts (主调度器，~2000行)
  ├── useCesium.ts              Cesium Viewer初始化
  │   ├── 地形: SuperMap iServer
  │   ├── 影像: 天地图(Tianditu)瓦片
  │   ├── 路网: GeoServer WMS图层
  │   └── 底图: OpenStreetMap
  ├── VehicleModule              车辆实时位置+轨迹线渲染
  │   ├── 实时位置: Cesium.Entity (billboard+label)
  │   ├── 轨迹线: Cesium.PolylineCollection
  │   └── 视角锁定: Cesium.Camera.flyTo
  ├── SignalLightModule          信号灯3D模型+颜色切换
  │   ├── 模型: 根据signalLightStyle加载对应glTF
  │   ├── 颜色: 红/黄/绿 Cesium.Color
  │   └── 切换: 按SignalLightRunParam时间轴驱动
  ├── AircraftModule             低空航空器3D模型渲染
  ├── AirspaceModule             空域多边形+航线渲染
  ├── MapInteractionModule       鼠标交互(点击拾取entity)
  ├── MapEntityModule            地图实体生命周期管理
  ├── ContextMenuModule          右键菜单(Cesium.ScreenSpaceEventHandler)
  ├── ClockModule                时间轴控制(回放/快进)
  ├── LayerNotificationModule    图层可见性通知
  ├── DebugModule                开发调试面板
  ├── PermissionModule           大屏权限控制
  └── VersionDataModule          数据版本号管理(增量更新)
```

**空间查询交互流程**:
```
前端: 用户绘制多边形 → 获取坐标数组
  ↓ POST /spatial-data/nodesWithWaysInPolygon
后端: PostGIS ST_Within / ST_Intersects 空间查询
  ↓ 返回范围内的道路/节点/路口/信号灯/车辆
前端: Cesium.Entity渲染 → 更新entityHub
```

### 4.4 状态管理 (Pinia)

| Store | 文件 | 职责 |
|-------|------|------|
| `useUserStore` | `store/module/user.ts` | 登录状态、token、用户信息、角色 |
| `useSysStore` | `store/module/sys.ts` | 当前子系统、公共header(含apiKey注入) |
| `useRouterStore` | `store/module/router.ts` | 动态路由列表 |
| `useDictStore` | `store/module/dict.ts` | 字典数据缓存 |
| `useDashboardStore` | `store/module/dashboard.ts` | 大屏地图状态 |
| `useSysConfigStore` | `store/module/sysConfig.ts` | 系统配置(注册开关等) |

所有store通过 `pinia-plugin-persistedstate` 自动持久化到localStorage（key前缀 `__persisted__`）。

### 4.5 前端API层

```typescript
// admin/src/api/request.ts
const request = axios.create({ baseURL: '/api-dev', timeout: 10min })

// 请求拦截器: 自动注入公共header(sysStore.publicHeader())
//   其中包含 apiKey (dcts-api-key header)

// 响应拦截器:
//   code !== 200 → messageError + reject
//   code === 401 → 跳转登录(防重入)
//   GET请求参数自动JSON.stringify嵌套对象
```

**代理配置** (`vite.config.ts`):
| 前缀 | 目标 | 用途 |
|------|------|------|
| `/api-dev` | `http://localhost:8937` | 后端API |
| `/api-file-dev` | `http://localhost:8937/static/file/` | 文件上传 |
| `/api-ws-dev` | `ws://localhost:8938` | WebSocket |
| `/geoserver-dev` | GeoServer地址 | 地图服务 |
| `/tianditu-vec-dev` | 天地图矢量 | 底图瓦片 |
| `/tianditu-cva-dev` | 天地图注记 | 底图标注 |

### 4.6 自定义指令

| 指令 | 文件 | 功能 |
|------|------|------|
| `v-noMoreClick` | `noMoreClick.ts` | 防重复点击 |
| `v-resizeObserver` | `resizeObserver.ts` | 元素尺寸变化监听 |
| `v-hasPerm` | `hasPerm.ts` | 权限点控制元素显隐 |
| `v-focus` | `focus.ts` | 自动聚焦 |

## 五、数据库结构

### 5.1 MySQL（38个model，710行schema）

#### 系统管理表
| 表名 | 说明 |
|------|------|
| `sys_user` | 用户表 |
| `sys_role` | 角色表 |
| `sys_menu` | 菜单/权限点表 |
| `sys_dept` | 部门表 |
| `sys_config` | 系统配置 |
| `sys_user_role` | 用户-角色关联 |
| `sys_role_permission` | 角色-权限关联 |
| `sys_user_dept` | 用户-部门关联 |
| `sys_dept_permission` | 部门-权限关联 |
| `sys_role_sys` | 角色-子系统关联 |
| `sys_dept_sys` | 部门-子系统关联 |
| `sys_user_api_key` | 用户API Key |
| `sys_menu_ip_white_list` | 接口IP白名单 |
| `sys_menu_throttle` | 接口限流配置 |
| `sys_table_row_permission` | 表行级权限 |
| `sys_dic_type` | 字典类型 |
| `sys_dic_data` | 字典数据 |

#### 日志表
| 表名 | 说明 |
|------|------|
| `log_user_login` | 用户登录日志 |
| `log_operation` | 操作日志 |
| `log_operation_ws` | WS操作日志 |
| `log_scheduled_task` | 定时任务执行日志 |
| `log_user_login_ws` | WS登录日志 |

#### 交通业务表（dcts_前缀）
| 表名 | 说明 |
|------|------|
| `dcts_signal_light_group_info` | 信号灯组 |
| `dcts_signal_light_info` | 子信号灯 |
| `dcts_signal_light_group_child_mapping` | 信号灯组-子灯关联 |
| `dcts_signal_light_style` | 信号灯3D样式 |
| `dcts_signal_light_child_style_mapping` | 子灯-样式关联 |
| `dcts_signal_light_strategy_type` | 策略类型 |
| `dcts_signal_light_strategy_schedule` | 策略调度 |
| `dcts_signal_light_strategy_param` | 策略参数 |
| `dcts_signal_light_group_strategy_type_mapping` | 灯组-策略类型关联 |
| `dcts_signal_light_child_strategy_schedule_mapping` | 子灯-策略调度关联 |
| `dcts_signal_light_strategy_type_strategy_schedule_mapping` | 策略类型-调度关联 |
| `dcts_signal_light_strategy_schedule_strategy_param_mapping` | 调度-参数关联 |
| `dcts_junction_position` | 路口位置 |
| `dcts_junction_connection` | 路口连接关系 |
| `dcts_vehicle_info` | 车辆信息 |
| `dcts_vehicle_track_point` | 车辆轨迹点 |
| `dcts_flight_restriction_zone` | 禁飞区 |
| `dcts_flight_route` | 航线 |
| `dcts_low_altitude_aircraft` | 低空航空器 |
| `dcts_aircraft_track_point` | 航空器轨迹点 |
| `dcts_three_d_file_group` | 3D文件组 |
| `dcts_three_d_file_unit` | 3D文件单元 |
| `dcts_three_d_file` | 3D文件 |

#### 算法接口表
| 表名 | 说明 |
|------|------|
| `algorithm_interface` | 接口注册 |
| `algorithm_interface_group` | 接口分组 |
| `algorithm_interface_interface_group` | 接口-分组关联 |
| `algorithm_user_group` | 用户组 |
| `algorithm_user_user_group` | 用户-用户组关联 |
| `algorithm_user_group_permission` | 用户组-权限关联 |
| `algorithm_log_algorithm_call` | 算法调用日志 |

**所有MySQL表统一字段规范**:
- `id`: 主键（Int自增或VarChar手动）
- `deleted`: 软删除标记 `'N'`/`'Y'`（默认'N'）
- `create_role` / `update_role`: 操作角色
- `create_by` / `update_by`: 操作人
- `create_time`: 创建时间（`@default(now())`）
- `update_time`: 更新时间（`@updatedAt`）

### 5.2 PostgreSQL（34个model，766行schema）

#### OSM路网表（osm2pgsql自动生成 — 结构不可修改）
| 表名 | 说明 |
|------|------|
| `planet_osm_nodes` | 路网节点 (id, lat, lon, tags) |
| `planet_osm_ways` | 路网路径 (id, nodes[], tags) |
| `planet_osm_rels` | 路网关系 (id, members, tags) |
| `planet_osm_line` | 路网线要素 (含way几何列 + Gist索引) |
| `planet_osm_point` | 路网点要素 |
| `planet_osm_polygon` | 路网面要素 |
| `planet_osm_roads` | 道路要素 |
| `spatial_ref_sys` | PostGIS空间参考系 |

#### 业务表（与MySQL对应）
| 表名 | 说明 |
|------|------|
| `dcts_junction_position` | 路口位置(含geom空间列) |
| `dcts_junction_connection` | 路口连接关系 |
| `dcts_signal_light_group_info` | 信号灯组(含空间列) |
| `dcts_signal_light_info` | 子信号灯(含空间列) |
| `dcts_signal_light_style` | 信号灯样式 |
| `dcts_signal_light_child_style_mapping` | 子灯-样式关联 |
| `dcts_signal_light_strategy_*` | 策略相关(6张表) |
| `dcts_vehicle_info` | 车辆信息 |
| `dcts_vehicle_track_point` | 车辆轨迹点(含时间+空间列) |
| `dcts_flight_restriction_zone` | 禁飞区(含geom空间列) |
| `dcts_flight_route` | 航线(含geom空间列) |
| `dcts_low_altitude_aircraft` | 低空航空器 |
| `dcts_aircraft_track_point` | 航空器轨迹点(含时间+空间列) |
| `dcts_three_d_file_*` | 3D文件(3张表) |

**注意**: 信号灯策略相关的6张表在MySQL和PostgreSQL中**各存一份**，存在数据一致性问题。

## 六、配置系统

### 6.1 环境选择机制

```typescript
// config/index.ts
export function getCurrentConfig<T>(config: T) {
  // Vite环境: 读取 import.meta.env.MODE
  // Node环境: 读取 process.env.NODE_ENV
  // 从 config[env] 选择对应配置
  // 无匹配时抛出异常
}
```

### 6.2 配置模块

| 模块 | 文件 | 关键配置 |
|------|------|----------|
| `publicConfig` | `config/public.config.ts` | APP_NAME、端口(fPort/bPort/bWsPort)、前缀 |
| `serverConfig` | `config/server.config.ts` | MySQL/PostgreSQL/Redis连接、JWT密钥、日志路径 |
| `adminConfig` | `config/admin.config.ts` | Vite代理前缀、baseURL |
| `dashboardConfig` | `config/dashboard.config.ts` | LONG_TASK_INTERVAL(10分钟) |
| `geoserverConfig` | `third-config/geoserver.config.ts` | GeoServer WMS/WFS地址 |
| `tiandituConfig` | `third-config/tianditu.config.ts` | 天地图瓦片URL前缀 |
| `tiandituProdConfig` | `third-config/tianditu-prod.config.ts` | 天地图tk密钥 |
| `mail126Config` | `third-config/mail126.config.ts` | 126邮箱SMTP配置 |

### 6.3 版本号

```
1.0.3.server  (后端)
1.0.3.front   (前端)
1.0.3.board   (大屏)
```

## 七、构建与部署

### 7.1 开发环境

```bash
# 首次搭建
pnpm install
pnpm generate:prisma        # 生成Prisma客户端
pnpm build:config-common    # 构建依赖包

# 日常开发
pnpm start:dev              # 后端 (NestJS watch模式, 端口8937)
pnpm dev:admin              # 前端 (Vite HMR, 端口7947)

# 代码检查
cd server && npm run lint   # ESLint
cd server && npm test       # Jest单元测试
```

### 7.2 生产构建

```bash
pnpm build:config-common
pnpm generate:prisma
pnpm build:server:wp        # 后端 → server/dist (webpack打包)
pnpm build:admin:prod       # 前端 → admin/dist (vue-tsc检查 + vite build)
```

### 7.3 基础设施依赖

| 服务 | 端口 | 用途 |
|------|------|------|
| MySQL | 3306 | 主数据库 (database: `proj_digital-city-traffic-system_by_ai`) |
| PostgreSQL | 5432 | 空间数据库 (database: `digital-city-traffic-system_by_ai`) |
| Redis | 6379 | 缓存(DB 19) + 队列(DB 29) |
| GeoServer | 外部服务 | WMS/WFS地图服务 |
| 天地图 | 外部API | 底图瓦片服务 |

## 八、风险点与历史遗留问题

### 🔴 高风险

**1. 信号灯计算性能瓶颈**

`DctsCalculateService.calculateLight()` 一次性六层关联查询全部数据到内存，嵌套循环深度4层（策略类型→调度→参数→round→参数）。数据量增长后响应时间会线性恶化。目前无分页、无缓存、无预计算。建议：引入空间索引预过滤、增量计算缓存、将长时间计算移至BullMQ后台任务异步返回。

**2. 双数据库数据一致性问题**

信号灯策略相关的6张表在MySQL和PostgreSQL各存一份，无分布式事务或同步机制保障。一个库写入成功另一个失败会导致数据不一致。建议：使用事务性出站模式（Transactional Outbox）或CDC同步。

**3. SQL注入风险**

`PrismaService.genSelParamSql()` 手动拼接SQL字符串（如 `` `%${value2}%` ``），未使用参数化查询。`spatial-data.service.ts` 大量使用 `$queryRawUnsafe`。虽然前端有DTO验证，但拼接型SQL本质不安全。建议：使用Prisma的参数化查询 `$queryRaw` 替代 `$queryRawUnsafe`，对动态SQL使用转义库。

**4. 密钥硬编码**

`server.config.ts` 中 `jwtConstants.secret`、`SECRET_KEY_HD_DB`、`SECRET_CON_PROJ_AUTH`、Redis密码 `123456`、MySQL/PostgreSQL密码 `123456` 均为明文硬编码且已提交到Git仓库。建议：迁移到环境变量或 `.env` 文件，所有密钥从环境变量读取。

### 🟡 中风险

**5. PrismaService过于臃肿**

727行单文件承担ORM封装、查询构造、SQL拼接、分页等多职责。`genSelParams()` 和 `genSelParamSql()` 逻辑独立但硬耦合。建议：拆分为 QueryBuilder、Repository、SQLBuilder 等独立类。

**6. 代码生成器路径硬编码**

`code-generation.service.ts` 使用 `../../../../../../../` 多层相对路径穿越，不同操作系统分隔符不同（历史上已有 `\\` → `/` 修复）。建议：使用 `process.cwd()` 或 NestJS 的配置注入获取项目根路径。

**7. WebSocket与HTTP端口分离**

WS使用独立端口8938和独立HTTP Server，不走NestJS统一生命周期。导致WS无法复用Guard/Interceptor/Filter体系，异常处理和日志记录全手动。建议：使用NestJS的 `@nestjs/platform-socket.io` 适配器统一管理。

**8. 前端Element Plus和Naive UI共存**

两个完整UI库同时加载，各自独立CSS和组件注册，增加bundle体积且可能存在样式冲突。建议：评估是否可以统一到一个UI库，或按路由完全分离打包。

### 🟢 低风险/改进点

**9. ProxyModule未实现** — `proxy.service.ts` 只有空构造函数。

**10. ESLint规则几乎全部关闭** — `no-explicit-any: off`, `no-unused-vars: off`, `prettier: off` 等，缺乏代码规范自动化约束。

**11. 无自动化测试** — `test/` 目录只有临时文件，无实际测试用例。Jest配置存在但无用例。

**12. 配置管理不完整** — prod配置被注释掉，生产部署依赖不明确。无Docker/容器化配置。

**13. 包管理器版本锁定** — `pnpm@10.13.0` 精确版本要求，需确保团队统一Corepack配置。

**14. `server/~/` 临时目录问题** — 代码生成时可能误创建错误路径的文件（已发生过一次）。

**15. uploadPath使用`~`** — Node.js中`~`不会自动展开，需使用`/home/fy/...`绝对路径（已修复）。

## 九、二次开发指南

### 9.1 新增业务模块标准流程

```
1. 在 prisma/*.schema.prisma 定义model
   ├── MySQL表: mysql.schema.prisma
   └── PostgreSQL表(含空间列): postgresql.schema.prisma

2. pnpm generate:prisma  生成Prisma客户端

3. 使用代码生成器自动生成后端代码
   ├── admin → 系统管理 → 代码生成 → 导入表 → 生成
   └── 自动产出: Controller/Service/Module/Facade/DTO

4. 在对应 xxx.module.ts 注册新模块

5. 添加权限点: sys_menu表新增记录

6. 前端: admin/src/type/module/ 添加类型定义

7. 前端: admin/src/views/module/ 添加页面组件

8. 前端: admin/src/router/ 注册路由
```

### 9.2 代码生成器使用

项目内置完整的代码生成系统（`server/src/module/main/sys-util/code-generation/`），可从Prisma schema自动生成：
- NestJS完整CRUD模块（controller / service / module / dto / facade）
- Vue前端完整页面（列表 / 新增表单 / 修改表单 / 详情）
- 前后端TypeScript类型定义

使用路径: 管理端 → 系统工具 → 代码生成 → 选择Prisma文件 → 勾选表 → 生成

### 9.3 空间查询新增流程

```
1. sqls.ts 编写PostGIS查询SQL
   ├── 使用 ST_Within / ST_Intersects / ST_DWithin 等空间函数
   └── 返回原始SQL字符串

2. dto.ts 定义请求参数
   └── class-validator装饰器校验

3. vo.ts 定义返回数据结构

4. spatial-data.service.ts 执行查询
   └── this.pgsqlPrismao.$queryRawUnsafe<VoType>(sql)

5. spatial-data.controller.ts 添加路由
   └── @Post() + @PreAuthorize() 装饰器

6. 前端 admin/src/type/module/dcts/spatialData.ts 同步类型
```

### 9.4 定时任务注册

```typescript
// 使用 ScheduleService
scheduleService.addScheduleFunc('sys:xxx:taskName', async () => {
  // 定时执行逻辑
})

// 底层基于 @nestjs/schedule Cron装饰器
// ScheduleService在 infra/schedule/ 中实现
```

目前注册的定时任务: `sys:dcts:runCoreSchedule`（函数体为空，待实现）。

### 9.5 环境配置

**dev环境** (`NODE_ENV=dev`): 直接使用 `config/config/` 下的配置，已提交Git。

**prod环境** (`NODE_ENV=prod`): 需自行创建以下文件（已gitignore）:
- `config/config/public-prod.config.ts`
- `config/config/server-prod.config.ts`
- `config/config/admin-prod.config.ts`
- 参考同目录下dev配置的结构

### 9.6 常用pnpm命令

```bash
# 按filter执行
pnpm --filter @dcts/server start:dev     # 启动后端
pnpm --filter @dcts/admin dev            # 启动前端

# 构建顺序
pnpm --filter @dcts/config build         # 1. 构建配置包
pnpm --filter @dcts/common build         # 2. 构建通用包
pnpm --filter @dcts/server build:wp      # 3. 构建后端
pnpm --filter @dcts/admin build:prod     # 4. 构建前端

# Prisma
pnpm generate:prisma:mysql               # 仅生成MySQL客户端
pnpm generate:prisma:postgresql          # 仅生成PostgreSQL客户端
pnpm generate:prisma                     # 生成全部

# 脚本
pnpm build-schema                        # 从Prisma schema提取元数据
```

### 9.7 关键文件索引

| 用途 | 路径 |
|------|------|
| 后端入口 | `server/src/main.ts` |
| 全局异常处理 | `server/src/filter/global-exception.filter.ts` |
| 权限守卫 | `server/src/guard/permission.guard.ts` |
| 响应拦截器 | `server/src/interceptor/response.interceptor.ts` |
| Prisma封装 | `server/src/infra/prisma/prisma.service.ts` |
| 请求上下文 | `server/src/infra/base-context/base-context.service.ts` |
| WebSocket服务 | `server/src/infra/ws/ws.service.ts` |
| 队列服务 | `server/src/infra/queue/queue.service.ts` |
| Redis缓存 | `server/src/infra/cache/cache.token.service.ts` |
| 认证服务 | `server/src/infra/auth/auth.service.ts` |
| 信号灯计算 | `server/src/module/dcts/core/dcts-calculate.service.ts` |
| 核心调度 | `server/src/module/dcts/core/dcts-core.service.ts` |
| 空间查询 | `server/src/module/dcts/spatial-data/spatial-data.service.ts` |
| 空间SQL | `server/src/module/dcts/spatial-data/sqls.ts` |
| 算法调度 | `server/src/module/algorithm/algorithm/algorithm.service.ts` |
| 代码生成 | `server/src/module/main/sys-util/code-generation/code-generation.service.ts` |
| 前端入口 | `admin/src/main.ts` |
| 前端路由 | `admin/src/router/index.ts` |
| Cesium主控 | `admin/src/views/dashboard/core/useDashboardCesium.ts` |
| Cesium初始化 | `admin/src/views/dashboard/core/useCesium.ts` |
| API请求 | `admin/src/api/request.ts` |
| WebSocket客户端 | `admin/src/services/wsClient.ts` |
| 全局配置 | `config/config/server.config.ts` |
| Prisma Schema | `prisma/mysql.schema.prisma` / `prisma/postgresql.schema.prisma` |
