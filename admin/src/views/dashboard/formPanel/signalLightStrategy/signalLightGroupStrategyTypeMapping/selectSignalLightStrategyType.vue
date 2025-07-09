<script setup lang="ts">
import { h, reactive } from "vue";
import Pagination2 from "@/components/pagination/pagination2.vue";
import { funcTablePageDashBoard } from "@/composition/tablePage/tablePageDashBoard2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { DataTableColumns, NButton, NIcon } from "naive-ui";
import { HandPointLeft } from '@vicons/fa'
import { MdRefresh, MdSearch } from '@vicons/ionicons4'
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyType.ts";

const emits = defineEmits(['selectRow']);

const state = reactive<State2<SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto>>({
  dialogForm: {
    id: -1,
    name: '',
    description: '',
    strategyType: '',
  },
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {
    name: '',
  },
})
const config = new TablePageConfig()
const columns: DataTableColumns<SignalLightStrategyTypeDto> = [
  {title: signalLightStrategyTypeDict.name, key: 'name'},
  {title: signalLightStrategyTypeDict.description, key: 'description'},
  {title: signalLightStrategyTypeDict.strategyType, key: 'strategyType'},
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
} = funcTablePageDashBoard<SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto>({
  state,
  dFormRules: {},
  config,
  api: signalLightStrategyTypeApi,
  dict: signalLightStrategyTypeDict
});
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