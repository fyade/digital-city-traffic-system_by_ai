<script lang="ts">
export default {
  name: 'dcts:signalLightStrategy:signalLightStrategyType'
}
</script>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { CONFIG, final, sLSSTTypeDict, SLSSTTypeEnum, sLSTTTypeDict, SLSTTTypeEnum } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import { signalLightStrategyTypeDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyType.ts";
import StrategyScheduleOfStrategyType from "@/views/module/dcts/signalLightStrategy/signalLightStrategyType/strategyScheduleOfStrategyType.vue";
import { timeUtils } from "@dcts/common";

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
const dFormRules: FormRules<SignalLightStrategyTypeDto> = {
  name: [{required: true, trigger: 'change'}],
  description: [{required: true, trigger: 'change'}],
  strategyType: [{required: true, trigger: 'change'}],
  scheduleType: [{required: true, trigger: 'change'}],
  startTime: [{required: true, trigger: 'change'}],
  endTime: [{required: true, trigger: 'change'}],
  ifDisabled: [{required: true, trigger: 'change'}],
  orderNum: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<SignalLightStrategyTypeDto>({
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
} = funcTablePage<SignalLightStrategyTypeDto, SignalLightStrategyTypeUpdDto>({
  state,
  dFormRules,
  config,
  api: signalLightStrategyTypeApi,
  dict: signalLightStrategyTypeDict,
})

const visible = ref(false)
const selectStrategyType = ref<SignalLightStrategyTypeDto>(new SignalLightStrategyTypeDto())
const manageSonData = (row: SignalLightStrategyTypeDto) => {
  selectStrategyType.value = row
  visible.value = true
}
</script>

<template>
  <el-dialog
      :width="CONFIG.dialog_width_wider"
      v-model="visible"
      title="策略调度管理"
      draggable
      append-to-body
      destroy-on-close
  >
    <StrategyScheduleOfStrategyType
        :strategy-type="selectStrategyType"
    />
  </el-dialog>

  <!--弹窗-->
  <el-dialog
      :width="activeTabName===final.more ? CONFIG.dialog_width_wider : CONFIG.dialog_width"
      v-model="dialogVisible"
      :title="dialogType.label"
      draggable
      append-to-body
  >
    <el-tabs v-if="config.bulkOperation" v-model="activeTabName">
      <el-tab-pane :disabled="dialogType.value===final.upd" label="操作单个" :name="final.one"></el-tab-pane>
      <el-tab-pane :disabled="dialogType.value===final.upd" label="操作多个" :name="final.more"></el-tab-pane>
    </el-tabs>
    <template v-if="activeTabName===final.one">
      <el-form
          ref="dialogFormRef"
          v-loading="dialogLoadingRef"
          :model="state.dialogForm"
          :label-width="CONFIG.dialog_form_label_width"
          :rules="dFormRules"
      >
        <!--<el-row>-->
        <!--  <el-col :span="12"></el-col>-->
        <!--  <el-col :span="12"></el-col>-->
        <!--</el-row>-->
        <el-form-item v-if="dialogType.value!==final.ins" :label="signalLightStrategyTypeDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.name" prop="name">
              <el-input v-model="state.dialogForm.name" :placeholder="signalLightStrategyTypeDict.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.description" prop="description">
              <el-input v-model="state.dialogForm.description" :placeholder="signalLightStrategyTypeDict.description"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.strategyType" prop="strategyType">
              <!--<el-input v-model="state.dialogForm.strategyType" :placeholder="signalLightStrategyTypeDict.strategyType"/>-->
              <el-radio-group v-model="state.dialogForm.strategyType">
                <el-radio :value="SLSTTTypeEnum.T_CUSTOM">{{ sLSTTTypeDict[SLSTTTypeEnum.T_CUSTOM] }}</el-radio>
                <el-radio :value="SLSTTTypeEnum.T_FINE_TUNING">{{ sLSTTTypeDict[SLSTTTypeEnum.T_FINE_TUNING] }}</el-radio>
                <el-radio :value="SLSTTTypeEnum.T_TOP">{{ sLSTTTypeDict[SLSTTTypeEnum.T_TOP] }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.scheduleType" prop="scheduleType">
              <!--<el-input v-model="state.dialogForm.scheduleType" :placeholder="signalLightStrategyTypeDict.scheduleType"/>-->
              <el-radio-group v-model="state.dialogForm.scheduleType">
                <el-radio :value="SLSSTTypeEnum.T_DAY">{{ sLSSTTypeDict[SLSSTTypeEnum.T_DAY] }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.startTime" prop="startTime">
              <!--<el-input v-model="state.dialogForm.startTime" :placeholder="signalLightStrategyTypeDict.startTime"/>-->
              <el-date-picker v-model="state.dialogForm.startTime" type="datetime"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.endTime" prop="endTime">
              <!--<el-input v-model="state.dialogForm.endTime" :placeholder="signalLightStrategyTypeDict.endTime"/>-->
              <el-date-picker v-model="state.dialogForm.endTime" type="datetime"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.ifDisabled" prop="ifDisabled">
              <el-radio-group v-model="state.dialogForm.ifDisabled">
                <el-radio :value="final.Y">是</el-radio>
                <el-radio :value="final.N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyTypeDict.orderNum" prop="orderNum">
              <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="signalLightStrategyTypeDict.remark" prop="remark">
              <el-input type="textarea" v-model="state.dialogForm.remark" :placeholder="signalLightStrategyTypeDict.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="signalLightStrategyTypeDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStrategyTypeDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStrategyTypeDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStrategyTypeDict.ifDisabled" prop="ifDisabled">-->
        <!--  <el-switch v-model="state.dialogForm.ifDisabled" :active-value="final.N" :inactive-value="final.Y"/>-->
        <!--</el-form-item>-->
        <!--上方几个酌情使用-->
      </el-form>
    </template>
    <template v-if="activeTabName===final.more">
      <el-form
          ref="dialogFormsRef"
          v-loading="dialogLoadingRef"
      >
        <el-table
            :data="state.dialogForms"
            v-if="state.dialogForms"
        >
          <el-table-column type="index" width="50">
            <template #header>
              #
            </template>
          </el-table-column>
          <!--在此下方添加表格列-->
          <el-table-column prop="name" :label="signalLightStrategyTypeDict.name" width="300">
            <template #header>
              <span :class="ifRequired('name')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.name }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-name`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].name" :placeholder="signalLightStrategyTypeDict.name"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="description" :label="signalLightStrategyTypeDict.description" width="300">
            <template #header>
              <span :class="ifRequired('description')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.description }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-description`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].description" :placeholder="signalLightStrategyTypeDict.description"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="strategyType" :label="signalLightStrategyTypeDict.strategyType" width="300">
            <template #header>
              <span :class="ifRequired('strategyType')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.strategyType }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-strategyType`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <!--<el-input v-model="state.dialogForms[$index].strategyType" :placeholder="signalLightStrategyTypeDict.strategyType"/>-->
                <el-radio-group v-model="state.dialogForms[$index].strategyType">
                  <el-radio :value="SLSTTTypeEnum.T_CUSTOM">{{ sLSTTTypeDict[SLSTTTypeEnum.T_CUSTOM] }}</el-radio>
                  <el-radio :value="SLSTTTypeEnum.T_FINE_TUNING">{{ sLSTTTypeDict[SLSTTTypeEnum.T_FINE_TUNING] }}</el-radio>
                  <el-radio :value="SLSTTTypeEnum.T_TOP">{{ sLSTTTypeDict[SLSTTTypeEnum.T_TOP] }}</el-radio>
                </el-radio-group>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="scheduleType" :label="signalLightStrategyTypeDict.scheduleType" width="300">
            <template #header>
              <span :class="ifRequired('scheduleType')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.scheduleType }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-scheduleType`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <!--<el-input v-model="state.dialogForms[$index].scheduleType" :placeholder="signalLightStrategyTypeDict.scheduleType"/>-->
                <el-radio-group v-model="state.dialogForms[$index].scheduleType">
                  <el-radio :value="SLSSTTypeEnum.T_DAY">{{ sLSSTTypeDict[SLSSTTypeEnum.T_DAY] }}</el-radio>
                </el-radio-group>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" :label="signalLightStrategyTypeDict.startTime" width="300">
            <template #header>
              <span :class="ifRequired('startTime')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.startTime }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-startTime`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <!--<el-input v-model="state.dialogForms[$index].startTime" :placeholder="signalLightStrategyTypeDict.startTime"/>-->
                <el-date-picker v-model="state.dialogForms[$index].startTime" type="datetime"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" :label="signalLightStrategyTypeDict.endTime" width="300">
            <template #header>
              <span :class="ifRequired('endTime')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.endTime }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-endTime`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <!--<el-input v-model="state.dialogForms[$index].endTime" :placeholder="signalLightStrategyTypeDict.endTime"/>-->
                <el-date-picker v-model="state.dialogForms[$index].endTime" type="datetime"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ifDisabled" :label="signalLightStrategyTypeDict.ifDisabled" width="70">
            <template #header>
              <span :class="ifRequired('ifDisabled')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.ifDisabled }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-ifDisabled`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-checkbox v-model="state.dialogForms[$index].ifDisabled" :true-value="final.Y" :false-value="final.N"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" :label="signalLightStrategyTypeDict.orderNum" width="300">
            <template #header>
              <span :class="ifRequired('orderNum')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.orderNum }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-orderNum`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input-number v-model="state.dialogForms[$index].orderNum" controls-position="right"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="signalLightStrategyTypeDict.remark" width="300">
            <template #header>
              <span :class="ifRequired('remark')?'tp-table-header-required':''">{{ signalLightStrategyTypeDict.remark }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-remark`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input type="textarea" v-model="state.dialogForms[$index].remark" :placeholder="signalLightStrategyTypeDict.remark"/>
              </div>
            </template>
          </el-table-column>
          <!--在此上方添加表格列-->
          <el-table-column fixed="right" label="操作" min-width="120">
            <template v-if="dialogType.value===final.ins" #default="{$index}">
              <el-button link type="danger" size="small" :icon="Delete" @click="dfDel($index)">删除</el-button>
            </template>
          </el-table-column>
          <template v-if="dialogType.value===final.ins" #append>
            <el-button text type="primary" plain :icon="Plus" @click="dfIns">新增</el-button>
          </template>
        </el-table>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="dialogButtonLoadingRef" @click="dCan">取消</el-button>
        <el-button type="primary" :disabled="dialogButtonLoadingRef" @click="dCon">确认</el-button>
      </span>
    </template>
  </el-dialog>

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
      <el-form-item :label="signalLightStrategyTypeDict.name" prop="name">
        <el-input v-model="state.filterForm.name" :placeholder="signalLightStrategyTypeDict.name"/>
      </el-form-item>
      <el-form-item :label="signalLightStrategyTypeDict.description" prop="description">
        <el-input v-model="state.filterForm.description" :placeholder="signalLightStrategyTypeDict.description"/>
      </el-form-item>
      <el-form-item :label="signalLightStrategyTypeDict.strategyType" prop="strategyType">
        <!--<el-input v-model="state.filterForm.strategyType" :placeholder="signalLightStrategyTypeDict.strategyType"/>-->
        <el-select v-model="state.filterForm.strategyType" :placeholder="signalLightStrategyTypeDict.strategyType" clearable filterable>
          <el-option :label="sLSTTTypeDict[SLSTTTypeEnum.T_CUSTOM]" :value="SLSTTTypeEnum.T_CUSTOM"/>
          <el-option :label="sLSTTTypeDict[SLSTTTypeEnum.T_FINE_TUNING]" :value="SLSTTTypeEnum.T_FINE_TUNING"/>
          <el-option :label="sLSTTTypeDict[SLSTTTypeEnum.T_TOP]" :value="SLSTTTypeEnum.T_TOP"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="signalLightStrategyTypeDict.scheduleType" prop="scheduleType">
        <!--<el-input v-model="state.filterForm.scheduleType" :placeholder="signalLightStrategyTypeDict.scheduleType"/>-->
        <el-select  v-model="state.filterForm.scheduleType" :placeholder="signalLightStrategyTypeDict.scheduleType" clearable filterable>
          <el-option :label="sLSSTTypeDict[SLSSTTypeEnum.T_DAY]" :value="SLSSTTypeEnum.T_DAY"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="signalLightStrategyTypeDict.ifDisabled" prop="ifDisabled">
        <!--<el-input v-model="state.filterForm.ifDisabled" :placeholder="signalLightStrategyTypeDict.ifDisabled"/>-->
        <el-select v-model="state.filterForm.ifDisabled" :placeholder="signalLightStrategyTypeDict.ifDisabled" clearable filterable>
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
      <el-button type="primary" plain :icon="Plus" @click="gIns">新增</el-button>
      <el-button type="success" plain :icon="Edit" :disabled="config.bulkOperation?multipleSelection.length===0:multipleSelection.length!==1" @click="gUpd">修改</el-button>
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length===0" @click="gDel()">删除</el-button>
      <el-button type="warning" plain :icon="Download" :disabled="multipleSelection.length===0" @click="gExport()">导出</el-button>
      <el-button type="warning" plain :icon="Upload" @click="gImport">上传</el-button>
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
      <!--<el-table-column fixed prop="id" :label="signalLightStrategyTypeDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="name" :label="signalLightStrategyTypeDict.name" width="180"/>
      <el-table-column prop="description" :label="signalLightStrategyTypeDict.description" width="240"/>
      <el-table-column prop="strategyType" :label="signalLightStrategyTypeDict.strategyType" width="120">
        <template #default="{row}">
          {{ sLSTTTypeDict[row.strategyType as SLSTTTypeEnum] }}
        </template>
      </el-table-column>
      <el-table-column prop="scheduleType" :label="signalLightStrategyTypeDict.scheduleType" width="120">
        <template #default="{row}">
          {{ sLSSTTypeDict[row.scheduleType as SLSSTTypeEnum] }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="signalLightStrategyTypeDict.startTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.startTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="signalLightStrategyTypeDict.endTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.endTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="ifDisabled" :label="signalLightStrategyTypeDict.ifDisabled" width="120">
        <template #default="{row}">
          <el-tag v-if="row.ifDisabled===final.Y" type="info">是</el-tag>
          <el-tag v-else type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" :label="signalLightStrategyTypeDict.orderNum" width="120"/>
      <el-table-column prop="remark" :label="signalLightStrategyTypeDict.remark" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="signalLightStrategyTypeDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="signalLightStrategyTypeDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="signalLightStrategyTypeDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="signalLightStrategyTypeDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="signalLightStrategyTypeDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="signalLightStrategyTypeDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="signalLightStrategyTypeDict.deleted" width="60"/>-->
      <!--上方几个酌情使用-->
      <el-table-column fixed="right" label="操作" min-width="140">
        <template #default="{row}">
          <div class="zs-table-data-operate-button-row">
            <el-button link type="primary" size="small" :icon="Edit" @click="manageSonData(row)">策略调度管理</el-button>
            <el-button link type="primary" size="small" :icon="Edit" @click="tUpd(row.id)">修改</el-button>
            <el-button link type="danger" size="small" :icon="Delete" @click="tDel(row.id)">删除</el-button>
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
