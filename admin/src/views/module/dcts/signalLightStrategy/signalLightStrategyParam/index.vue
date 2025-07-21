<script lang="ts">
export default {
  name: 'dcts:signalLightStrategy:signalLightStrategyParam'
}
</script>

<script setup lang="ts">
import { reactive } from "vue";
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
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { SignalLightStrategyParamDto, SignalLightStrategyParamUpdDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";
import { signalLightStrategyParamApi } from "@/api/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";
import { signalLightStrategyParamDict } from "@/dict/module/dcts/signalLightStrategy/signalLightStrategyParam.ts";

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
} = funcTablePage<SignalLightStrategyParamDto, SignalLightStrategyParamUpdDto>({
  state,
  dFormRules,
  config,
  api: signalLightStrategyParamApi,
  dict: signalLightStrategyParamDict,
})
</script>

<template>
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="signalLightStrategyParamDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyParamDict.lightType" prop="lightType">
              <!--<el-input v-model="state.dialogForm.lightType" :placeholder="signalLightStrategyParamDict.lightType"/>-->
              <MultipleCheckbox v-model="state.dialogForm.lightType" :placeholder="signalLightStrategyParamDict.lightType" :kvs="sLSPLTTypeDict"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyParamDict.round" prop="round">
              <el-input-number v-model="state.dialogForm.round" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyParamDict.duration" prop="duration">
              <el-input-number v-model="state.dialogForm.duration" controls-position="right"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyParamDict.currentLight" prop="currentLight">
              <!--<el-input v-model="state.dialogForm.currentLight" :placeholder="signalLightStrategyParamDict.currentLight"/>-->
              <el-radio-group v-model="state.dialogForm.currentLight">
                <el-radio v-for="key in SignalLightColorEnum" :key="key" :value="key">{{ signalLightColorDict[key] }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyParamDict.ifDisabled" prop="ifDisabled">
              <el-radio-group v-model="state.dialogForm.ifDisabled">
                <el-radio :value="final.Y">是</el-radio>
                <el-radio :value="final.N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="signalLightStrategyParamDict.orderNum" prop="orderNum">
              <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="signalLightStrategyParamDict.remark" prop="remark">
              <el-input type="textarea" v-model="state.dialogForm.remark" :placeholder="signalLightStrategyParamDict.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="signalLightStrategyParamDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStrategyParamDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStrategyParamDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStrategyParamDict.ifDisabled" prop="ifDisabled">-->
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
          <el-table-column prop="lightType" :label="signalLightStrategyParamDict.lightType" width="300">
            <template #header>
              <span :class="ifRequired('lightType')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.lightType }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-lightType`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <!--<el-input v-model="state.dialogForms[$index].lightType" :placeholder="signalLightStrategyParamDict.lightType"/>-->
                <MultipleCheckbox v-model="state.dialogForms[$index].lightType" :placeholder="signalLightStrategyParamDict.lightType" :kvs="sLSPLTTypeDict"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="round" :label="signalLightStrategyParamDict.round" width="300">
            <template #header>
              <span :class="ifRequired('round')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.round }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-round`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input-number v-model="state.dialogForms[$index].round" controls-position="right"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="duration" :label="signalLightStrategyParamDict.duration" width="300">
            <template #header>
              <span :class="ifRequired('duration')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.duration }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-duration`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input-number v-model="state.dialogForms[$index].duration" controls-position="right"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="currentLight" :label="signalLightStrategyParamDict.currentLight" width="300">
            <template #header>
              <span :class="ifRequired('currentLight')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.currentLight }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-currentLight`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <!--<el-input v-model="state.dialogForms[$index].currentLight" :placeholder="signalLightStrategyParamDict.currentLight"/>-->
                <el-radio-group v-model="state.dialogForms[$index].currentLight">
                  <el-radio v-for="key in SignalLightColorEnum" :key="key" :value="key">{{ signalLightColorDict[key] }}</el-radio>
                </el-radio-group>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ifDisabled" :label="signalLightStrategyParamDict.ifDisabled" width="70">
            <template #header>
              <span :class="ifRequired('ifDisabled')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.ifDisabled }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-ifDisabled`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-checkbox v-model="state.dialogForms[$index].ifDisabled" :true-value="final.Y" :false-value="final.N"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNum" :label="signalLightStrategyParamDict.orderNum" width="300">
            <template #header>
              <span :class="ifRequired('orderNum')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.orderNum }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-orderNum`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input-number v-model="state.dialogForms[$index].orderNum" controls-position="right"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="signalLightStrategyParamDict.remark" width="300">
            <template #header>
              <span :class="ifRequired('remark')?'tp-table-header-required':''">{{ signalLightStrategyParamDict.remark }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-remark`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input type="textarea" v-model="state.dialogForms[$index].remark" :placeholder="signalLightStrategyParamDict.remark"/>
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
