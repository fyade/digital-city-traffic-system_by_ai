<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { NButton, NCard, NDatePicker, NGrid, NGridItem, NIcon, NInput, NSpace, NStatistic, NSwitch, NTable } from 'naive-ui';
import { Close } from '@vicons/ionicons5';
import * as echarts from 'echarts';
import { activeAircraftApi, activeVehiclesApi, congestionApi, signalLightStatusApi, trafficOverviewApi, vehicleFlowStatisticsApi } from '@/api/module/dcts/statistics.ts';
import type { ActiveAircraftVo, ActiveVehicleVo, CongestionCellVo, SignalLightStatusDistributionVo, TrafficOverviewVo, VehicleFlowVo } from '@/type/module/dcts/statistics.ts';
import { gotoDashboardHome } from '@/views/dashboard/utils/base.ts';
import { signalLightGroupInfoApi } from '@/api/module/dcts/signalLight/signalLightGroupInfo.ts';
import { queryVehicleTrajectoryApi } from '@/api/module/dcts/spatialData.ts';
import type { VehicleTrackPointDto } from '@/type/module/dcts/vehicle/vehicleTrackPoint.ts';

// 概览数据
const overview = ref<TrafficOverviewVo>({
  totalVehicles: 0,
  totalSignalLightGroups: 0,
  activeVehiclesLast5Min: 0,
  totalFlightRestrictionZones: 0,
  totalFlightRoutes: 0,
  totalAircraft: 0,
  activeAircraftLast5Min: 0,
});

// 车辆流量图表
const vehicleFlowChartRef = ref<HTMLDivElement>();
let vehicleFlowChart: echarts.ECharts | null = null;

// 信号灯状态图表
const signalLightChartRef = ref<HTMLDivElement>();
let signalLightChart: echarts.ECharts | null = null;

const activeVehicles = ref<ActiveVehicleVo[]>([]);
const activeAircraft = ref<ActiveAircraftVo[]>([]);
const congestionCells = ref<CongestionCellVo[]>([]);
const congestionMax = ref(0);
const trajectoryPlate = ref('');
const trajectoryPoints = ref<VehicleTrackPointDto[]>([]);
const trajectoryLoading = ref(false);

const autoRefresh = ref(false);
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null;

function toggleAutoRefresh(val: boolean) {
  if (val) {
    autoRefreshTimer = setInterval(loadAllData, 30000);
  } else {
    if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
  }
}

const refreshing = ref(false);
const timeRange = ref<[number, number]>([
  Date.now() - 24 * 60 * 60 * 1000,
  Date.now(),
]);

const overviewCards = [
  { label: '车辆总数', key: 'totalVehicles' as const },
  { label: '近5分钟活跃车辆', key: 'activeVehiclesLast5Min' as const },
  { label: '信号灯组总数', key: 'totalSignalLightGroups' as const },
  { label: '航空器总数', key: 'totalAircraft' as const },
  { label: '近5分钟活跃航空器', key: 'activeAircraftLast5Min' as const },
  { label: '限飞区', key: 'totalFlightRestrictionZones' as const },
  { label: '航线', key: 'totalFlightRoutes' as const },
];

async function loadAllData() {
  refreshing.value = true;
  try {
    const overviewRes = await trafficOverviewApi();
    overview.value = overviewRes;

    const [startTime, endTime] = timeRange.value;
    const flowRes = await vehicleFlowStatisticsApi({
      points: [
        { lon: 116.0, lat: 39.6 },
        { lon: 116.8, lat: 39.6 },
        { lon: 116.8, lat: 40.2 },
        { lon: 116.0, lat: 40.2 },
      ],
      startTime,
      endTime,
      groupBy: 'hour',
    });

    if (vehicleFlowChart) {
      vehicleFlowChart.setOption({
        xAxis: { data: flowRes.map((item: VehicleFlowVo) => item.timeBucket) },
        series: [{ data: flowRes.map((item: VehicleFlowVo) => item.vehicleCount) }],
      });
    }

    try {
      const groups = await signalLightGroupInfoApi.selectAll({});
      const groupIds = (groups as { id: number }[]).map(g => g.id);
      if (groupIds.length > 0 && signalLightChart) {
        const statusRes = await signalLightStatusApi({ groupIds, timeRange: [startTime, endTime] });
        const colorSums: Record<string, number> = {};
        for (const item of statusRes as SignalLightStatusDistributionVo[]) {
          colorSums[item.color] = (colorSums[item.color] || 0) + item.totalDurationMs;
        }
        signalLightChart.setOption({
          series: [{
            data: [
              { value: colorSums['green'] || 0, name: '绿灯', itemStyle: { color: '#52c41a' } },
              { value: colorSums['red'] || 0, name: '红灯', itemStyle: { color: '#f5222d' } },
              { value: colorSums['yellow'] || 0, name: '黄灯', itemStyle: { color: '#faad14' } },
            ],
          }],
        });
      }
    } catch { /* ignore */ }

    try { activeVehicles.value = await activeVehiclesApi(); } catch { /* ignore */ }
    try { activeAircraft.value = await activeAircraftApi(); } catch { /* ignore */ }

    try {
      const cells = await congestionApi({ minLon: 116.0, maxLon: 116.8, minLat: 39.6, maxLat: 40.2, cellsPerSide: 8 });
      congestionCells.value = cells as CongestionCellVo[];
      congestionMax.value = Math.max(...(cells as CongestionCellVo[]).map(c => c.vehicleCount), 1);
    } catch { /* ignore */ }
  } finally {
    refreshing.value = false;
  }
}

onMounted(async () => {
  // 初始化ECharts
  if (vehicleFlowChartRef.value) {
    vehicleFlowChart = echarts.init(vehicleFlowChartRef.value);
    vehicleFlowChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: [], axisLabel: { rotate: 45 } },
      yAxis: { type: 'value', name: '车辆数' },
      series: [{ name: '车辆数', type: 'bar', data: [], itemStyle: { color: '#1890ff' } }],
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    });
  }
  if (signalLightChartRef.value) {
    signalLightChart = echarts.init(signalLightChartRef.value);
    signalLightChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        name: '灯色占比', type: 'pie', radius: ['40%', '70%'],
        data: [
          { value: 0, name: '绿灯', itemStyle: { color: '#52c41a' } },
          { value: 0, name: '红灯', itemStyle: { color: '#f5222d' } },
          { value: 0, name: '黄灯', itemStyle: { color: '#faad14' } },
        ],
        label: { formatter: '{b}: {d}%' },
      }],
    });
  }

  await loadAllData();
  window.addEventListener('resize', handleResize);
});

function handleResize() {
  vehicleFlowChart?.resize();
  signalLightChart?.resize();
}

async function queryTrajectory() {
  if (!trajectoryPlate.value) return;
  trajectoryLoading.value = true;
  try {
    const [startTime, endTime] = timeRange.value;
    trajectoryPoints.value = await queryVehicleTrajectoryApi({
      plateNumber: trajectoryPlate.value,
      startTime,
      endTime,
    }) as VehicleTrackPointDto[];
  } catch {
    trajectoryPoints.value = [];
  } finally {
    trajectoryLoading.value = false;
  }
}

function exportActiveVehiclesCSV() {
  if (activeVehicles.value.length === 0) return;
  const header = '车牌号,车辆类型,最后经度,最后纬度,最后活跃时间';
  const rows = activeVehicles.value.map(v =>
    `${v.plateNumber},${v.vehicleType},${v.lastLon.toFixed(6)},${v.lastLat.toFixed(6)},${new Date(v.lastSeen).toLocaleString()}`,
  );
  const csv = '﻿' + header + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `活跃车辆_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

onBeforeUnmount(() => {
  if (autoRefreshTimer) { clearInterval(autoRefreshTimer); }
  window.removeEventListener('resize', handleResize);
  vehicleFlowChart?.dispose();
  signalLightChart?.dispose();
});
</script>

<template>
  <div class="statistics-overlay">
    <div class="statistics-container">
      <div class="page-header">
        <h2 class="page-title">交通流量统计</h2>
        <n-space align="center">
          <n-date-picker
            v-model:value="timeRange"
            type="datetimerange"
            clearable
            format="MM-dd HH:mm"
            style="width: 280px"
          />
          <n-switch v-model:value="autoRefresh" @update:value="toggleAutoRefresh" size="small" />
          <span style="font-size:12px;color:#999">自动(30s)</span>
          <n-button size="small" :loading="refreshing" @click="loadAllData">刷新数据</n-button>
          <n-button text @click="gotoDashboardHome" class="close-btn">
            <n-icon :component="Close" size="24" />
          </n-button>
        </n-space>
      </div>

    <!-- 概览卡片 -->
    <n-grid :cols="4" :x-gap="16" :y-gap="16" class="overview-section" responsive="screen">
      <n-grid-item v-for="card in overviewCards" :key="card.key">
        <n-card :title="card.label" hoverable>
          <n-statistic :value="overview[card.key]" />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 车辆流量柱状图 -->
    <n-card title="车辆流量（近24小时）" class="chart-card">
      <div ref="vehicleFlowChartRef" class="chart-box"></div>
    </n-card>

    <!-- 信号灯状态分布 -->
    <n-card title="信号灯状态分布" class="chart-card">
      <div ref="signalLightChartRef" class="chart-box"></div>
    </n-card>

    <!-- 拥堵检测 -->
    <n-card title="拥堵检测（近15分钟网格密度）" class="chart-card">
      <div class="congestion-grid" v-if="congestionCells.length > 0">
        <div
          v-for="cell in congestionCells"
          :key="`${cell.cellX}-${cell.cellY}`"
          class="congestion-cell"
          :class="cell.level"
          :style="{ opacity: 0.3 + (cell.vehicleCount / congestionMax) * 0.7 }"
          :title="`(${cell.cellLon.toFixed(4)}, ${cell.cellLat.toFixed(4)}): ${cell.vehicleCount}辆`"
        >
          <span class="cell-count">{{ cell.vehicleCount }}</span>
        </div>
      </div>
      <div v-else class="empty-hint">暂无拥堵数据</div>
    </n-card>

    <!-- 活跃车辆列表 -->
    <n-card title="活跃车辆实时列表" class="chart-card">
      <template #header-extra>
        <n-button size="small" @click="exportActiveVehiclesCSV" :disabled="activeVehicles.length === 0">导出CSV</n-button>
      </template>
      <n-table :single-line="false" size="small">
        <thead>
          <tr>
            <th>车牌号</th>
            <th>车辆类型</th>
            <th>最后位置(经度,纬度)</th>
            <th>最后活跃时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in activeVehicles" :key="v.vehicleId">
            <td>{{ v.plateNumber }}</td>
            <td>{{ v.vehicleType }}</td>
            <td>{{ v.lastLon.toFixed(6) }}, {{ v.lastLat.toFixed(6) }}</td>
            <td>{{ new Date(v.lastSeen).toLocaleString() }}</td>
          </tr>
          <tr v-if="activeVehicles.length === 0">
            <td colspan="4" style="text-align:center;color:#999">暂无活跃车辆数据</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>

    <!-- 活跃航空器列表 -->
    <n-card title="活跃航空器实时列表" class="chart-card">
      <n-table :single-line="false" size="small">
        <thead>
          <tr>
            <th>名称</th>
            <th>型号</th>
            <th>最后位置(经度,纬度)</th>
            <th>最后活跃时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in activeAircraft" :key="a.aircraftId">
            <td>{{ a.name }}</td>
            <td>{{ a.model }}</td>
            <td>{{ a.lastLon.toFixed(6) }}, {{ a.lastLat.toFixed(6) }}</td>
            <td>{{ new Date(a.lastSeen).toLocaleString() }}</td>
          </tr>
          <tr v-if="activeAircraft.length === 0">
            <td colspan="4" style="text-align:center;color:#999">暂无活跃航空器数据</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>

    <!-- 车辆轨迹查询 -->
    <n-card title="车辆轨迹查询" class="chart-card">
      <n-space align="center" style="margin-bottom: 12px">
        <n-input
          v-model:value="trajectoryPlate"
          placeholder="输入车牌号，如 京A12345"
          clearable
          style="width: 200px"
          @keyup.enter="queryTrajectory"
        />
        <n-button size="small" :loading="trajectoryLoading" @click="queryTrajectory">查询轨迹</n-button>
      </n-space>
      <n-table :single-line="false" size="small" v-if="trajectoryPoints.length > 0">
        <thead>
          <tr>
            <th>序号</th>
            <th>位置(经度,纬度)</th>
            <th>方向角</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pt, idx) in trajectoryPoints" :key="pt.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ pt.point }}</td>
            <td>{{ pt.heading }}°</td>
            <td>{{ new Date(pt.createTime).toLocaleString() }}</td>
          </tr>
        </tbody>
      </n-table>
      <div v-else class="empty-hint">输入车牌号查询车辆轨迹</div>
    </n-card>
    </div>
  </div>
</template>

<style scoped>
.statistics-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: var(--n-color, #fff);
  overflow-y: auto;
}

.statistics-container {
  padding: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  margin-left: 0;
}

.overview-section {
  margin-bottom: 16px;
}

.chart-card {
  margin-bottom: 16px;
}

.chart-box {
  width: 100%;
  height: 400px;
}

.congestion-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.congestion-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.congestion-cell.low {
  background-color: #52c41a;
}

.congestion-cell.medium {
  background-color: #faad14;
}

.congestion-cell.high {
  background-color: #f5222d;
}

.cell-count {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
</style>
