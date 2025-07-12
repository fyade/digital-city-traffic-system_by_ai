<script setup lang="ts">
import { h, reactive } from "vue";
import Pagination2 from "@/components/pagination/pagination2.vue";
import { funcTablePageDashBoard } from "@/composition/tablePage/tablePageDashBoard2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { DataTableColumns, NButton, NIcon } from "naive-ui";
import { HandPointLeft } from '@vicons/fa'
import { MdRefresh, MdSearch } from '@vicons/ionicons4'
import { SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { signalLightStrategyScheduleApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { signalLightStrategyScheduleDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyTypeStrategyScheduleMapping.ts";
import { signalLightStrategyTypeStrategyScheduleMappingApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyTypeStrategyScheduleMapping.ts";
import { signalLightStrategyTypeStrategyScheduleMappingDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyTypeStrategyScheduleMapping.ts";
import { final } from "@/utils/base.ts";

const props = defineProps({
  selectStrategyTypeId: {
    type: Number,
    required: true
  }
})
const emits = defineEmits(['selectRow']);

const state = reactive<State2<SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto>>({
  dialogForm: {
    id: -1,
    name: '',
    description: '',
    scheduleType: '',
    startTime: '',
    endTime: '',
    cronExpression: '',
    ifDisabled: final.N,
    orderNum: final.DEFAULT_ORDER_NUM,
    remark: '',
  },
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {
    name: '',
    description: '',
    scheduleType: '',
  },
})
const config = new TablePageConfig<SignalLightStrategyScheduleDto>({
  getDataOnMounted: false,
  selectParam: {
    id: {in: {value: []}}
  }
})
const columns: DataTableColumns<SignalLightStrategyScheduleDto> = [
  {title: signalLightStrategyScheduleDict.name, key: 'name'},
  {title: signalLightStrategyScheduleDict.description, key: 'description'},
  {title: signalLightStrategyScheduleDict.scheduleType, key: 'scheduleType'},
  {title: signalLightStrategyScheduleDict.startTime, key: 'startTime'},
  {title: signalLightStrategyScheduleDict.endTime, key: 'endTime'},
  {title: signalLightStrategyScheduleDict.cronExpression, key: 'cronExpression'},
  {title: signalLightStrategyScheduleDict.ifDisabled, key: 'ifDisabled'},
  {title: signalLightStrategyScheduleDict.orderNum, key: 'orderNum'},
  {title: signalLightStrategyScheduleDict.remark, key: 'remark'},
  {
    title: '操作',
    key: 'operation',
    render(row) {
      return h(NButton, {
        text: true,
        onClick: () => emits('selectRow', row)
      }, {
        default: '选择',
        icon: h(NIcon, null, h(HandPointLeft))
      })
    }
  }
]

const {
  filterFormRef,
  filterFormVisible1,
  filterFormVisible,
  tableLoadingRef,
  tableData,
  pageParam,
  total,
  refresh,
  fEnter,
  fCon,
  fCan,
  gRefresh,
  gChangeFilterFormVisible,
  pageChange
} = funcTablePageDashBoard<SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto>({
  state,
  dFormRules: {},
  config,
  api: signalLightStrategyScheduleApi,
  dict: signalLightStrategyScheduleDict,
})

const stateSlstscm = reactive<State2<SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingUpdDto>>({
  dialogForm: new SignalLightStrategyTypeStrategyScheduleMappingUpdDto(),
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {},
})
const configSlstscm = new TablePageConfig<SignalLightStrategyTypeStrategyScheduleMappingDto>({
  selectParam: {
    strategyTypeId: props.selectStrategyTypeId
  },
  pageQuery: false,
  selectListCallback: () => {
    if (config.selectParam.id && typeof config.selectParam.id === 'object' && config.selectParam.id.in) {
      config.selectParam.id.in.value = tableDataSlstscm.value.map(item => item.strategyScheduleId)
    }
    refresh()
  }
})
const {
  tableData : tableDataSlstscm
} = funcTablePageDashBoard<SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingUpdDto>({
  state: stateSlstscm,
  dFormRules: {},
  config: configSlstscm,
  api: signalLightStrategyTypeStrategyScheduleMappingApi,
  dict: signalLightStrategyTypeStrategyScheduleMappingDict,
})
</script>

<template>
  <!--顶部筛选表单-->
  <div class="zs-filter-form" v-show="filterFormVisible1 && filterFormVisible">
    <n-form
        class="demo-form-inline"
        ref="filterFormRef"
        :model="state.filterForm"
        :inline="true"
        label-placement="left"
        @keyup.enter="fEnter"
    >
      <!--在此下方添加表单项-->
      <n-form-item :label="signalLightStrategyScheduleDict.name" path="name">
        <n-input v-model:value="state.filterForm.name" :placeholder="signalLightStrategyScheduleDict.name"/>
      </n-form-item>
      <n-form-item :label="signalLightStrategyScheduleDict.description" path="description">
        <n-input v-model:value="state.filterForm.description" :placeholder="signalLightStrategyScheduleDict.description"/>
      </n-form-item>
      <n-form-item :label="signalLightStrategyScheduleDict.scheduleType" path="scheduleType">
        <n-input v-model:value="state.filterForm.scheduleType" :placeholder="signalLightStrategyScheduleDict.scheduleType"/>
      </n-form-item>
      <!--在此上方添加表单项-->
      <n-form-item>
        <n-button type="primary" @click="fCon">筛选</n-button>
        <n-button @click="fCan">重置</n-button>
      </n-form-item>
    </n-form>
  </div>

  <!--操作按钮-->
  <div class="zs-button-row">
    <div>
      <n-button type="primary" secondary @click="gRefresh">
        刷新
        <template #icon>
          <NIcon>
            <MdRefresh/>
          </NIcon>
        </template>
      </n-button>
    </div>
    <div>
      <n-button v-if="filterFormVisible1" secondary circle @click="gChangeFilterFormVisible">
        <NIcon>
          <MdSearch/>
        </NIcon>
      </n-button>
    </div>
  </div>

  <div class="zs-table-data">
    <!--数据表格-->
    <n-data-table
        :loading="tableLoadingRef"
        :columns="columns"
        :data="tableData"
    />

    <!--分页-->
    <Pagination2
        v-if="config.pageQuery"
        :total="total"
        :page-num="pageParam.pageNum"
        :page-size="pageParam.pageSize"
        @page-change="pageChange"
    />
  </div>
</template>

<style scoped>

</style>