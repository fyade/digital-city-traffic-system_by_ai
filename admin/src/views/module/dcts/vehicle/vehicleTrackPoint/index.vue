<script lang="ts">
export default {
  name: 'dcts:vehicle:vehicleTrackPoint'
}
</script>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { CONFIG, datePickerShortcuts, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { VehicleTrackPointDto, VehicleTrackPointUpdDto } from "@/type/module/dcts/vehicle/vehicleTrackPoint.ts";
import { vehicleTrackPointApi } from "@/api/module/dcts/vehicle/vehicleTrackPoint.ts";
import { vehicleTrackPointDict } from "@/dict/module/dcts/vehicle/vehicleTrackPoint.ts";
import { timeUtils } from "@dcts/common";

const state = reactive<State2<VehicleTrackPointDto, VehicleTrackPointUpdDto>>({
  dialogForm: {
    id: -1,
    vehicleId: 0,
    point: '',
    heading: 0,
  },
  dialogForms: [],
  filterForm: {
    vehicleId: null,
  },
})
const dFormRules: FormRules<VehicleTrackPointDto> = {
  vehicleId: [{required: true, trigger: 'change'}],
  point: [{required: true, trigger: 'change'}],
  heading: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<VehicleTrackPointDto>({
  bulkOperation: true,
  ifShowSelectForm: true,
  selectParam: {
    createTime: {
      between: {
        type: 'date',
        value: [null, null]
      }
    }
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
} = funcTablePage<VehicleTrackPointDto, VehicleTrackPointUpdDto>({
  state,
  dFormRules,
  config,
  api: vehicleTrackPointApi,
  dict: vehicleTrackPointDict,
})

const datePickerValue = ref('')
const datePickerValueChange = (value: Date[]) => {
  if (value) {
    if (config.selectParam.createTime && typeof config.selectParam.createTime !== 'string' && config.selectParam.createTime.between) {
      config.selectParam.createTime.between.value[0] = value[0]
      config.selectParam.createTime.between.value[1] = value[1]
    }
  } else {
    if (config.selectParam.createTime && typeof config.selectParam.createTime !== 'string' && config.selectParam.createTime.between) {
      config.selectParam.createTime.between.value[0] = null
      config.selectParam.createTime.between.value[1] = null
    }
  }
}
const fCan2 = () => {
  datePickerValue.value = ''
  if (config.selectParam.createTime && typeof config.selectParam.createTime !== 'string' && config.selectParam.createTime.between) {
    config.selectParam.createTime.between.value[0] = null
    config.selectParam.createTime.between.value[1] = null
  }
  fCan()
}

const change = () => {
  if (!state.filterForm.vehicleId) {
    state.filterForm.vehicleId = null
  }
}
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="vehicleTrackPointDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="vehicleTrackPointDict.vehicleId" prop="vehicleId">
              <el-input-number v-model="state.dialogForm.vehicleId" controls-position="right"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="vehicleTrackPointDict.point" prop="point">
              <el-input v-model="state.dialogForm.point" :placeholder="vehicleTrackPointDict.point"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="vehicleTrackPointDict.heading" prop="heading">
              <el-input-number v-model="state.dialogForm.heading" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="vehicleTrackPointDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="vehicleTrackPointDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="vehicleTrackPointDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="vehicleTrackPointDict.ifDisabled" prop="ifDisabled">-->
        <!--  <el-switch v-model="state.dialogForm.ifDisabled" :active-value="final.N" :inactive-value="final.Y"/>-->
        <!--</el-form-item>-->
        <!--上方几个酌情使用-->
      </el-form>
    </template>
    <template v-if="activeTabName===final.more">
      <el-form
          ref="dialogFormsRef"
          v-loading="dialogLoadingRef"
          :model="state.dialogForms"
          :rules="dFormRules"
      >
        <el-table
            class="tp-table-operate-more-row"
            :data="state.dialogForms"
        >
          <el-table-column type="index" width="50">
            <template #header>
              #
            </template>
          </el-table-column>
          <!--在此下方添加表格列-->
          <el-table-column prop="vehicleId" :label="vehicleTrackPointDict.vehicleId" width="300">
            <template #header>
              <span :class="ifRequired('vehicleId')?'tp-table-header-required':''">{{ vehicleTrackPointDict.vehicleId }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.vehicleId`" :rules="dFormRules.vehicleId">
                <el-input-number v-model="state.dialogForms[$index].vehicleId" controls-position="right"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="point" :label="vehicleTrackPointDict.point" width="300">
            <template #header>
              <span :class="ifRequired('point')?'tp-table-header-required':''">{{ vehicleTrackPointDict.point }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.point`" :rules="dFormRules.point">
                <el-input v-model="state.dialogForms[$index].point" :placeholder="vehicleTrackPointDict.point"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="heading" :label="vehicleTrackPointDict.heading" width="300">
            <template #header>
              <span :class="ifRequired('heading')?'tp-table-header-required':''">{{ vehicleTrackPointDict.heading }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.heading`" :rules="dFormRules.heading">
                <el-input-number v-model="state.dialogForms[$index].heading" controls-position="right"/>
              </el-form-item>
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
      <el-form-item :label="vehicleTrackPointDict.vehicleId" prop="vehicleId">
        <el-input v-model="state.filterForm.vehicleId" :placeholder="vehicleTrackPointDict.vehicleId" @change="change"/>
      </el-form-item>
      <el-form-item :label="vehicleTrackPointDict.createTime" prop="createTime">
        <el-date-picker
            v-model="datePickerValue"
            type="datetimerange"
            :shortcuts="datePickerShortcuts"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="HH:mm:ss"
            @change="datePickerValueChange"
        />
      </el-form-item>
      <!--在此上方添加表单项-->
      <el-form-item>
        <el-button type="primary" @click="fCon">筛选</el-button>
        <el-button @click="fCan2">重置</el-button>
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
      <!--<el-table-column fixed prop="id" :label="vehicleTrackPointDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="vehicleId" :label="vehicleTrackPointDict.vehicleId" width="120"/>
      <el-table-column prop="point" :label="vehicleTrackPointDict.point" width="320"/>
      <el-table-column prop="heading" :label="vehicleTrackPointDict.heading" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="vehicleTrackPointDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="vehicleTrackPointDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="vehicleTrackPointDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="vehicleTrackPointDict.updateBy" width="120"/>-->
      <el-table-column prop="createTime" :label="vehicleTrackPointDict.createTime" width="220">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.createTime)) }}
        </template>
      </el-table-column>
      <!--<el-table-column prop="updateTime" :label="vehicleTrackPointDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="vehicleTrackPointDict.deleted" width="60"/>-->
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
