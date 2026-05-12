<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NCard, NCollapse, NCollapseItem, NTable, NTag } from 'naive-ui';
import { strategyOverviewApi } from '@/api/module/dcts/strategyOverview.ts';
import type { StrategyOverviewGroupVo } from '@/type/module/dcts/strategyOverview.ts';

const groups = ref<StrategyOverviewGroupVo[]>([]);
const loading = ref(false);

const colorMap: Record<string, { type: string; color: string }> = {
  green: { type: 'success', color: '#52c41a' },
  yellow: { type: 'warning', color: '#faad14' },
  red: { type: 'error', color: '#f5222d' },
};

const strategyTypeLabel: Record<string, string> = {
  custom: '固定策略',
  fineTuning: '微调策略',
  top: '紧急策略',
};

const scheduleTypeLabel: Record<string, string> = {
  day: '每日',
  week: '每周',
  month: '每月',
  year: '每年',
  ftp: '固定时段',
};

onMounted(async () => {
  loading.value = true;
  try {
    groups.value = await strategyOverviewApi();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="strategy-overview">
    <n-card title="信号灯策略多表联查" :bordered="false">
      <div v-if="groups.length === 0 && !loading" class="empty-hint">
        暂无数据。请先运行 generateMockStrategyData 脚本生成模拟数据。
      </div>

      <n-collapse>
        <n-collapse-item
          v-for="group in groups"
          :key="group.groupId"
          :title="`${group.groupName} (${group.strategyTypes.length}个策略类型)`"
          :name="String(group.groupId)"
        >
          <n-collapse>
            <n-collapse-item
              v-for="type in group.strategyTypes"
              :key="type.typeId"
              :title="`${type.typeName}`"
              :name="String(group.groupId) + '-' + String(type.typeId)"
            >
              <template #header-extra>
                <n-tag size="small">{{ strategyTypeLabel[type.strategyType] || type.strategyType }}</n-tag>
                <n-tag size="small" style="margin-left: 8px">{{ scheduleTypeLabel[type.scheduleType] || type.scheduleType }}</n-tag>
              </template>

              <n-collapse>
                <n-collapse-item
                  v-for="sched in type.schedules"
                  :key="sched.scheduleId"
                  :title="`${sched.scheduleName} (${sched.params.length}个参数)`"
                  :name="String(type.typeId) + '-' + String(sched.scheduleId)"
                >
                  <n-table :single-line="false" size="small">
                    <thead>
                      <tr>
                        <th>参数名称</th>
                        <th>方向</th>
                        <th>轮次</th>
                        <th>时长(s)</th>
                        <th>灯色</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="param in sched.params" :key="param.paramId">
                        <td>{{ param.name }}</td>
                        <td>{{ param.lightType }}</td>
                        <td>{{ param.round }}</td>
                        <td>{{ param.duration }}</td>
                        <td>
                          <n-tag
                            :type="(colorMap[param.currentLight]?.type || 'default') as any"
                            size="small"
                          >
                            {{ param.currentLight }}
                          </n-tag>
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                </n-collapse-item>
              </n-collapse>
            </n-collapse-item>
          </n-collapse>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<style scoped>
.strategy-overview {
  padding: 0;
}

.empty-hint {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}
</style>
