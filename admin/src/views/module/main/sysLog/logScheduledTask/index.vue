<script lang="ts">
export default {
  name: 'main:sysLog:logScheduledTask'
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
import { LogScheduledTaskDto, LogScheduledTaskUpdDto } from "@/type/module/main/sysLog/logScheduledTask.ts";
import { logScheduledTaskApi } from "@/api/module/main/sysLog/logScheduledTask.ts";
import { logScheduledTaskDict } from "@/dict/module/main/sysLog/logScheduledTask.ts";
import { base, timeUtils } from "@dcts/common";

const state = reactive<State2<LogScheduledTaskDto, LogScheduledTaskUpdDto>>({
  dialogForm: {
    id: -1,
    taskTarget: '',
    operateType: '',
    ifSuccess: '',
    remark: '',
  },
  dialogForms: [],
  filterForm: {
    taskTarget: '',
    operateType: '',
    ifSuccess: '',
  },
})
const dFormRules: FormRules<LogScheduledTaskDto> = {
  taskTarget: [{required: true, trigger: 'change'}],
  operateType: [{required: true, trigger: 'change'}],
  ifSuccess: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<LogScheduledTaskDto>({
  bulkOperation: true,
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
} = funcTablePage<LogScheduledTaskDto, LogScheduledTaskUpdDto>({
  state,
  dFormRules,
  config,
  api: logScheduledTaskApi,
  dict: logScheduledTaskDict,
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
      <el-form-item :label="logScheduledTaskDict.taskTarget" prop="taskTarget">
        <el-input v-model="state.filterForm.taskTarget" :placeholder="logScheduledTaskDict.taskTarget"/>
      </el-form-item>
      <el-form-item :label="logScheduledTaskDict.operateType" prop="operateType">
        <!--<el-input v-model="state.filterForm.operateType" :placeholder="logScheduledTaskDict.operateType"/>-->
        <el-select v-model="state.filterForm.operateType" :placeholder="logScheduledTaskDict.operateType" clearable filterable>
          <el-option :label="base.LSTOTTypeDict[base.LSTOTTypeEnum.T_BYSELF]" :value="base.LSTOTTypeEnum.T_BYSELF"/>
          <el-option :label="base.LSTOTTypeDict[base.LSTOTTypeEnum.T_USERTRIGGER]" :value="base.LSTOTTypeEnum.T_USERTRIGGER"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="logScheduledTaskDict.ifSuccess" prop="ifSuccess">
        <!--<el-input v-model="state.filterForm.ifSuccess" :placeholder="logScheduledTaskDict.ifSuccess"/>-->
        <el-select v-model="state.filterForm.ifSuccess" :placeholder="logScheduledTaskDict.ifSuccess" clearable filterable>
          <el-option label="是" :value="final.Y"/>
          <el-option label="否" :value="final.N"/>
          <el-option label="不确定" :value="final.O"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="logScheduledTaskDict.createTime" prop="createTime">
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
      <!--<el-button type="primary" plain :icon="Plus" @click="gIns">新增</el-button>-->
      <!--<el-button type="success" plain :icon="Edit" :disabled="config.bulkOperation?multipleSelection.length===0:multipleSelection.length!==1" @click="gUpd">修改</el-button>-->
      <!--<el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length===0" @click="gDel()">删除</el-button>-->
      <el-button type="warning" plain :icon="Download" :disabled="multipleSelection.length===0" @click="gExport()">导出</el-button>
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
      <!--<el-table-column fixed prop="id" :label="logScheduledTaskDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="taskTarget" :label="logScheduledTaskDict.taskTarget" width="300"/>
      <el-table-column prop="operateType" :label="logScheduledTaskDict.operateType" width="180">
        <template #default="{row}">
          <el-tag v-if="row.operateType === base.LSTOTTypeEnum.T_BYSELF" type="success">{{ base.LSTOTTypeDict[base.LSTOTTypeEnum.T_BYSELF] }}</el-tag>
          <el-tag v-else-if="row.operateType === base.LSTOTTypeEnum.T_USERTRIGGER" type="primary">{{ base.LSTOTTypeDict[base.LSTOTTypeEnum.T_USERTRIGGER] }}</el-tag>
          <el-tag v-else type="info">{{ row.operateType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ifSuccess" :label="logScheduledTaskDict.ifSuccess" width="120">
        <template #default="{row}">
          <el-tag v-if="row.ifSuccess === final.Y" type="success">成功</el-tag>
          <el-tag v-else-if="row.ifSuccess === final.N" type="danger">失败</el-tag>
          <el-tag v-else type="info">不详</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="logScheduledTaskDict.remark" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="logScheduledTaskDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="logScheduledTaskDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="logScheduledTaskDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="logScheduledTaskDict.updateBy" width="120"/>-->
      <el-table-column prop="createTime" :label="logScheduledTaskDict.createTime" width="220">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.createTime)) }}
        </template>
      </el-table-column>
      <!--<el-table-column prop="updateTime" :label="logScheduledTaskDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="logScheduledTaskDict.deleted" width="60"/>-->
      <!--上方几个酌情使用-->
      <!--<el-table-column fixed="right" label="操作" min-width="140">-->
      <!--  <template #default="{row}">-->
      <!--    <div class="zs-table-data-operate-button-row">-->
      <!--      <el-button link type="primary" size="small" :icon="Edit" @click="tUpd(row.id)">修改</el-button>-->
      <!--      <el-button link type="danger" size="small" :icon="Delete" @click="tDel(row.id)">删除</el-button>-->
      <!--    </div>-->
      <!--  </template>-->
      <!--</el-table-column>-->
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
