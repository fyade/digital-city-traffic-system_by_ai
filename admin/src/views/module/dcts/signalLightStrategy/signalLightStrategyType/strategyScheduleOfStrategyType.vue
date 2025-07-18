<script setup lang="ts">
import { PropType, reactive, ref } from "vue";
import { CONFIG, final, sLSSTTypeDict, SLSSTTypeEnum } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { ElMessageBox, FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { signalLightStrategyScheduleApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { signalLightStrategyScheduleDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { timeUtils } from "@dcts/common";
import { SignalLightStrategyTypeDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeStrategyScheduleMappingApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyTypeStrategyScheduleMapping.ts";
import AllStrategySchedules from "@/views/module/dcts/signalLightStrategy/signalLightStrategyType/allStrategySchedules.vue";
import { SignalLightStrategyTypeStrategyScheduleMappingDto, SignalLightStrategyTypeStrategyScheduleMappingInsDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyTypeStrategyScheduleMapping.ts";

const props = defineProps({
  strategyType: {
    type: Object as PropType<SignalLightStrategyTypeDto>,
    required: true,
  }
})

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
    ifDisabled: '',
  },
})
const dFormRules: FormRules = {
  name: [{required: true, trigger: 'change'}],
  description: [{required: true, trigger: 'change'}],
  scheduleType: [{required: true, trigger: 'change'}],
  startTime: [{required: true, trigger: 'change'}],
  endTime: [{required: true, trigger: 'change'}],
  cronExpression: [{required: true, trigger: 'change'}],
  ifDisabled: [{required: true, trigger: 'change'}],
  orderNum: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<SignalLightStrategyScheduleDto>({
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
} = funcTablePage<SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto>({
  state,
  dFormRules,
  config,
  api: signalLightStrategyScheduleApi,
  dict: signalLightStrategyScheduleDict,
})

const typeScheduleMapping = ref<SignalLightStrategyTypeStrategyScheduleMappingDto[]>([])
const getMappingData = () => {
  typeScheduleMapping.value = []
  signalLightStrategyTypeStrategyScheduleMappingApi.selectAll({strategyTypeId: props.strategyType.id}).then(res => {
    if (config.selectParam.id && typeof config.selectParam.id === 'object' && config.selectParam.id.in) {
      config.selectParam.id.in.value = res.map(item => item.strategyScheduleId)
    }
    typeScheduleMapping.value = res
    refresh()
  })
}
getMappingData()

const visible2 = ref(false)
const loading2 = ref(false)
const add2 = () => {
  visible2.value = true
}
const add22 = (...strategyScheduleIds: number[]) => {
  const addedSsids = typeScheduleMapping.value.map(item => item.strategyScheduleId);
  const needAddIds = strategyScheduleIds.filter(ssid => !addedSsids.includes(ssid));
  if (needAddIds.length === 0) {
    visible2.value = false
    return
  }
  loading2.value = true
  const dtos = needAddIds.map(ssid => {
    const dto = new SignalLightStrategyTypeStrategyScheduleMappingInsDto();
    dto.strategyTypeId = props.strategyType.id
    dto.strategyScheduleId = ssid
    return dto
  });
  signalLightStrategyTypeStrategyScheduleMappingApi.insertMore(dtos).then(res => {
    visible2.value = false
    getMappingData()
  }).finally(() => {
    loading2.value = false
  })
}
const del2 = () => {
  const ssids = multipleSelection.value.map(item => item.id);
  const delids = typeScheduleMapping.value.filter(item => ssids.includes(item.strategyScheduleId)).map(item => item.id);
  _del(...delids)
}
const del3 = (ssid: number) => {
  const find = typeScheduleMapping.value.find(item => item.strategyTypeId === props.strategyType.id && item.strategyScheduleId === ssid);
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
    signalLightStrategyTypeStrategyScheduleMappingApi.deleteList(...delids).then(() => {
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
      title="调度策略列表"
      draggable
      append-to-body
      destroy-on-close
  >
    <AllStrategySchedules
        v-loading="loading2"
        @select-row="add22"
    />
  </el-dialog>

  <el-divider content-position="left">
    <el-text size="large" style="font-weight: bold;">策略调度管理</el-text>
  </el-divider>
  <el-form>
    <el-row>
      <el-col :span="8">
        <el-form-item :label="signalLightStrategyTypeDict.name">
          {{ props.strategyType.name }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="signalLightStrategyTypeDict.description">
          {{ props.strategyType.description }}
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="signalLightStrategyTypeDict.strategyType">
          {{ props.strategyType.strategyType }}
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <el-divider content-position="left">
    <el-text size="large" style="font-weight: bold;">策略调度数据列表</el-text>
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
      <el-form-item :label="signalLightStrategyScheduleDict.name" prop="name">
        <el-input v-model="state.filterForm.name" :placeholder="signalLightStrategyScheduleDict.name"/>
      </el-form-item>
      <el-form-item :label="signalLightStrategyScheduleDict.description" prop="description">
        <el-input v-model="state.filterForm.description" :placeholder="signalLightStrategyScheduleDict.description"/>
      </el-form-item>
      <el-form-item :label="signalLightStrategyScheduleDict.scheduleType" prop="scheduleType">
        <!--<el-input v-model="state.filterForm.scheduleType" :placeholder="signalLightStrategyScheduleDict.scheduleType"/>-->
        <el-select  v-model="state.filterForm.scheduleType" :placeholder="signalLightStrategyScheduleDict.scheduleType" clearable filterable>
          <el-option :label="sLSSTTypeDict[SLSSTTypeEnum.T_DAY]" :value="SLSSTTypeEnum.T_DAY"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="signalLightStrategyScheduleDict.ifDisabled" prop="ifDisabled">
        <!--<el-input v-model="state.filterForm.ifDisabled" :placeholder="signalLightStrategyScheduleDict.ifDisabled"/>-->
        <el-select v-model="state.filterForm.ifDisabled" :placeholder="signalLightStrategyScheduleDict.ifDisabled" clearable filterable>
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
      <!--<el-table-column fixed prop="id" :label="signalLightStrategyScheduleDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="name" :label="signalLightStrategyScheduleDict.name" width="180"/>
      <el-table-column prop="description" :label="signalLightStrategyScheduleDict.description" width="180"/>
      <el-table-column prop="scheduleType" :label="signalLightStrategyScheduleDict.scheduleType" width="180">
        <template #default="{row}">
          {{ sLSSTTypeDict[row.scheduleType as SLSSTTypeEnum] }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="signalLightStrategyScheduleDict.startTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.startTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="signalLightStrategyScheduleDict.endTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.endTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="cronExpression" :label="signalLightStrategyScheduleDict.cronExpression" width="180"/>
      <el-table-column prop="ifDisabled" :label="signalLightStrategyScheduleDict.ifDisabled" width="120">
        <template #default="{row}">
          <el-tag v-if="row.ifDisabled===final.Y" type="info">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="signalLightStrategyScheduleDict.orderNum" width="120"/>
      <el-table-column prop="remark" :label="signalLightStrategyScheduleDict.remark" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="signalLightStrategyScheduleDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="signalLightStrategyScheduleDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="signalLightStrategyScheduleDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="signalLightStrategyScheduleDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="signalLightStrategyScheduleDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="signalLightStrategyScheduleDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="signalLightStrategyScheduleDict.deleted" width="60"/>-->
      <!--上方几个酌情使用-->
      <el-table-column fixed="right" label="操作" min-width="140">
        <template #default="{row}">
          <div class="zs-table-data-operate-button-row">
      <!--      <el-button link type="primary" size="small" :icon="Edit" @click="tUpd(row.id)">修改</el-button>-->
      <!--      <el-button link type="danger" size="small" :icon="Delete" @click="tDel(row.id)">删除</el-button>-->
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
