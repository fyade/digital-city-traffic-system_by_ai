<script setup lang="ts">
import { reactive } from "vue";
import { CONFIG, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { SignalLightStrategyScheduleDto, SignalLightStrategyScheduleUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { signalLightStrategyScheduleApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { signalLightStrategyScheduleDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";

const emits = defineEmits(['selectRow'])

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
const dFormRules: FormRules = {
  name: [{required: true, trigger: 'change'}],
  description: [{required: true, trigger: 'change'}],
  ifDisabled: [{required: true, trigger: 'change'}],
  orderNum: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig({
  bulkOperation: true,
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

const selectRow = (rowId: number) => {
  emits('selectRow', rowId)
}
const selectRow2 = () => {
  emits('selectRow', ...multipleSelection.value.map(item => item.id))
}
</script>

<template>
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
      <el-button type="primary" plain :icon="Plus" @click="selectRow2">添加</el-button>
      <!--<el-button type="primary" plain :icon="Plus" @click="gIns">新增</el-button>-->
      <!--<el-button type="success" plain :icon="Edit" :disabled="config.bulkOperation?multipleSelection.length===0:multipleSelection.length!==1" @click="gUpd">修改</el-button>-->
      <!--<el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length===0" @click="gDel()">删除</el-button>-->
      <!--<el-button type="warning" plain :icon="Download" :disabled="multipleSelection.length===0" @click="gExport()">导出</el-button>-->
      <!--<el-button type="warning" plain :icon="Upload" @click="gImport">上传</el-button>-->
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
            <el-button link type="primary" size="small" :icon="Edit" @click="selectRow(row.id)">添加</el-button>
            <!--<el-button link type="primary" size="small" :icon="Edit" @click="tUpd(row.id)">修改</el-button>-->
            <!--<el-button link type="danger" size="small" :icon="Delete" @click="tDel(row.id)">删除</el-button>-->
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
