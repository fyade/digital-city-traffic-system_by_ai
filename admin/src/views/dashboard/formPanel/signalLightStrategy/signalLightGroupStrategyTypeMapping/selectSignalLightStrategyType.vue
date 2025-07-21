<script setup lang="ts">
import { h, reactive, ref } from "vue";
import Pagination2 from "@/components/pagination/pagination2.vue";
import { funcTablePageDashBoard } from "@/composition/tablePage/tablePageDashBoard2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { DataTableColumns, NButton, NIcon } from "naive-ui";
import { HandPointLeft } from '@vicons/fa'
import { MdRefresh, MdSearch } from '@vicons/ionicons4'
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { final, sLSSTTypeDict, SLSSTTypeEnum, sLSTTTypeDict, SLSTTTypeEnum } from "@/utils/base.ts";
import { signalLightGroupStrategyTypeMappingApi } from "@/api/module/dcts/signalLightStrategy/signalLightGroupStrategyTypeMapping.ts";
import { SignalLightGroupStrategyTypeMappingDto, SignalLightGroupStrategyTypeMappingInsDto } from "@/type/module/dcts/signalLightStrategy/signalLightGroupStrategyTypeMapping.ts";
import { nOptionIfDisabled, nOptionSLSST, nOptionSLSTT } from "@/utils/naiveBase.ts";
import { timeUtils } from "@dcts/common";

const emits = defineEmits(['selectRow']);
const props = defineProps({
  groupId: {
    type: Number,
    required: true,
  }
})

const state = reactive<State2<SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto>>({
  dialogForm: {
    id: -1,
    name: '',
    description: '',
    strategyType: '',
    scheduleType: '',
    startTime: '',
    endTime: '',
    ifDisabled: final.N,
    orderNum: final.DEFAULT_ORDER_NUM,
    remark: '',
  },
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {
    name: '',
    description: '',
    strategyType: '',
    scheduleType: '',
    ifDisabled: '',
  },
})
const config = new TablePageConfig<SignalLightStrategyTypeDto>({
  selectListCallback: () => {
    getMappingData()
  }
})
const columns: DataTableColumns<SignalLightStrategyTypeDto> = [
  {title: signalLightStrategyTypeDict.name, key: 'name'},
  {title: signalLightStrategyTypeDict.description, key: 'description'},
  {
    title: signalLightStrategyTypeDict.strategyType,
    key: 'strategyType',
    render(row) {
      return sLSTTTypeDict[row.strategyType as SLSTTTypeEnum]
    }
  },
  {
    title: signalLightStrategyTypeDict.scheduleType,
    key: 'scheduleType',
    render(row) {
      return sLSSTTypeDict[row.scheduleType as SLSSTTypeEnum]
    }
  },
  {
    title: signalLightStrategyTypeDict.startTime,
    key: 'startTime',
    render(row) {
      return timeUtils.formatDate(new Date(row.startTime))
    }
  },
  {
    title: signalLightStrategyTypeDict.endTime,
    key: 'endTime',
    render(row) {
      return timeUtils.formatDate(new Date(row.endTime))
    }
  },
  {title: signalLightStrategyTypeDict.ifDisabled, key: 'ifDisabled'},
  {title: signalLightStrategyTypeDict.orderNum, key: 'orderNum'},
  {title: signalLightStrategyTypeDict.remark, key: 'remark'},
  // {
  //   title: '操作',
  //   key: 'operation',
  //   render(row) {
  //     return h(NButton, {
  //       text: true,
  //       onClick: () => emits('selectRow', row)
  //     }, {
  //       default: () => '选择',
  //       icon: () => h(NIcon, null, {default: () => h(HandPointLeft)})
  //     })
  //   }
  // }
  {
    title: '操作',
    key: 'operation',
    render(row) {
      return h(NButton, {
        text: true,
        type: tableLoading2.value ? 'default' : !groupTypeMappingSTId.value.includes(row.id) ? 'primary' : 'error',
        loading: tableLoading2.value,
        onClick: () => selectRow2(!groupTypeMappingSTId.value.includes(row.id), row)
      }, {
        default: () => tableLoading2.value ? '加载中' : !groupTypeMappingSTId.value.includes(row.id) ? '绑定' : '解绑',
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
} = funcTablePageDashBoard<SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto>({
  state,
  dFormRules: {},
  config,
  api: signalLightStrategyTypeApi,
  dict: signalLightStrategyTypeDict
});

const tableLoading2 = ref(false)
const groupTypeMapping = ref<SignalLightGroupStrategyTypeMappingDto[]>([])
const groupTypeMappingSTId = ref<number[]>([])
const getMappingData = () => {
  tableLoading2.value = true
  groupTypeMapping.value = []
  groupTypeMappingSTId.value = []
  signalLightGroupStrategyTypeMappingApi.selectAll({
    groupId: props.groupId,
    strategyTypeId: {in: {value: tableData.value.map(item => item.id)}}
  }).then(res => {
    groupTypeMapping.value = res
    groupTypeMappingSTId.value = res.map(item => item.strategyTypeId)
  }).finally(() => {
    tableLoading2.value = false
  })
}

const selectRow2 = (ifBd: boolean, row: SignalLightStrategyTypeDto) => {
  if (ifBd) {
    tableLoading2.value = true
    const dto = new SignalLightGroupStrategyTypeMappingInsDto();
    dto.groupId = props.groupId
    dto.strategyTypeId = row.id
    signalLightGroupStrategyTypeMappingApi.insertOne(dto).then(res => {
      getMappingData()
    }).catch(() => {
      tableLoading2.value = false
    })
  } else {
    const find = groupTypeMapping.value.find(item => item.groupId === props.groupId && item.strategyTypeId === row.id);
    if (!find) {
      return
    }
    tableLoading2.value = true
    signalLightGroupStrategyTypeMappingApi.deleteList(find.id).then(res => {
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
      <n-form-item :label="signalLightStrategyTypeDict.name" path="name">
        <n-input v-model:value="state.filterForm.name" :placeholder="signalLightStrategyTypeDict.name"/>
      </n-form-item>
      <n-form-item :label="signalLightStrategyTypeDict.description" path="description">
        <n-input v-model:value="state.filterForm.description" :placeholder="signalLightStrategyTypeDict.description"/>
      </n-form-item>
      <n-form-item :label="signalLightStrategyTypeDict.strategyType" path="strategyType">
        <!--<n-input v-model:value="state.filterForm.strategyType" :placeholder="signalLightStrategyTypeDict.strategyType"/>-->
        <n-select v-model:value="state.filterForm.strategyType" :placeholder="signalLightStrategyTypeDict.strategyType" clearable filterable :options="nOptionSLSTT"/>
      </n-form-item>
      <n-form-item :label="signalLightStrategyTypeDict.scheduleType" path="scheduleType">
        <!--<n-input v-model:value="state.filterForm.scheduleType" :placeholder="signalLightStrategyTypeDict.scheduleType"/>-->
        <n-select v-model:value="state.filterForm.scheduleType" :placeholder="signalLightStrategyTypeDict.scheduleType" clearable filterable :options="nOptionSLSST"/>
      </n-form-item>
      <n-form-item :label="signalLightStrategyTypeDict.ifDisabled" path="ifDisabled">
        <!--<n-input v-model:value="state.filterForm.ifDisabled" :placeholder="signalLightStrategyTypeDict.ifDisabled"/>-->
        <n-select v-model:value="state.filterForm.ifDisabled" :placeholder="signalLightStrategyTypeDict.ifDisabled" clearable filterable :options="nOptionIfDisabled"/>
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