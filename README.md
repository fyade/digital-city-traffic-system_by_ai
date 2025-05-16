# 数字孪生城市交通管理系统

## 项目描述

本项目基于数字孪生技术，构建城市交通管理仿真与优化平台，实现交通信号灯智能调度等功能。

## 技术选型

### 前端技术栈

- **核心框架**：Vue 3 + TypeScript（全家桶：Router/Pinia/Vite）
- **地图引擎**：
    - Cesium（三维地理可视化）
    - AntV（数据可视化）
    - SuperMap（在本项目中作底图服务）
    - OpenStreetMap（在本项目中作路网服务）
- **UI组件库**：
    - Element Plus（管理端）
    - Naive UI（大屏端）

### 后端技术栈

- **核心框架**：NestJS（TypeScript全栈架构）
- **ORM/数据库工具**：
    - Prisma（数据库ORM）
    - PostGIS（空间数据扩展）
- **缓存/消息队列**：Redis（高频数据缓存/实时通信）
- **GIS服务端**：
    - GeoServer（地图服务发布）

### 基础设施与工程化

- **数据库**：
    - MySQL（在本项目中作主库）
    - PostgreSQL（在本项目中作地理信息库）
- **代码管理**：Monorepo（多模块统一管理）
