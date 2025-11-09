<script lang="ts">
export default {
  name: 'dcts:airspace:flightRouteUserApply'
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
import { FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto } from "@/type/module/dcts/airspace/flightRouteUserApply.ts";
import { flightRouteUserApplyApi } from "@/api/module/dcts/airspace/flightRouteUserApply.ts";
import { flightRouteUserApplyDict } from "@/dict/module/dcts/airspace/flightRouteUserApply.ts";
import { lowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { LowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { arrayUtils, base, timeUtils } from "@dcts/common";
import { useSysStore } from "@/store/module/sys.ts";
import { fileBaseUrl } from "@/api/request.ts";

const sysStore = useSysStore()

const state = reactive<State2<FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto>>({
  dialogForm: {
    id: -1,
    aircraftId: '',
    taskName: '',
    path: '',
    startTime: '',
    endTime: '',
    applyStatus: base.AFRASTypeEnum.aaa,
    applyOpinion: '',
    files: '',
  },
  dialogForms: [],
  filterForm: {
    aircraftId: '',
    taskName: '',
    applyStatus: '',
  },
})
const dFormRules: FormRules<FlightRouteUserApplyDto> = {
  aircraftId: [{required: true, trigger: 'change'}],
  taskName: [{required: true, trigger: 'change'}],
  path: [{required: true, trigger: 'change'}],
  startTime: [{required: true, trigger: 'change'}],
  endTime: [{required: true, trigger: 'change'}],
  applyStatus: [{required: true, trigger: 'change'}],
  applyOpinion: [{required: true, trigger: 'change'}],
  files: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<FlightRouteUserApplyDto>({
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
} = funcTablePage<FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto>({
  state,
  dFormRules,
  config,
  api: flightRouteUserApplyApi,
  dict: flightRouteUserApplyDict,
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

const openFile = (filename: string) => {
  window.open(sysStore.urlAddAuth(`${fileBaseUrl}${filename}`))
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="flightRouteUserApplyDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="24">
            <el-form-item :label="flightRouteUserApplyDict.aircraftId" prop="aircraftId">
              <!--<el-input v-model="state.dialogForm.aircraftId" :placeholder="flightRouteUserApplyDict.aircraftId"/>-->
              <el-select
                  v-model="selectValue"
                  :placeholder="flightRouteUserApplyDict.aircraftId"
                  multiple
                  filterable
                  remote
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
            <el-form-item :label="flightRouteUserApplyDict.taskName" prop="taskName">
              <el-input v-model="state.dialogForm.taskName" :placeholder="flightRouteUserApplyDict.taskName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="flightRouteUserApplyDict.path" prop="path">
              <el-input v-model="state.dialogForm.path" :placeholder="flightRouteUserApplyDict.path"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="flightRouteUserApplyDict.startTime" prop="startTime">
              <el-date-picker type="datetime" v-model="state.dialogForm.startTime" :placeholder="flightRouteUserApplyDict.startTime"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="flightRouteUserApplyDict.endTime" prop="endTime">
              <el-date-picker type="datetime" v-model="state.dialogForm.endTime" :placeholder="flightRouteUserApplyDict.endTime"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="flightRouteUserApplyDict.applyStatus" prop="applyStatus">
              <el-select v-model="state.dialogForm.applyStatus" :placeholder="flightRouteUserApplyDict.applyStatus" clearable filterable>
                <el-option v-for="key in base.AFRASTypeEnum" :key="key" :label="base.aFRASTypeDict[key]" :value="key"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="flightRouteUserApplyDict.applyOpinion" prop="applyOpinion">
              <el-input v-model="state.dialogForm.applyOpinion" :placeholder="flightRouteUserApplyDict.applyOpinion"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="flightRouteUserApplyDict.files" prop="files">
              <el-input v-model="state.dialogForm.files" :placeholder="flightRouteUserApplyDict.files"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="flightRouteUserApplyDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="flightRouteUserApplyDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="flightRouteUserApplyDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="flightRouteUserApplyDict.ifDisabled" prop="ifDisabled">-->
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
      <el-form-item :label="flightRouteUserApplyDict.aircraftId" prop="aircraftId">
        <el-select
            v-model="remoteSelectValue"
            :placeholder="flightRouteUserApplyDict.aircraftId"
            multiple
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="remoteLoading"
            @change="remoteSelectChange"
        >
          <el-option v-for="item in remoteOptions" :key="item.id" :label="item.aircraftName" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="flightRouteUserApplyDict.taskName" prop="taskName">
        <el-input v-model="state.filterForm.taskName" :placeholder="flightRouteUserApplyDict.taskName"/>
      </el-form-item>
      <el-form-item :label="flightRouteUserApplyDict.startTime" prop="startTime">
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
      <el-form-item :label="flightRouteUserApplyDict.endTime" prop="endTime">
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
      <el-form-item :label="flightRouteUserApplyDict.applyStatus" prop="applyStatus">
        <el-select v-model="state.filterForm.applyStatus" :placeholder="flightRouteUserApplyDict.applyStatus" clearable filterable>
          <el-option v-for="key in base.AFRASTypeEnum" :key="key" :label="base.aFRASTypeDict[key]" :value="key"/>
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
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length===0" @click="gDel">删除</el-button>
      <el-button type="warning" plain :icon="Download" :disabled="multipleSelection.length===0" @click="gExport">导出</el-button>
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
      <!--<el-table-column fixed prop="id" :label="flightRouteUserApplyDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="aircraftId" :label="flightRouteUserApplyDict.aircraftId" width="240">
        <template #default="{row}">
          <el-tag v-for="(aid, index) in row.aircraftId.split(',').filter((_: string) => _).map(Number)" :key="index" type="info">
            {{ allLowAltitudeAircrafts.find(item => item.id === aid)?.aircraftName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="taskName" :label="flightRouteUserApplyDict.taskName" width="240"/>
      <el-table-column prop="path" :label="flightRouteUserApplyDict.path" width="360">
        <template #default="{row}">
          <div style="max-height: 100px;overflow: auto;">{{ row.path }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="flightRouteUserApplyDict.startTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.startTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" :label="flightRouteUserApplyDict.endTime" width="180">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.endTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="applyStatus" :label="flightRouteUserApplyDict.applyStatus" width="120">
        <template #default="{row}">
          {{ base.aFRASTypeDict[row.applyStatus as base.AFRASTypeEnum] }}
        </template>
      </el-table-column>
      <el-table-column prop="applyOpinion" :label="flightRouteUserApplyDict.applyOpinion" width="240"/>
      <el-table-column prop="files" :label="flightRouteUserApplyDict.files" width="200">
        <template #default="{row}">
          <p class="download" @click="openFile(row.files)">点击下载</p>
        </template>
      </el-table-column>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="flightRouteUserApplyDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="flightRouteUserApplyDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="flightRouteUserApplyDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="flightRouteUserApplyDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="flightRouteUserApplyDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="flightRouteUserApplyDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="flightRouteUserApplyDict.deleted" width="60"/>-->
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
.download {
  font-style: oblique;
  text-decoration: underline;
  cursor: pointer;
}
</style>
