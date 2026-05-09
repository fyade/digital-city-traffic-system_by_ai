# 前端性能分析报告

> 分析日期：2026-05-09  
> 状态：**待优化**（仅分析，优化尚未执行）  
> 分析范围：admin/ 前端项目（Vue 3 + Vite + Cesium + Element Plus + Naive UI）

---

## 一、整体评估

| 维度 | 当前状态 | 等级 |
|------|---------|------|
| 初始加载体积 | 双UI库 + Cesium全覆盖加载 | 差 |
| 代码分割 | 仅路由级默认懒加载，无手动分包 | 一般 |
| Cesium加载 | top-level同步import，加载完成后才渲染 | 差 |
| 状态管理持久化 | dashboard.store 整个Map持久化到localStorage | 差 |
| 运行时性能 | 全局MutationObserver + 定时器较多 | 一般 |
| 资源压缩 | gzip已启用，但无Brotli，无图片优化 | 一般 |
| 内存管理 | 核心模块有destroy，但部分定时器未清理 | 一般 |
| 缓存策略 | 无HTTP缓存头配置，无Service Worker | 差 |

---

## 二、致命问题（影响可用性）

### 2.1 Cesium同步导入导致Dashboard首屏白屏

**位置**: `admin/src/views/dashboard/core/useDashboardCesium.ts:14` — `import * as Cesium from "cesium"`

Cesium Bundle体积约 94MB（node_modules），虽然Vite会tree-shake，但Cesium的同步top-level import意味着：
- 浏览器解析到 `useDashboardCesium.ts` 的import链时必须等待Cesium所有模块加载完毕
- Vite dev模式下Cesium会被预构建为多个chunk，但它是所有dashboard相关代码的共同祖先
- 任何import了 `useDashboardCesium.ts` 的地方都会级联加载Cesium

**影响**: Dashboard页面首屏可能白屏5-15秒（取决于网络），因为Cesium的WebWorker（7个worker文件，1.3MB）也需要加载。

**当前加载流程** (`dashboard/index/index.vue`):
```
onMounted → cesiumClass.init2() → Cesium.Viewer构造
  → 等待所有Worker加载完毕
  → 等待天地图/GeoServer瓦片加载完毕
  → ifInited = true → 显示子路由内容
```
用户看到的是空白div（`v-if="ifInited"` 隐藏了一切子内容），直到Cesium完全初始化。

### 2.2 双UI库全量加载

| 库 | node_modules体积 | 当前加载方式 |
|----|-----------------|-------------|
| Element Plus | 58MB | `index.css` + `dark/css-vars.css` 全局加载 |
| Naive UI | 41MB | 通过Tree-shaking自动按需，但CSS在全局SCSS中 |

`main.ts:9-11`:
```typescript
import 'element-plus/theme-chalk/index.css'          // 全量CSS
import 'element-plus/theme-chalk/dark/css-vars.css'   // 暗色主题CSS也全量
import naive from "naive-ui";                          // 全量注册
```

前端同时加载了两个完整UI框架。任何一个路由都携带两者。Element Plus通过 `unplugin-vue-components` 做了组件级tree-shaking，但CSS无法tree-shake——全量CSS约300KB被无条件加载。

### 2.3 Dashboard Store localStorage持久化可能导致性能问题

**位置**: `admin/src/store/module/dashboard.ts` — 标注 `persist: true`

- `idsOfBaseMaps: string[][]` — 二维数组持久化
- `currentCacheData: Map<string, any>` — 使用 `deepClone()` 读写
- 每次调用 `setCurrentCacheData()` 触发：深度克隆 → 响应式更新 → 序列化到localStorage

**问题链**: 如果dashboard缓存了车辆/信号灯数据（可能包含大量坐标数组），每次空间查询都会触发 deepClone + JSON序列化写入localStorage，造成主线程卡顿。

---

## 三、严重问题（影响用户体验）

### 3.1 全局MutationObserver监听所有表单提交

**位置**: `admin/src/loaded/singleInputNoEnterSubmit.ts`

```typescript
const observer = new MutationObserver(() => {
  const forms = document.querySelectorAll('form');   // 查询整个文档
  forms.forEach(form => {
    form.removeEventListener('submit', handleFormSubmit)
    form.addEventListener('submit', handleFormSubmit)  // 阻止所有表单提交
  })
});
observer.observe(document.body, { subtree: true, childList: true });
```

**影响**: 任何DOM变化（包括Vue渲染、Cesium动态添加元素）都会触发全文档 `querySelectorAll('form')` 查询。代码注释也说"懒得判断了，全加上吧"。

### 3.2 autoUpdate.ts 轮询检测新版本

**位置**: `admin/src/loaded/autoUpdate.ts`

```typescript
const html = await fetch(`/?timestamp=${new Date().getTime()}`).then(res => res.text())
```

启动后立即fetch整个 `index.html` 来比对script标签是否变化。每个标签页打开都多一次不必要的HTML请求，且使用 `confirm()` 弹窗体验差。

### 3.3 Cesium静态资源 7.8MB 未经优化

```
public/cesium-static/
├── Assets/      4.7MB   (纹理、模型)
├── Workers/     1.3MB   (7个WebWorker)
├── Widgets/     744KB   (CSS/图片)
└── ThirdParty/  1.1MB   (第三方库)
```

这些文件从 `public/` 直接提供，不经过Vite任何处理——无压缩、无缓存头、无hash文件名。每次部署后用户浏览器可能使用过期的缓存。

### 3.4 信号灯计算通过WebSocket推送大量数据

`signalLightModule.ts` 接收 `CalculateLightsInPolygonVo[]`，每个信号灯包含按秒级时间序列的灯光状态数组 `runParam[]`。假设100个信号灯，每个1小时的时间范围，每秒一个数据点 = 100 × 3600 = 360,000条数据通过WebSocket一次性推送，JSON序列化/反序列化可能阻塞主线程。

### 3.5 登出使用location.reload导致整页重载

**位置**: `admin/src/store/module/user.ts:93`

```typescript
const logOut = (ifReload = true) => {
  logOutApi()
  setTimeout(() => {
    removeToken()
    if (ifReload) {
      location.reload()   // 整页刷新，重新加载所有JS/CSS
    }
  })
}
```

---

## 四、中等问题

### 4.1 无manualChunks分包策略

**位置**: `admin/vite.config.ts`

只有 `assetsDir` 配置，未定义 `rollupOptions.output.manualChunks`。结果是：
- Cesium、Element Plus、Naive UI、Three.js 全部打入vendor chunk
- 所有dashboard module（12个functionModule + 2个core）混在dashboard chunk
- 所有admin管理页面的73个API文件混在各自的chunk中
- 更改一个信号灯表单可能导致整个vendor chunk的缓存失效

### 4.2 deepClone 过度使用

**位置**: `admin/src/store/module/dashboard.ts`

```typescript
setCurrentCacheData: (data) => {
  currentCacheData.set(key, deepClone(data))   // 写时深拷贝
}
getCurrentCacheData: () => {
  return deepClone(data)                        // 读时也深拷贝
}
```

这造成了双重性能损失：深拷贝本身开销 + 触发Vue响应式代理重新追踪。

### 4.3 100张图片资源未优化

100个PNG文件在 `admin/src/assets/images2/` 目录（100KB），无WebP格式、无懒加载、无CDN。通过Vite打包会转为base64或单独文件，但未做图片压缩或响应式图片处理。

### 4.4 localStorage滥用

3个Store开启 `persist: true`：
- `userStore` — 合理（token、用户信息）
- `sysConfigStore` — 合理（颜色主题偏好）
- `dashboardStore` — 不合理（Map缓存、二维数组、运行时状态）

dashboardStore持久化意味着每次页面关闭再打开，上次的缓存数据被还原但已过期，反而可能导致显示错误。

### 4.5 Naive UI全局注册

`main.ts:11`: `app.use(naive)` — 注册了Naive UI的message/dialog/notification等全局方法。这些方法会创建隐藏的DOM容器，即使在不使用Naive UI的管理页面也会存在。

### 4.6 定时器清理不完整

| 文件 | 定时器 | 是否清理 |
|------|--------|----------|
| `clockModule.ts` | setTimeout × 2 | 有clearTimeout |
| `layerNotificationModule.ts` | setTimeout × 3 | 有clearTimeout |
| `debugModule.ts` | setTimeout × 2 | 无clearTimeout |
| `home/content.vue` | setInterval × 2 + setTimeout × 2 | 无清理 |

---

## 五、优化建议（按优先级排列）

### P0：高优先级 — 立即见效，改动小

**1. Cesium延迟加载**
将 `import * as Cesium from "cesium"` 改为动态导入：
```typescript
const Cesium = await import("cesium")
```
在 `init2()` 中才真正触发import。
预期：Dashboard首屏从5-15秒降至1-2秒。

**2. Element Plus CSS按需加载**
移除全量CSS导入，使用 `unplugin-element-plus` 按需导入组件样式。
预期：CSS体积减少约200KB（gzip前）。

**3. 配置 manualChunks 分包**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-cesium': ['cesium'],
        'vendor-ui': ['element-plus', 'naive-ui'],
        'vendor-three': ['three'],
      }
    }
  }
}
```
预期：vendor chunk从约2MB拆成4个独立chunk并行加载，且变更不互相影响缓存。

### P1：中优先级 — 中期优化

**4. 修复全局MutationObserver**
限制为只监听特定容器（如 `.el` 或 `#app`），或去掉自动阻止表单提交改用 `@submit.prevent`

**5. 去掉 dashboardStore 的 persist**
改为只持久化必要的用户偏好（如 `ifShowSignalLight`），不持久化 `currentCacheData`。

**6. 移除 autoUpdate.ts 或改为Service Worker**
生产环境应使用Service Worker或更轻量的版本检测方式。

**7. Cesium静态资源添加长期缓存**
用带hash的文件名 + `Cache-Control: max-age=31536000, immutable`

**8. 补充debugModule和home/content.vue的定时器清理**
在组件 `onBeforeUnmount` / `destroy()` 中添加 `clearTimeout` / `clearInterval`

### P2：低优先级 — 长期优化

**9. Cesium CDN化**
将Cesium Worker/Assets/Widgets部署到CDN，减少主服务器压力。

**10. WebWorker处理信号灯数据反序列化**
将WebSocket收到的大量JSON数据移到WebWorker中解析，避免阻塞主线程。

**11. 图片优化**
- PNG → WebP格式
- 大图使用CDN
- 小图（<4KB）用SVG内联

**12. 表单页面使用虚拟滚动**
管理端的表格列表页统一使用虚拟滚动，避免渲染大量DOM。

---

## 六、量化预估

| 指标 | 当前估算值 | 优化后预估 |
|------|-----------|-----------|
| 首次加载JS体积 | ~1.5MB (gzip) | ~600KB (gzip) |
| Dashboard首次可交互时间 | 5-15s | 1-3s |
| Dashboard chunk数 | 2-3个 | 6-8个（并行加载） |
| CSS体积 | ~350KB | ~100KB |
| localStorage写入频率 | 每次操作 | 仅配置变更时 |
| 平均页面内存 | 300-500MB (含Cesium) | 200-400MB |

---

## 七、关键文件索引（性能相关）

| 文件 | 性能问题 |
|------|----------|
| `admin/src/main.ts` | 双UI库全局加载 + 双CSS全量导入 |
| `admin/src/App.vue` | n-config-provider + el-config-provider双重包裹 |
| `admin/src/views/dashboard/core/useCesium.ts` | Cesium同步import |
| `admin/src/views/dashboard/core/useDashboardCesium.ts` | 12个module全部同步import |
| `admin/src/views/dashboard/index/index.vue` | `v-if="ifInited"` 阻止渲染直到Cesium就绪 |
| `admin/src/store/module/dashboard.ts` | persist + deepClone双重性能损失 |
| `admin/src/loaded/singleInputNoEnterSubmit.ts` | 全局MutationObserver |
| `admin/src/loaded/autoUpdate.ts` | index.html全量轮询 |
| `admin/src/views/dashboard/functionModules/signalLightModule.ts` | 大数据量WebSocket JSON解析 |
| `admin/vite.config.ts` | 无manualChunks分包 |
