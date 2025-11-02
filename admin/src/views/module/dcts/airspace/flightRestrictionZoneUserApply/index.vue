<script lang="ts">
export default {
  name: 'dcts:airspace:flightRestrictionZoneUserApply'
}
</script>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { CONFIG, datePickerShortcuts, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplyUpdDto } from "@/type/module/dcts/airspace/flightRestrictionZoneUserApply.ts";
import { flightRestrictionZoneUserApplyApi } from "@/api/module/dcts/airspace/flightRestrictionZoneUserApply.ts";
import { flightRestrictionZoneUserApplyDict } from "@/dict/module/dcts/airspace/flightRestrictionZoneUserApply.ts";
import { lowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { LowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { arrayUtils, timeUtils } from "@dcts/common";

const state = reactive<State2<FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplyUpdDto>>({
  dialogForm: {
    id: -1,
    aircraftId: '',
    taskName: '',
    geometry: '',
    startTime: '',
    endTime: '',
  },
  dialogForms: [],
  filterForm: {
    aircraftId: '',
    taskName: '',
  },
})
const dFormRules: FormRules<FlightRestrictionZoneUserApplyDto> = {
  aircraftId: [{required: true, trigger: 'change'}],
  taskName: [{required: true, trigger: 'change'}],
  geometry: [{required: true, trigger: 'change'}],
  startTime: [{required: true, trigger: 'change'}],
  endTime: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<FlightRestrictionZoneUserApplyDto>({
  bulkOperation: false,
  selectListCallback: () => {
    refreshLowAltitudeAircrafts()
  },
  selectParam: {
    startTime: {
      between: {
        type: 'date',
        value: [null, null]
      }
    },
    endTime: {
      between: {
        type: 'date',
        value: [null, null]
      }
    }
  },
  fCanCallback: () => {
    fCan2()
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
} = funcTablePage<FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplyUpdDto>({
  state,
  dFormRules,
  config,
  api: flightRestrictionZoneUserApplyApi,
  dict: flightRestrictionZoneUserApplyDict,
})

const selectValue = ref<number[]>([])
const selectChange = () => {
  state.dialogForm.aircraftId = selectValue.value.join(',')
}
watch(() => state.dialogForm.aircraftId, () => {
  selectValue.value = state.dialogForm.aircraftId.split(',').filter(_ => _).map(Number)
})
const selectLoading = ref(false)
const selectOptions = ref<LowAltitudeAircraftDto[]>([])
const selectMethod = (query: string) => {
  if (query) {
    selectLoading.value = true
    lowAltitudeAircraftApi.selectAll({aircraftName: query}).then(res => {
      selectOptions.value = res
    }).finally(() => {
      selectLoading.value = false
    })
  } else {
    selectOptions.value = []
  }
}

const remoteSelectValue = ref<number[]>([])
const remoteSelectChange = () => {
  state.filterForm.aircraftId = remoteSelectValue.value.join(',')
}
watch(() => state.filterForm.aircraftId, () => {
  remoteSelectValue.value = state.filterForm.aircraftId ? state.filterForm.aircraftId.split(',').filter(_ => _).map(Number) : []
})
const remoteLoading = ref(false)
const remoteOptions = ref<LowAltitudeAircraftDto[]>([])
const remoteMethod = (query: string) => {
  if (query) {
    remoteLoading.value = true
    lowAltitudeAircraftApi.selectAll({aircraftName: query}).then(res => {
      remoteOptions.value = res
    }).finally(() => {
      remoteLoading.value = false
    })
  } else {
    remoteOptions.value = []
  }
}
const datePicker1Value = ref('')
const datePicker2Value = ref('')
const datePicker1ValueChange = (value: Date[]) => {
  if (value) {
    if (config.selectParam.startTime && typeof config.selectParam.startTime !== 'string' && config.selectParam.startTime.between) {
      config.selectParam.startTime.between.value[0] = value[0]
      config.selectParam.startTime.between.value[1] = value[1]
    }
  } else {
    if (config.selectParam.startTime && typeof config.selectParam.startTime !== 'string' && config.selectParam.startTime.between) {
      config.selectParam.startTime.between.value[0] = null
      config.selectParam.startTime.between.value[1] = null
    }
  }
}
const datePicker2ValueChange = (value: Date[]) => {
  if (value) {
    if (config.selectParam.endTime && typeof config.selectParam.endTime !== 'string' && config.selectParam.endTime.between) {
      config.selectParam.endTime.between.value[0] = value[0]
      config.selectParam.endTime.between.value[1] = value[1]
    }
  } else {
    if (config.selectParam.endTime && typeof config.selectParam.endTime !== 'string' && config.selectParam.endTime.between) {
      config.selectParam.endTime.between.value[0] = null
      config.selectParam.endTime.between.value[1] = null
    }
  }
}
const fCan2 = () => {
  datePicker1Value.value = ''
  datePicker2Value.value = ''
  if (config.selectParam.startTime && typeof config.selectParam.startTime !== 'string' && config.selectParam.startTime.between) {
    config.selectParam.startTime.between.value[0] = null
    config.selectParam.startTime.between.value[1] = null
  }
  if (config.selectParam.endTime && typeof config.selectParam.endTime !== 'string' && config.selectParam.endTime.between) {
    config.selectParam.endTime.between.value[0] = null
    config.selectParam.endTime.between.value[1] = null
  }
}

const allLowAltitudeAircrafts = ref<LowAltitudeAircraftDto[]>([])
const refreshLowAltitudeAircrafts = () => {
  const ids = arrayUtils.arrNoRepeat(tableData.value.map(item => item.aircraftId.split(',').filter(_ => _).map(Number)).flat());
  lowAltitudeAircraftApi.selectByIds(ids).then(res => {
    allLowAltitudeAircrafts.value = res;
    selectOptions.value = res;
  })
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="flightRestrictionZoneUserApplyDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="24">
            <el-form-item :label="flightRestrictionZoneUserApplyDict.aircraftId" prop="aircraftId">
              <!--<el-input v-model="state.dialogForm.aircraftId" :placeholder="flightRestrictionZoneUserApplyDict.aircraftId"/>-->
              <el-select
                  v-model="selectValue"
                  :placeholder="flightRestrictionZoneUserApplyDict.aircraftId"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="selectMethod"
                  :loading="selectLoading"
                  @change="selectChange"
              >
                <el-option v-for="item in selectOptions" :key="item.id" :label="item.aircraftName" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="flightRestrictionZoneUserApplyDict.taskName" prop="taskName">
              <el-input v-model="state.dialogForm.taskName" :placeholder="flightRestrictionZoneUserApplyDict.taskName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="flightRestrictionZoneUserApplyDict.geometry" prop="geometry">
              <el-input v-model="state.dialogForm.geometry" :placeholder="flightRestrictionZoneUserApplyDict.geometry"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="flightRestrictionZoneUserApplyDict.startTime" prop="startTime">
              <el-date-picker type="datetime" v-model="state.dialogForm.startTime" :placeholder="flightRestrictionZoneUserApplyDict.startTime"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="flightRestrictionZoneUserApplyDict.endTime" prop="endTime">
              <el-date-picker type="datetime" v-model="state.dialogForm.endTime" :placeholder="flightRestrictionZoneUserApplyDict.endTime"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="flightRestrictionZoneUserApplyDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="flightRestrictionZoneUserApplyDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="flightRestrictionZoneUserApplyDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="flightRestrictionZoneUserApplyDict.ifDisabled" prop="ifDisabled">-->
        <!--  <el-switch v-model="state.dialogForm.ifDisabled" :active-value="final.N" :inactive-value="final.Y"/>-->
        <!--</el-form-item>-->
        <!--上方几个酌情使用-->
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
      <el-form-item :label="flightRestrictionZoneUserApplyDict.aircraftId" prop="aircraftId">
        <el-select
            v-model="remoteSelectValue"
            :placeholder="flightRestrictionZoneUserApplyDict.aircraftId"
            multiple
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            :loading="remoteLoading"
            @change="remoteSelectChange"
        >
          <el-option v-for="item in remoteOptions" :key="item.id" :label="item.aircraftName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="flightRestrictionZoneUserApplyDict.taskName" prop="taskName">
        <el-input v-model="state.filterForm.taskName" :placeholder="flightRestrictionZoneUserApplyDict.taskName"/>
      </el-form-item>
      <el-form-item :label="flightRestrictionZoneUserApplyDict.startTime" prop="startTime">
        <el-date-picker
            v-model="datePicker1Value"
            type="datetimerange"
            :shortcuts="datePickerShortcuts"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="HH:mm:ss"
            @change="datePicker1ValueChange"
        />
      </el-form-item>
      <el-form-item :label="flightRestrictionZoneUserApplyDict.endTime" prop="endTime">
        <el-date-picker
            v-model="datePicker2Value"
            type="datetimerange"
            :shortcuts="datePickerShortcuts"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            date-format="YYYY/MM/DD ddd"
            time-format="HH:mm:ss"
            @change="datePicker2ValueChange"
        />
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
      <!--<el-table-column fixed prop="id" :label="flightRestrictionZoneUserApplyDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="aircraftId" :label="flightRestrictionZoneUserApplyDict.aircraftId" width="240">
        <template #default="{row}">
          <el-tag v-for="(aid, index) in row.aircraftId.split(',').filter((_: string) => _).map(Number)" :key="index" type="info">
            {{ allLowAltitudeAircrafts.find(item => item.id === aid)?.aircraftName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" :label="flightRestrictionZoneUserApplyDict.taskName" width="240"/>
      <el-table-column prop="geometry" :label="flightRestrictionZoneUserApplyDict.geometry" width="360">
        <template #default="{row}">
          <div style="max-height: 100px;overflow: auto;">{{ row.geometry }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="flightRestrictionZoneUserApplyDict.startTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.startTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="flightRestrictionZoneUserApplyDict.endTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.endTime)) }}
        </template>
      </el-table-column>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="flightRestrictionZoneUserApplyDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="flightRestrictionZoneUserApplyDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="flightRestrictionZoneUserApplyDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="flightRestrictionZoneUserApplyDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="flightRestrictionZoneUserApplyDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="flightRestrictionZoneUserApplyDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="flightRestrictionZoneUserApplyDict.deleted" width="60"/>-->
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
