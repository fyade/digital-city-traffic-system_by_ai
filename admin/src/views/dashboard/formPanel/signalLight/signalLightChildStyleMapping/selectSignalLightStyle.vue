<script setup lang="ts">
import { h, reactive, ref } from "vue";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { SignalLightStyleDto, SignalLightStyleUpdDto } from "@/type/module/dcts/signalLight/signalLightStyle.ts";
import { DataTableColumns, NButton, NIcon } from "naive-ui";
import { funcTablePageDashBoard } from "@/composition/tablePage/tablePageDashBoard2.ts";
import { signalLightStyleApi } from "@/api/module/dcts/signalLight/signalLightStyle.ts";
import { signalLightStyleDict } from "@/dict/module/dcts/signalLight/signalLightStyle.ts";
import { SignalLightChildStyleMappingDto, SignalLightChildStyleMappingInsDto } from "@/type/module/dcts/signalLight/signalLightChildStyleMapping.ts";
import { signalLightChildStyleMappingApi, signalLightChildStyleMappingInsV2 } from "@/api/module/dcts/signalLight/signalLightChildStyleMapping.ts";
import { MdRefresh, MdSearch } from "@vicons/ionicons4";
import Pagination2 from "@/components/pagination/pagination2.vue";
import { HandPointLeft } from "@vicons/fa";
import { base } from "@dcts/common";

const props = defineProps({
  childId: {
    type: Number,
    required: true
  }
});
const emits = defineEmits(['selectRow']);

const state = reactive<State2<SignalLightStyleDto, SignalLightStyleUpdDto>>({
  dialogForm: {
    id: -1,
    name: '',
    style: '',
  },
  dialogForms: [],
  filterForm: {
    name: '',
  },
})
const config = new TablePageConfig<SignalLightStyleDto>({
  selectListCallback: () => {
    getMappingData()
  }
})
const columns: DataTableColumns<SignalLightStyleDto> = [
  {title: signalLightStyleDict.name, key: 'name'},
  {
    title: signalLightStyleDict.style,
    key: 'style',
    render(row) {
      return row.style.split('-').filter(_ => _).map(str => base.signalLightUnitStyleDict[str as base.SignalLightUnitStyleEnum]).join('-')
    }
  },
  {
    title: '操作',
    key: 'operation',
    render(row) {
      return h(NButton, {
        text: true,
        type: tableLoading2.value ? 'default' : !childStyleMappingSId.value.includes(row.id) ? 'primary' : 'error',
        loading: tableLoading2.value,
        onClick: () => selectRow2(!childStyleMappingSId.value.includes(row.id), row)
      }, {
        default: () => tableLoading2.value ? '加载中' : !childStyleMappingSId.value.includes(row.id) ? '绑定' : '解绑',
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
} = funcTablePageDashBoard<SignalLightStyleDto, SignalLightStyleUpdDto>({
  state,
  dFormRules: {},
  config,
  api: signalLightStyleApi,
  dict: signalLightStyleDict,
})

const tableLoading2 = ref(false)
const childStyleMapping = ref<SignalLightChildStyleMappingDto[]>([])
const childStyleMappingSId = ref<number[]>([])
const getMappingData = () => {
  tableLoading2.value = true
  childStyleMapping.value = []
  childStyleMappingSId.value = []
  signalLightChildStyleMappingApi.selectAll({
    childId: props.childId,
    styleId: {in: {value: tableData.value.map(item => item.id)}}
  }).then(res => {
    childStyleMapping.value = res
    childStyleMappingSId.value = res.map(item => item.styleId)
  }).finally(() => {
    tableLoading2.value = false
  })
}

const selectRow2 = (ifBd: boolean, row: SignalLightStyleDto) => {
  if (ifBd) {
    tableLoading2.value = true
    const dto = new SignalLightChildStyleMappingInsDto();
    dto.childId = props.childId
    dto.styleId = row.id
    signalLightChildStyleMappingInsV2(dto).then(res => {
      getMappingData()
    }).catch(() => {
      tableLoading2.value = false
    })
  } else {
    const find = childStyleMapping.value.find(item => item.childId === props.childId && item.styleId === row.id)
    if (!find) {
      return
    }
    tableLoading2.value = true
    signalLightChildStyleMappingApi.deleteList(find.id).then(res => {
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
      <n-form-item :label="signalLightStyleDict.name" path="name">
        <n-input v-model:value="state.filterForm.name" :placeholder="signalLightStyleDict.name"/>
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