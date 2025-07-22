<script setup lang="ts">
import { h, PropType, reactive, ref } from "vue";
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
import { SignalLightChildStrategyScheduleMappingDto, SignalLightChildStrategyScheduleMappingInsDto } from "@/type/module/dcts/signalLightStrategy/signalLightChildStrategyScheduleMapping.ts";
import { signalLightChildStrategyScheduleMappingApi } from "@/api/module/dcts/signalLightStrategy/signalLightChildStrategyScheduleMapping.ts";
import { nOptionIfDisabled } from "@/utils/naiveBase.ts";

const props = defineProps({
  selectStrategyTypeId: {
    type: Array as PropType<number[]>,
    required: true
  },
  childId: {
    type: Number,
    required: true
  }
})

const state = reactive<State2<SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto>>({
  dialogForm: {
    id: -1,
    name: '',
    description: '',
    ifDisabled: final.N,
    orderNum: final.DEFAULT_ORDER_NUM,
    remark: '',
  },
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {
    name: '',
    description: '',
    ifDisabled: '',
  },
})
const config = new TablePageConfig<SignalLightStrategyScheduleDto>({
  getDataOnMounted: false,
  selectParam: {
    id: {in: {value: []}}
  },
  selectListCallback: () => {
    getMappingData()
  }
})
const columns: DataTableColumns<SignalLightStrategyScheduleDto> = [
  {title: signalLightStrategyScheduleDict.name, key: 'name'},
  {title: signalLightStrategyScheduleDict.description, key: 'description'},
  {title: signalLightStrategyScheduleDict.ifDisabled, key: 'ifDisabled'},
  {title: signalLightStrategyScheduleDict.orderNum, key: 'orderNum'},
  {title: signalLightStrategyScheduleDict.remark, key: 'remark'},
  {
    title: '操作',
    key: 'operation',
    render(row) {
      return h(NButton, {
        text: true,
        type: tableLoading2.value ? 'default' : !childScheduleMappingSSId.value.includes(row.id) ? 'primary' : 'error',
        loading: tableLoading2.value,
        onClick: () => selectRow2(!childScheduleMappingSSId.value.includes(row.id), row)
      }, {
        default: () => tableLoading2.value ? '加载中' : !childScheduleMappingSSId.value.includes(row.id) ? '绑定' : '解绑',
        icon: () => h(NIcon, null, {default: () => h(HandPointLeft)})
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
    strategyTypeId: {in: {value: props.selectStrategyTypeId}}
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
  tableData: tableDataSlstscm
} = funcTablePageDashBoard<SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingUpdDto>({
  state: stateSlstscm,
  dFormRules: {},
  config: configSlstscm,
  api: signalLightStrategyTypeStrategyScheduleMappingApi,
  dict: signalLightStrategyTypeStrategyScheduleMappingDict,
})

const tableLoading2 = ref(false)
const childScheduleMapping = ref<SignalLightChildStrategyScheduleMappingDto[]>([])
const childScheduleMappingSSId = ref<number[]>([])
const getMappingData = () => {
  tableLoading2.value = true
  childScheduleMapping.value = []
  childScheduleMappingSSId.value = []
  signalLightChildStrategyScheduleMappingApi.selectAll({
    childLightId: props.childId,
    strategyScheduleId: {in: {value: tableData.value.map(item => item.id)}}
  }).then((res) => {
    childScheduleMapping.value = res
    childScheduleMappingSSId.value = res.map(item => item.strategyScheduleId)
  }).finally(() => {
    tableLoading2.value = false
  })
}

const selectRow2 = (ifBd: boolean, row: SignalLightStrategyScheduleDto) => {
  if (ifBd) {
    tableLoading2.value = true
    const dto = new SignalLightChildStrategyScheduleMappingInsDto()
    dto.childLightId = props.childId
    dto.strategyScheduleId = row.id
    signalLightChildStrategyScheduleMappingApi.insertOne(dto).then(res => {
      getMappingData()
    }).catch(() => {
      tableLoading2.value = false
    })
  } else {
    const find = childScheduleMapping.value.find(item => item.childLightId === props.childId && item.strategyScheduleId === row.id)
    if (!find) {
      return
    }
    tableLoading2.value = true
    signalLightChildStrategyScheduleMappingApi.deleteList(find.id).then(res => {
      getMappingData()
    }).catch(() => {
      tableLoading2.value = false
    })
  }
}
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
      <n-form-item :label="signalLightStrategyScheduleDict.ifDisabled" path="ifDisabled">
        <!--<n-input v-model:value="state.filterForm.ifDisabled" :placeholder="signalLightStrategyScheduleDict.ifDisabled"/>-->
        <n-select v-model:value="state.filterForm.ifDisabled" :placeholder="signalLightStrategyScheduleDict.ifDisabled" clearable filterable :options="nOptionIfDisabled"/>
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