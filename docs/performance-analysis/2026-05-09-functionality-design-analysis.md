# 功能设计分析报告

> 分析日期：2026-05-09  
> 状态：**待优化**（仅分析，修改尚未执行）  
> 分析范围：全栈功能设计（后端71个Controller + 前端170个Vue页面 + 72个数据库Model）

---

## 一、项目功能全景

### 1.1 已实现的完整功能

| 功能域 | 功能点 | 实现程度 |
|--------|--------|----------|
| **系统管理** | 用户/角色/菜单/部门/字典 CRUD | 100% |
| **系统管理** | 权限点分配（角色-菜单-权限） | 100% |
| **系统管理** | 多子系统（sys）管理 | 100% |
| **系统管理** | IP白名单（接口级） | 100% |
| **系统管理** | 限流（Throttle，接口级） | 100% |
| **系统管理** | 代码生成器（Prisma → NestJS + Vue） | 100% |
| **系统管理** | API Key管理 | 100% |
| **系统管理** | 操作日志/登录日志（HTTP + WS） | 100% |
| **系统管理** | 在线用户监控 | 100% |
| **系统管理** | 定时任务管理 | 100% |
| **系统管理** | 文件分片上传 | 100% |
| **系统管理** | 游客/访客用户管理 | 100% |
| **系统管理** | 部门/角色跨系统分配 | 100% |
| **系统管理** | 表级行权限控制 | 100% |
| **交通业务** | 信号灯组CRUD + 空间查询 | 100% |
| **交通业务** | 子信号灯CRUD + 空间查询 | 100% |
| **交通业务** | 信号灯3D样式管理 | 100% |
| **交通业务** | 信号灯策略类型/调度/参数 CRUD | 100% |
| **交通业务** | 策略三层关联绑定（灯组→类型→调度→参数） | 100% |
| **交通业务** | 信号灯实时计算+WS推送 | 100% |
| **交通业务** | 道路/节点空间查询（PostGIS） | 100% |
| **交通业务** | 车辆轨迹点录入+空间查询 | 100% |
| **交通业务** | 车辆信息CRUD | 100% |
| **交通业务** | 车辆轨迹查询 | 100% |
| **交通业务** | 空域（禁飞区）CRUD + 空间查询 | 100% |
| **交通业务** | 航线CRUD + 空间查询 | 100% |
| **交通业务** | 空域/航线用户申请+审批 | 100% |
| **交通业务** | 低空航空器CRUD | 100% |
| **交通业务** | 航空器轨迹点录入+空间查询 | 100% |
| **交通业务** | 3D模型文件管理 | 100% |
| **交通业务** | 外部数据接入（模拟数据录入） | 100% |
| **算法调度** | 接口注册/分组/关联 | 100% |
| **算法调度** | 用户组/用户-用户组/SF权限分配 | 100% |
| **算法调度** | 算法调用+调用日志 | 100% |
| **Cesium大屏** | 天地图+GeoServer+OSM底图加载 | 100% |
| **Cesium大屏** | 车辆实时位置渲染 | 100% |
| **Cesium大屏** | 信号灯3D模型+颜色切换 | 100% |
| **Cesium大屏** | 空域多边形+航线渲染 | 100% |
| **Cesium大屏** | 航空器实时位置渲染 | 100% |
| **Cesium大屏** | 时间轴控制 | 100% |
| **Cesium大屏** | 右键菜单交互 | 100% |
| **Three.js页面** | 3D场景基础渲染 | 100% |

### 1.2 部分实现/存根功能

| 功能 | 现状 |
|------|------|
| 路口位置管理（junction-position） | 后端controller有CRUD，前端有页面，但数据来源缺失 |
| 路口连接管理（junction-connection） | Controller为空类，无任何接口 |
| 信号灯-道路映射（signal_light_child_road_mapping） | 表已定义但无对应模块代码 |
| 交通流颜色标识 | README标记为"待定" |
| 车辆视角锁定 | README标记为"待定" |
| 回放功能 | README标记为"待定" |
| 信号灯模型预置 | README标记为"待定" |
| ProxyModule | Controller和Service均为空实现 |
| 算法"为特种车辆开路" | 算法调度框架已搭建，但实际导航算法未接入 |

---

## 二、不合理/冗余的功能设计

### 2.1 两套独立的权限系统并存

**问题**: MySQL中有两套完全独立的权限体系：

**体系A**（main模块）- 系统管理权限：
```
sys_user → sys_user_role → sys_role → sys_role_permission → sys_menu (permission字段)
                                    → sys_role_sys (多子系统隔离)
```

**体系B**（algorithm模块）- 算法接口权限（SF权限）：
```
sys_user → sys_user_user_group → sys_user_group → sys_user_group_permission → sys_interface
                                                                              → sys_interface_group
```

两套体系用同一张 `sys_user` 表，但权限存储和校验逻辑完全独立。`PermissionGuard` 中 `ifSF=true` 时走体系B，否则走体系A。

**冗余度**: 体系B中的 `sys_user_group`、`sys_user_user_group`、`sys_interface`、`sys_interface_group`、`sys_interface_interface_group`、`sys_user_group_permission` 6张表可以完全被体系A替代——在 `sys_menu` 中新增 `ifSF=true` 标记即可区分算法接口权限。

**建议**: 合并为一套权限体系，减少维护成本和理解难度。

### 2.2 信号灯策略六张多对多中间表

```
signal_light_strategy_type (策略类型)
signal_light_strategy_schedule (策略调度)
signal_light_strategy_param (策略参数)
    ↑
三张表两两多对多 = 3张中间表
    +
signal_light_group_strategy_type_mapping
signal_light_child_strategy_schedule_mapping
    = 共5张映射表 + 3张实体表 = 8张表
```

实际业务中：
- 一个策略类型下有多个策略调度（多对多合理）
- 一个策略调度下有多个策略参数（多对多合理，但存在冗余——同一个round+lightType的参数组实际上应该是原子的）

**冗余**: `signal_light_strategy_type_strategy_schedule_mapping` 和 `signal_light_strategy_schedule_strategy_param_mapping` 两张中间表导致 `calculateLight()` 中的六层嵌套查询，而实际场景中策略调度应该直接嵌套在策略类型下，不需要额外映射。

**建议**: 简化为策略类型 → 策略调度 → 策略参数的三级父子关系（去掉中间映射表），在 `strategy_schedule` 中加 `strategy_type_id` 外键，在 `strategy_param` 中加 `strategy_schedule_id` 外键。

### 2.3 ScriptModule中的模拟数据脚本

`server/src/module/dcts/script/module/` 下有4个脚本：
- `addRouteInformation.ts` — 硬编码南京坐标，模拟道路信息
- `addVehicleInfo.ts` — 随机生成车辆
- `addVehicleTrackPoint.ts` — 硬编码坐标模拟车辆移动
- `addAircraftTrackPoint.ts` — 模拟航空器轨迹

这些脚本仅用于Demo演示，生产环境应完全移除或通过 `NODE_ENV` 隔离。

### 2.4 双登录方式但验证码登录未完整实现

后端 `identity.service.ts` 支持两种登录：
- `loginPsd` — 密码登录
- `loginCode` — 验证码登录

但：
- 验证码通过 `svg-captcha` 生成，前端登录页面 `login2.vue` 为当前使用版本
- `login.vue`（旧版）仍然存在
- 短信验证码（SmsModule）已配置但未集成到登录流程

### 2.5 ProxyModule完全为空

`proxy.controller.ts` 只有空的Controller类定义，`proxy.service.ts` 只有构造函数。整个模块是可以删除的占位符。

### 2.6 前后端均有未使用的旧版页面

- `admin/src/views/user/login.vue` — 旧版登录页（当前使用 `login2.vue`）
- `admin/src/views/user/api-key.vue` — 路由中已注释掉

### 2.7 游客（visitor）管理的过度设计

系统实现了完整的游客管理体系（`sys_user_visitor` 表 + Controller + Service + 前端页面），包括：
- 游客的部门分配
- 游客的角色分配
- 游客的用户组分配
- 游客的表权限默认值（`sys_user_table_default_permission`）

但系统核心功能是交通调度可视化，游客通常只需"只读查看大屏"。当前设计更像是把"游客"当成了"临时用户"来管理，配备了管理后台中管理员需要的全部分配界面。这是为低频操作设计的高维护成本功能。

---

## 三、缺失的核心功能

### 3.1 交通拥堵/流量分析（P0）

**README原文**: "显示实时交通情况，用不同颜色来标识拥堵情况"

当前空状态：后端无任何拥堵计算逻辑，前端无拥堵渲染模块。数据库中虽然有OSM路网和车辆轨迹点，但没有：
- 路段车速聚合计算
- 拥堵指数算法
- 热力图渲染

### 3.2 时间轴回放功能（P0）

**README原文**: "支持回放某时间段内的交通情况"、"支持回放某车辆某时间段内的所有活动"

当前空状态：
- 前端 `ClockModule` 已实现时间轴控制（play/pause/seek）
- 前端 `formPanel/runtimeDiagram` 已有时序图页面
- 但后端没有按时间戳批量查询历史状态的接口
- 信号灯计算支持 `timeRange` 参数，但车辆/航空器历史轨迹查询接口返回的是静态数据而非"按时间推进的状态流"
- 缺少回放速度控制、时间跳跃等后端数据缓存

### 3.3 数据统计看板（P1）

当前系统完全没有统计功能：
- 无信号灯调度执行统计（执行次数、成功率）
- 无车辆交通流量统计（日/周/月流量趋势）
- 无空域使用率统计
- 无系统使用统计（API调用量、活跃用户数）
- 管理端首页 `home/content.vue` 只是一个静态欢迎页

### 3.4 告警/通知系统（P1）

系统缺少：
- 车辆异常行为告警（超速、逆行、长时间停留）
- 信号灯故障告警（离线、状态不一致）
- 空域入侵告警（未授权航空器进入禁飞区）
- 虽然有 `MailModule` 和 `SmsModule`，但未与任何业务告警集成

### 3.5 角色/权限模板（P1）

当前角色权限分配是全手动的——每新增一个子系统，管理员需要手动为每个角色逐个勾选该子系统的所有权限点。缺少"角色模板"或"权限批量复制"功能。

### 3.6 数据导出（P2）

所有管理端列表页均无"导出Excel"按钮。`common/src/util/excel-utils.ts` 已实现Excel工具函数，但前端未接入。

### 3.7 操作日志的查询与分析（P2）

操作日志只能简单列表查看，缺少：
- 按接口聚合（哪个接口调用最多）
- 按用户聚合（哪个用户操作最频繁）
- 异常操作筛选（哪些请求返回了非200）
- 趋势图表

### 3.8 地图图层动态管理（P2）

当前地图底图/图层是硬编码在 `useCesium.ts` 中的（天地图、GeoServer WMS URL），管理员无法通过UI：
- 动态添加/移除WMS/WMTS图层
- 调整图层叠加顺序
- 配置图层透明度

### 3.9 路口-信号灯关联管理（P2）

`junction_connection` Controller为空类，这意味着：
- 路口之间如何通过道路连接？无管理界面
- 信号灯属于哪个路口？有 `signal_light_child_road_mapping` 表但无模块代码
- 特种车辆导航算法需要的"路口+道路+信号灯"关联数据无法维护

### 3.10 移动端/响应式适配（P2）

admin前端完全没有移动端适配考虑：
- Cesium地图在小屏幕上无触摸手势支持
- 管理端表单页面最小宽度假设为桌面端
- 无PWA配置、无离线缓存

---

## 四、数据模型冗余分析

### 4.1 审计字段在所有表中重复定义

72个model中，每个都有：
```
create_role / update_role / create_by / update_by / create_time / update_time / deleted
```
这些字段在MySQL和PostgreSQL中重复定义，不能通过Prisma的 `@@map` 和类型组合来复用。

### 4.2 MySQL与PostgreSQL数据重复

以下模型同时在两个数据库中存在：
- `signal_light_group_info` / `signal_light_info`
- `signal_light_strategy_*` (6张策略表)
- `vehicle_info` / `vehicle_track_point`
- `three_d_file_*` (3张3D文件表)

这是为了同时满足"业务事务"和"空间查询"需求，但增加了双写复杂度和一致性风险。

### 4.3 日志表结构膨胀

5张日志表（`log_operation`、`log_operation_ws`、`log_user_login`、`log_user_login_ws`、`log_scheduled_task`、`log_algorithm_call`），每张都有完整的审计字段。对于高频写入的日志表，建议：
- 去掉 `update_role`/`update_by`/`update_time`（日志只追加不修改）
- 考虑使用专门的时序数据库或归档策略

---

## 五、功能优先级矩阵

| 功能 | 当前状态 | 业务价值 | 实现成本 | 优先级 |
|------|---------|---------|---------|--------|
| 拥堵流量分析 | 缺失 | 极高 | 中 | P0 |
| 时间轴回放 | 缺失 | 极高 | 高 | P0 |
| 信号灯策略简化（8表→3表） | 冗余 | 中 | 高 | P1 |
| 双权限体系合并 | 冗余 | 高 | 高 | P1 |
| 数据统计看板 | 缺失 | 高 | 中 | P1 |
| 告警/通知系统 | 缺失 | 高 | 中 | P1 |
| 移除ScriptModule模拟脚本 | 冗余 | — | 低 | P1 |
| 移除ProxyModule | 冗余 | — | 低 | P1 |
| 路口-信号灯关联管理 | 缺失 | 中 | 低 | P2 |
| 数据导出 | 缺失 | 中 | 低 | P2 |
| 角色权限模板 | 缺失 | 中 | 中 | P2 |
| 操作日志分析 | 缺失 | 低 | 低 | P2 |
| 地图图层动态管理 | 缺失 | 低 | 中 | P2 |
| 信号灯-道路映射管理 | 缺失 | 中 | 低 | P2 |
| 清理旧版登录页 | 冗余 | — | 低 | P2 |
| 移动端/响应式适配 | 缺失 | 低 | 高 | P2 |
| 双数据库合并/同步方案 | 冗余 | 中 | 极高 | P2 |
| 移除信号灯MySQL副本 | 冗余 | 中 | 极高 | P2 |

---

## 六、总结

该项目的**系统管理功能**（RBAC、代码生成器、日志、定时任务）实现得过于完整——达到了一个通用后台管理框架的级别，有约20个与"交通业务"不直接相关的功能模块。

而**核心交通业务功能**（拥堵分析、回放、导航空算法、数据看板、告警）中，有多个README中明确规划的功能尚未实现，处于"待定"状态。

**一句话**: 系统管理的脚手架搭得极其完整，但交通业务的"血肉"还待填充。
