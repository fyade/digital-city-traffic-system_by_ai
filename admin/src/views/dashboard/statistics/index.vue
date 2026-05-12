<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { NCard, NGrid, NGridItem, NStatistic } from 'naive-ui';
import * as echarts from 'echarts';
import { trafficOverviewApi, vehicleFlowStatisticsApi } from '@/api/module/dcts/statistics.ts';
import type { TrafficOverviewVo, VehicleFlowVo } from '@/type/module/dcts/statistics.ts';

// 概览数据
const overview = ref<TrafficOverviewVo>({
  totalVehicles: 0,
  totalSignalLightGroups: 0,
  activeVehiclesLast5Min: 0,
});

// 车辆流量图表
const vehicleFlowChartRef = ref<HTMLDivElement>();
let vehicleFlowChart: echarts.ECharts | null = null;

// 信号灯状态图表
const signalLightChartRef = ref<HTMLDivElement>();
let signalLightChart: echarts.ECharts | null = null;

const overviewCards = [
  { label: '车辆总数', key: 'totalVehicles' as const },
  { label: '信号灯组总数', key: 'totalSignalLightGroups' as const },
  { label: '近5分钟活跃车辆', key: 'activeVehiclesLast5Min' as const },
];

onMounted(async () => {
  // 加载概览数据
  const overviewRes = await trafficOverviewApi();
  overview.value = overviewRes;

  // 加载车辆流量（默认北京区域、最近24小时）
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const flowRes = await vehicleFlowStatisticsApi({
    points: [
      { lon: 116.0, lat: 39.6 },
      { lon: 116.8, lat: 39.6 },
      { lon: 116.8, lat: 40.2 },
      { lon: 116.0, lat: 40.2 },
    ],
    startTime: dayAgo,
    endTime: now,
    groupBy: 'hour',
  });

  // 初始化ECharts
  if (vehicleFlowChartRef.value) {
    vehicleFlowChart = echarts.init(vehicleFlowChartRef.value);
    vehicleFlowChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: flowRes.map((item: VehicleFlowVo) => item.timeBucket),
        axisLabel: { rotate: 45 },
      },
      yAxis: { type: 'value', name: '车辆数' },
      series: [
        {
          name: '车辆数',
          type: 'bar',
          data: flowRes.map((item: VehicleFlowVo) => item.vehicleCount),
          itemStyle: { color: '#1890ff' },
        },
      ],
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    });
  }

  // 信号灯状态分布（占位饼图）
  if (signalLightChartRef.value) {
    signalLightChart = echarts.init(signalLightChartRef.value);
    signalLightChart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '灯色占比',
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 0, name: '绿灯', itemStyle: { color: '#52c41a' } },
            { value: 0, name: '红灯', itemStyle: { color: '#f5222d' } },
            { value: 0, name: '黄灯', itemStyle: { color: '#faad14' } },
          ],
          label: { formatter: '{b}: {d}%' },
        },
      ],
    });
  }

  window.addEventListener('resize', handleResize);
});

function handleResize() {
  vehicleFlowChart?.resize();
  signalLightChart?.resize();
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  vehicleFlowChart?.dispose();
  signalLightChart?.dispose();
});
</script>

<template>
  <div class="statistics-container">
    <h2 class="page-title">交通流量统计</h2>

    <!-- 概览卡片 -->
    <n-grid :cols="3" :x-gap="16" :y-gap="16" class="overview-section">
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
  </div>
</template>

<style scoped>
.statistics-container {
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
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
</style>
