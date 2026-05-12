# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

- **Package manager**: pnpm (v10.13.0+)
- **Build all**: `pnpm build` (config & common first)
- **Dev server (backend)**: `pnpm start:dev` — NestJS with hot-reload on port 8937
- **Dev server (admin frontend)**: `pnpm dev:admin` — Vite dev server on port 7947
- **Generate Prisma clients**: `pnpm generate:prisma` (both MySQL & PostgreSQL)
- **Backend tests**: `cd server && npm test` (Jest, `*.spec.ts` files)
- **Backend lint**: `cd server && npm run lint` (ESLint + Prettier, rules are mostly off)
- **Prod build server**: `pnpm build:server:wp` (webpack bundle)

## Monorepo Structure

```
admin/          @dcts/admin       Vue 3 + Vite frontend (admin panel + Cesium dashboard)
server/         @dcts/server      NestJS backend
common/         @dcts/common      Shared utilities (build with tsc first)
config/         @dcts/config      Environment config (dev/prod, third-party keys)
prisma/                           Prisma schema files (mysql, postgresql)
prisma-generated/                 Generated Prisma clients (committed)
```

`config` and `common` must be built before other packages (`pnpm build:config && pnpm build:common` or use `pnpm build:config-common`).

## Backend Architecture

### Module Hierarchy

```
AppModule
├── IdentityModule (@Global) — user identity + login logging
├── InfraModule — infrastructure services
│   ├── AuthModule, RedisModule, PrismaModule (@Global), QueueModule (BullMQ)
│   ├── WsModule (Socket.IO), ScheduleModule, WinstonModule (logging)
│   └── MailModule, SmsModule, StaticModule
├── ProxyModule — API proxy forwarding
├── AlgorithmModule — external algorithm interface with SF permission system
├── DctsModule — core traffic domain logic
│   ├── signal-light/ — signal light groups, child lights, styles
│   ├── signal-light-strategy/ — strategy types, schedules, params (multi-table mapping)
│   ├── junction/ — road junctions & connections
│   ├── spatial-data/ — spatial queries on PostGIS
│   ├── vehicle/ — vehicle info & track points
│   ├── airspace/ — flight restriction zones, routes, user applications
│   ├── aircraft-manage/ — low-altitude aircraft & track points
│   ├── asset/ — 3D file groups/units
│   ├── external/ — external service integrations
│   ├── user/ — DCTS-specific user management
│   └── core/ — DctsCoreService (signal calculation), DctsCalculateService
└── MainModule — admin system management (users, roles, menus, depts, dicts, logs, etc.)
```

### Database

- **MySQL** (`prisma/mysql.schema.prisma`): Main business data. All models managed by Prisma, with soft delete (`deleted = 'N'/'Y'`) and audit fields (`create_by`, `update_by`, `create_role`, `update_role`, `create_time`, `update_time`).
- **PostgreSQL + PostGIS** (`prisma/postgresql.schema.prisma`): Geographic data. OSM road network tables (`planet_osm_nodes/ways/rels/line`) imported by osm2pgsql — these table structures must NOT be modified (per README).

### Module Directory Convention

See `docs/二开注意事项.md` for full details. Quick reference:

**Backend**: `server/src/module/{域}/{业务名}/{模块名}/` (complex) or `server/src/module/{域}/{业务名}/` (simple). Each module has: `dto.ts`, `*.controller.ts`, `*.module.ts`, `*.service.ts`, `*.facade.service.ts` (optional).

**Frontend** mirrors backend at `admin/src/{api,dict,type,views}/module/{域}/{业务名}/{模块名}/`.

### CRUD Route Convention

Every module has exactly **9 standard routes**: `GET /` (page), `GET /all`, `GET /ids`, `GET /:id`, `POST /` (insert), `POST /s` (batch insert), `PUT /` (update), `PUT /s` (batch update), `DELETE /`. All return `R<T>` wrapper.

For new single-table CRUD modules, ask the user to generate via the built-in code generator. Multi-table join queries can be hand-written.

### Key Service Patterns

- **PrismaService** (`server/src/infra/prisma/prisma.service.ts`): Wrapper around raw Prisma with built-in soft-delete filtering, snake_case/CamelCase conversion, dynamic query construction, and pagination. Use `MysqlPrismaService` for MySQL tables, `PostgresqlPrismaService` for PostgreSQL tables.
- **BaseContextService** (`server/src/infra/base-context/`): Thread-local user context via `nestjs-cls`. Stores current user identity, auth type, field selection parameters. All modules use it to get the current user's role/permissions.
- **PermissionGuard**: Multi-layer authorization — token validation, API key support, public interface whitelist, IP whitelist, top-admin bypass, and per-interface permission checks.
- **Code Generation** (`server/src/module/main/sys-util/code-generation/`): Auto-generates full CRUD modules (controller, service, module, DTOs, facade) from database table definitions.
- **Response format**: All API responses use `R<T>` wrapper (`{ code, data, msg, time, timestamp }`). Use `R.ok(data)` for success.

### Config System

`config/config/` stores environment-specific config (`dev`/`prod` keys). Access via `serverConfig.currentConfig()`, `adminConfig.currentConfig()`, etc. The `getCurrentConfig()` function reads `NODE_ENV` (server) or `import.meta.env.MODE` (Vite) to select the right environment. Prod config files are gitignored (`*prod.config.ts`).

**Important**: When making code changes, always bump `currentVersion` in `config/config/public.config.ts`. This version is used for `assetsDir` to bust static resource caches.

## Frontend Architecture

Two distinct UIs share the same `@dcts/admin` package:

- **Admin panel** (`/home`, `/user/*`): Element Plus UI for system management (users, roles, menus, etc.)
- **Dashboard** (`/dashboard/*`): Naive UI + Cesium for the 3D traffic visualization map. Uses WebSocket for real-time vehicle/signal data.

### Dashboard Map Architecture

- `useDashboardCesium.ts` is the main orchestrator — composes modules: `VehicleModule`, `SignalLightModule`, `AircraftModule`, `AirspaceModule`, `MapInteractionModule`, `ContextMenuModule`, `ClockModule`, etc.
- `useCesium.ts` provides the base Cesium viewer initialization (terrain, imagery layers from Tianditu/SuperMap/GeoServer).
- WebSocket client (`admin/src/services/wsClient.ts`) with reconnection and heartbeat.

### Router Convention

Frontend routes are organized by panel:
- `/dashboard/form-panel/` — CRUD forms for signal lights, strategies, airspace, etc.
- `/dashboard/admin-panel/` — admin management forms
- `/dashboard/user-panel/` — end-user self-service
- `/three/` — separate Three.js 3D viewer page

### State Management

Pinia stores in `admin/src/store/module/`: `user` (auth state), `sys` (current system context), `router`, `dict`, `dashboard`, `sysConfig`.

## Before Generating Prisma Clients

When you need to re-generate Prisma clients (schema changes), run:
```bash
pnpm generate:prisma
```
This generates both MySQL and PostgreSQL clients into `prisma-generated/`. The generated clients are checked into git.

## Adding Frontend Entry Points

When new frontend routes are added (e.g., a new dashboard page or admin panel page), I do **NOT** have the ability to add navigation entry points directly. The following must be done by the user:

- **大屏页右键菜单** (Dashboard right-click context menu): User must add the entry manually.
- **管理端侧边栏菜单** (Admin panel sidebar menu): User must add the entry manually.

**My responsibility**: After adding a new route, I must tell the user what entry points are needed and where, so they can add them.
