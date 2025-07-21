<script setup lang="ts">
import { PropType, reactive, ref } from "vue";
import {
  CONFIG,
  final,
  signalLightColorDict,
  SignalLightColorEnum,
  sLSPLTTypeDict,
  SLSPLTTypeEnum
} from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { ElMessageBox, FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { SignalLightStrategyParamDto, SignalLightStrategyParamUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";
import { signalLightStrategyParamApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";
import { signalLightStrategyParamDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";
import { SignalLightStrategyScheduleDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { SignalLightStrategyScheduleStrategyParamMappingDto, SignalLightStrategyScheduleStrategyParamMappingInsDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyScheduleStrategyParamMapping.ts";
import { signalLightStrategyScheduleStrategyParamMappingApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyScheduleStrategyParamMapping.ts";
import AllStrategyParams from "@/views/module/dcts/signalLightStrategy/signalLightStrategySchedule/allStrategyParams.vue";
import { signalLightStrategyScheduleDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";

const props = defineProps({
  strategySchedule: {
    type: Object as PropType<SignalLightStrategyScheduleDto>,
    required: true,
  }
})

const state = reactive<State2<SignalLightStrategyParamDto, SignalLightStrategyParamUpdDto>>({
  dialogForm: {
    id: -1,
    lightType: '',
    round: 0,
    duration: 0,
    currentLight: '',
    ifDisabled: final.N,
    orderNum: final.DEFAULT_ORDER_NUM,
    remark: '',
  },
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {
    lightType: '',
    currentLight: '',
    ifDisabled: '',
  },
})
const dFormRules: FormRules = {
  lightType: [{required: true, trigger: 'change'}],
  round: [{required: true, trigger: 'change'}],
  duration: [{required: true, trigger: 'change'}],
  currentLight: [{required: true, trigger: 'change'}],
  ifDisabled: [{required: true, trigger: 'change'}],
  orderNum: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<SignalLightStrategyParamDto>({
  bulkOperation: true,
  getDataOnMounted: false,
  selectParam: {
    id: {in: {value: []}}
  }
})

const {
  dialogFormRef,
  dialogFormsRef,
  filterFormRef,
  filterFormVisible1,
  filterFormVisible,
  dialogVisible,
  dialogLoadingRef,
  dialogButtonLoadingRef,
  tableLoadingRef,
  switchLoadingRef,
  activeTabName,
  tableData,
  pageParam,
  total,
  multipleSelection,
  dialogType,
  refresh,
  dCan,
  dCon,
  fEnter,
  fCon,
  fCan,
  gRefresh,
  gIns,
  gUpd,
  gDel,
  gExport,
  gImport,
  gChangeFilterFormVisible,
  tUpd,
  tDel,
  handleSelectionChange,
  pageChange,
  dfIns,
  dfDel,
  ifRequired,
} = funcTablePage<SignalLightStrategyParamDto, SignalLightStrategyParamUpdDto>({
  state,
  dFormRules,
  config,
  api: signalLightStrategyParamApi,
  dict: signalLightStrategyParamDict,
})

const scheduleParamMapping = ref<SignalLightStrategyScheduleStrategyParamMappingDto[]>([])
const getMappingData = () => {
  scheduleParamMapping.value = []
  signalLightStrategyScheduleStrategyParamMappingApi.selectAll({strategyScheduleId: props.strategySchedule.id}).then(res => {
    if (config.selectParam.id && typeof config.selectParam.id === 'object' && config.selectParam.id.in) {
      config.selectParam.id.in.value = res.map(item => item.strategyParamId)
    }
    scheduleParamMapping.value = res
    refresh()
  })
}
getMappingData()

const visible2 = ref(false)
const loading2 = ref(false)
const add2 = () => {
  visible2.value = true
}
const add22 = (...strategyParamIds: number[]) => {
  const addedSpids = scheduleParamMapping.value.map(item => item.strategyParamId);
  const needAddIds = strategyParamIds.filter(spid => !addedSpids.includes(spid));
  if (needAddIds.length === 0) {
    visible2.value = false
    return
  }
  loading2.value = true
  const dtos = needAddIds.map(spid => {
    const dto = new SignalLightStrategyScheduleStrategyParamMappingInsDto()
    dto.strategyScheduleId = props.strategySchedule.id
    dto.strategyParamId = spid
    return dto
  })
  signalLightStrategyScheduleStrategyParamMappingApi.insertMore(dtos).then(res => {
    visible2.value = false
    getMappingData()
  }).finally(() => {
    loading2.value = false
  })
}
const del2 = () => {
  const spids = multipleSelection.value.map(item => item.id)
  const delids = scheduleParamMapping.value.filter(item => spids.includes(item.strategyParamId)).map(item => item.id)
  _del(...delids)
}
const del3 = (spid: number) => {
  const find = scheduleParamMapping.value.find(item => item.strategyScheduleId === props.strategySchedule.id && item.strategyParamId === spid)
  if (find) {
    _del(find.id)
  }
}
const _del = (...delids: number[]) => {
  ElMessageBox.confirm(
      `此操作将删除选中的 ${delids.length} 条数据，且无法撤销，请确认是否继续？`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true
      }
  ).then(() => {
    tableLoadingRef.value = true
    signalLightStrategyScheduleStrategyParamMappingApi.deleteList(...delids).then(() => {
      tableLoadingRef.value = false
      getMappingData()
    })
  })
}
</script>

<template>
  <el-dialog
      :width="CONFIG.dialog_width_wider"
      v-model="visible2"
      title="调度参数列表"
      draggable
      append-to-body
      destroy-on-close
  >
    <AllStrategyParams
        v-loading="loading2"
        @select-row="add22"
    />
  </el-dialog>

  <el-divider content-position="left">
    <el-text size="large" style="font-weight: bold;">策略参数管理</el-text>
  </el-divider>
  <el-form>
    <el-row>
      <el-col :span="8">
        <el-form-item :label="signalLightStrategyScheduleDict.name">
          {{ props.strategySchedule.name }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="signalLightStrategyScheduleDict.description">
          {{ props.strategySchedule.description }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-divider content-position="left">
    <el-text size="large" style="font-weight: bold;">策略参数数据列表</el-text>
  </el-divider>
  <!--顶部筛选表单-->
  <div class="zs-filter-form" v-show="filterFormVisible1 && filterFormVisible">
    <el-form
        class="demo-form-inline"
        ref="filterFormRef"
        :model="state.filterForm"
        :inline="true"
        @keyup.enter="fEnter"
    >
      <!--在此下方添加表单项-->
      <el-form-item :label="signalLightStrategyParamDict.lightType" prop="lightType">
        <!--<el-input v-model="state.filterForm.lightType" :placeholder="signalLightStrategyParamDict.lightType"/>-->
        <el-select v-model="state.filterForm.lightType" :placeholder="signalLightStrategyParamDict.lightType" clearable filterable>
          <el-option v-for="key in SLSPLTTypeEnum" :key="key" :label="sLSPLTTypeDict[key]" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="signalLightStrategyParamDict.currentLight" prop="currentLight">
        <!--<el-input v-model="state.filterForm.currentLight" :placeholder="signalLightStrategyParamDict.currentLight"/>-->
        <el-select v-model="state.filterForm.currentLight" :placeholder="signalLightStrategyParamDict.currentLight" clearable filterable>
          <el-option v-for="key in SignalLightColorEnum" :key="key" :label="signalLightColorDict[key]" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="signalLightStrategyParamDict.ifDisabled" prop="ifDisabled">
        <!--<el-input v-model="state.filterForm.ifDisabled" :placeholder="signalLightStrategyParamDict.ifDisabled"/>-->
        <el-select v-model="state.filterForm.ifDisabled" :placeholder="signalLightStrategyParamDict.ifDisabled" clearable filterable>
          <el-option label="是" :value="final.Y"/>
          <el-option label="否" :value="final.N"/>
        </el-select>
      </el-form-item>
      <!--在此上方添加表单项-->
      <el-form-item>
        <el-button type="primary" @click="fCon">筛选</el-button>
        <el-button @click="fCan">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!--操作按钮-->
  <div class="zs-button-row">
    <div>
      <el-button type="primary" plain :icon="Refresh" @click="gRefresh">刷新</el-button>
      <!--<el-button type="primary" plain :icon="Plus" @click="gIns">新增</el-button>-->
      <!--<el-button type="success" plain :icon="Edit" :disabled="config.bulkOperation?multipleSelection.length===0:multipleSelection.length!==1" @click="gUpd">修改</el-button>-->
      <!--<el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length===0" @click="gDel()">删除</el-button>-->
      <!--<el-button type="warning" plain :icon="Download" :disabled="multipleSelection.length===0" @click="gExport()">导出</el-button>-->
      <!--<el-button type="warning" plain :icon="Upload" @click="gImport">上传</el-button>-->
      <el-button type="success" plain :icon="Plus" @click="add2">添加策略调度</el-button>
      <el-button type="danger" plain :icon="Delete" @click="del2">删除策略调度</el-button>
    </div>
    <div>
      <el-button v-if="filterFormVisible1" plain :icon="Search" circle @click="gChangeFilterFormVisible"/>
    </div>
  </div>

  <div class="zs-table-data">
    <!--数据表格-->
    <el-table
        v-loading="tableLoadingRef"
        :data="tableData"
        @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" width="55"/>
      <!--<el-table-column fixed prop="id" :label="signalLightStrategyParamDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="lightType" :label="signalLightStrategyParamDict.lightType" width="180">
        <template #default="{row}">
          {{ row.lightType.split('-').filter(_ => _).map(key => sLSPLTTypeDict[key as SLSPLTTypeEnum]).join('、') }}
        </template>
      </el-table-column>
      <el-table-column prop="round" :label="signalLightStrategyParamDict.round" width="120"/>
      <el-table-column prop="duration" :label="signalLightStrategyParamDict.duration" width="120"/>
      <el-table-column prop="currentLight" :label="signalLightStrategyParamDict.currentLight" width="120">
        <template #default="{row}">
          {{ signalLightColorDict[row.currentLight as SignalLightColorEnum] }}
        </template>
      </el-table-column>
      <el-table-column prop="ifDisabled" :label="signalLightStrategyParamDict.ifDisabled" width="120">
        <template #default="{row}">
          <el-tag v-if="row.ifDisabled===final.Y" type="info">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="signalLightStrategyParamDict.orderNum" width="120"/>
      <el-table-column prop="remark" :label="signalLightStrategyParamDict.remark" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="signalLightStrategyParamDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="signalLightStrategyParamDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="signalLightStrategyParamDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="signalLightStrategyParamDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="signalLightStrategyParamDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="signalLightStrategyParamDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="signalLightStrategyParamDict.deleted" width="60"/>-->
      <!--上方几个酌情使用-->
      <el-table-column fixed="right" label="操作" min-width="140">
        <template #default="{row}">
          <div class="zs-table-data-operate-button-row">
            <!--<el-button link type="primary" size="small" :icon="Edit" @click="tUpd(row.id)">修改</el-button>-->
            <!--<el-button link type="danger" size="small" :icon="Delete" @click="tDel(row.id)">删除</el-button>-->
            <el-button link type="danger" size="small" :icon="Delete" @click="del3(row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
      <template #append>
        <div class="el-table-append-box">
          <span>此表格的多选<span class="underline">不支持</span>{{ `跨分页保存，当前已选 ${multipleSelection.length} 条数据。` }}</span>
        </div>
      </template>
    </el-table>

    <!--分页-->
    <Pagination
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
