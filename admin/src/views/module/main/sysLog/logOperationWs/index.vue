<script lang="ts">
export default {
  name: 'main:sysLog:logOperationWs'
}
</script>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { CONFIG, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { LogOperationWsDto, LogOperationWsUpdDto } from "@/type/module/main/sysLog/logOperationWs.ts";
import { logOperationWsApi } from "@/api/module/main/sysLog/logOperationWs.ts";
import { logOperationWsDict } from "@/dict/module/main/sysLog/logOperationWs.ts";
import { timeUtils } from "@dcts/common";

const state = reactive<State2<LogOperationWsDto, LogOperationWsUpdDto>>({
  dialogForm: {
    id: -1,
    socketId: '',
    callIp: '',
    hostName: '',
    wsPerms: '',
    userId: '',
    loginRole: '',
    ifSuccess: '',
    remark: '',
  },
  dialogForms: [],
  dialogForms_error: {},
  filterForm: {
    socketId: '',
    callIp: '',
    hostName: '',
    wsPerms: '',
    userId: '',
    loginRole: '',
    ifSuccess: '',
  },
})
const dFormRules: FormRules<LogOperationWsDto> = {
  socketId: [{required: true, trigger: 'change'}],
  callIp: [{required: true, trigger: 'change'}],
  hostName: [{required: true, trigger: 'change'}],
  wsPerms: [{required: true, trigger: 'change'}],
  userId: [{required: true, trigger: 'change'}],
  loginRole: [{required: true, trigger: 'change'}],
  ifSuccess: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<LogOperationWsDto>({
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
} = funcTablePage<LogOperationWsDto, LogOperationWsUpdDto>({
  state,
  dFormRules,
  config,
  api: logOperationWsApi,
  dict: logOperationWsDict,
})

const datePickerValue = ref('')
const shortcuts = [
  {
    text: '前一周',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '前两周',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setDate(start.getDate() - 14)
      return [start, end]
    },
  },
  {
    text: '前一个月',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '前三个月',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
  {
    text: '前半年',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
  {
    text: '前一年',
    value: () => {
      const start = new Date()
      const end = new Date()
      start.setFullYear(start.getFullYear() - 1)
      return [start, end]
    },
  },
]
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="logOperationWsDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.socketId" prop="socketId">
              <el-input v-model="state.dialogForm.socketId" :placeholder="logOperationWsDict.socketId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.callIp" prop="callIp">
              <el-input v-model="state.dialogForm.callIp" :placeholder="logOperationWsDict.callIp"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.hostName" prop="hostName">
              <el-input v-model="state.dialogForm.hostName" :placeholder="logOperationWsDict.hostName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.wsPerms" prop="wsPerms">
              <el-input v-model="state.dialogForm.wsPerms" :placeholder="logOperationWsDict.wsPerms"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.userId" prop="userId">
              <el-input v-model="state.dialogForm.userId" :placeholder="logOperationWsDict.userId"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.loginRole" prop="loginRole">
              <el-input v-model="state.dialogForm.loginRole" :placeholder="logOperationWsDict.loginRole"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="logOperationWsDict.ifSuccess" prop="ifSuccess">
              <el-radio-group v-model="state.dialogForm.ifSuccess">
                <el-radio :value="final.Y">是</el-radio>
                <el-radio :value="final.N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="logOperationWsDict.remark" prop="remark">
              <el-input type="textarea" v-model="state.dialogForm.remark" :placeholder="logOperationWsDict.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="logOperationWsDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="logOperationWsDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="logOperationWsDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="logOperationWsDict.ifDisabled" prop="ifDisabled">-->
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
          <el-table-column prop="socketId" :label="logOperationWsDict.socketId" width="300">
            <template #header>
              <span :class="ifRequired('socketId')?'tp-table-header-required':''">{{ logOperationWsDict.socketId }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-socketId`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].socketId" :placeholder="logOperationWsDict.socketId"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="callIp" :label="logOperationWsDict.callIp" width="300">
            <template #header>
              <span :class="ifRequired('callIp')?'tp-table-header-required':''">{{ logOperationWsDict.callIp }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-callIp`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].callIp" :placeholder="logOperationWsDict.callIp"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="hostName" :label="logOperationWsDict.hostName" width="300">
            <template #header>
              <span :class="ifRequired('hostName')?'tp-table-header-required':''">{{ logOperationWsDict.hostName }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-hostName`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].hostName" :placeholder="logOperationWsDict.hostName"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="wsPerms" :label="logOperationWsDict.wsPerms" width="300">
            <template #header>
              <span :class="ifRequired('wsPerms')?'tp-table-header-required':''">{{ logOperationWsDict.wsPerms }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-wsPerms`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].wsPerms" :placeholder="logOperationWsDict.wsPerms"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userId" :label="logOperationWsDict.userId" width="300">
            <template #header>
              <span :class="ifRequired('userId')?'tp-table-header-required':''">{{ logOperationWsDict.userId }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-userId`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].userId" :placeholder="logOperationWsDict.userId"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="loginRole" :label="logOperationWsDict.loginRole" width="300">
            <template #header>
              <span :class="ifRequired('loginRole')?'tp-table-header-required':''">{{ logOperationWsDict.loginRole }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-loginRole`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].loginRole" :placeholder="logOperationWsDict.loginRole"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ifSuccess" :label="logOperationWsDict.ifSuccess" width="70">
            <template #header>
              <span :class="ifRequired('ifSuccess')?'tp-table-header-required':''">{{ logOperationWsDict.ifSuccess }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-ifSuccess`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-checkbox v-model="state.dialogForms[$index].ifSuccess" :true-value="final.Y" :false-value="final.N"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="logOperationWsDict.remark" width="300">
            <template #header>
              <span :class="ifRequired('remark')?'tp-table-header-required':''">{{ logOperationWsDict.remark }}</span>
            </template>
            <template #default="{$index}">
              <div :class="state.dialogForms_error?.[`${$index}-remark`] ? 'tp-table-cell-bg-red' : 'tp-table-cell'">
                <el-input v-model="state.dialogForms[$index].remark" :placeholder="logOperationWsDict.remark"/>
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
      <el-form-item :label="logOperationWsDict.socketId" prop="socketId">
        <el-input v-model="state.filterForm.socketId" :placeholder="logOperationWsDict.socketId"/>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.callIp" prop="callIp">
        <el-input v-model="state.filterForm.callIp" :placeholder="logOperationWsDict.callIp"/>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.hostName" prop="hostName">
        <el-input v-model="state.filterForm.hostName" :placeholder="logOperationWsDict.hostName"/>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.wsPerms" prop="wsPerms">
        <el-input v-model="state.filterForm.wsPerms" :placeholder="logOperationWsDict.wsPerms"/>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.userId" prop="userId">
        <el-input v-model="state.filterForm.userId" :placeholder="logOperationWsDict.userId"/>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.loginRole" prop="loginRole">
        <el-input v-model="state.filterForm.loginRole" :placeholder="logOperationWsDict.loginRole"/>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.ifSuccess" prop="ifSuccess">
        <!--<el-input v-model="state.filterForm.ifSuccess" :placeholder="logOperationWsDict.ifSuccess"/>-->
        <el-select v-model="state.filterForm.ifSuccess" :placeholder="logOperationWsDict.ifSuccess" clearable filterable>
          <el-option label="是" :value="final.Y"/>
          <el-option label="否" :value="final.N"/>
          <el-option label="不确定" value="O"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="logOperationWsDict.createTime" prop="createTime">
        <el-date-picker
            v-model="datePickerValue"
            type="datetimerange"
            :shortcuts="shortcuts"
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
      <!--<el-table-column fixed prop="id" :label="logOperationWsDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="socketId" :label="logOperationWsDict.socketId" width="180"/>
      <el-table-column prop="callIp" :label="logOperationWsDict.callIp" width="180"/>
      <el-table-column prop="hostName" :label="logOperationWsDict.hostName" width="180"/>
      <el-table-column prop="wsPerms" :label="logOperationWsDict.wsPerms" width="240"/>
      <el-table-column prop="userId" :label="logOperationWsDict.userId" width="120"/>
      <el-table-column prop="loginRole" :label="logOperationWsDict.loginRole" width="120"/>
      <el-table-column prop="ifSuccess" :label="logOperationWsDict.ifSuccess" width="120">
        <template #header>
          <Tooltip content="Y表示成功，N表示失败，O表示接口无返回值，无法确定是否成功。">
            {{ logOperationWsDict.ifSuccess }}
          </Tooltip>
        </template>
        <template #default="row">
          <el-tag v-if="row.ifSuccess === final.Y" type="success">成功</el-tag>
          <el-tag v-else-if="row.ifSuccess === final.N" type="danger">失败</el-tag>
          <el-tag v-else type="info">不详</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="logOperationWsDict.remark" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="logOperationWsDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="logOperationWsDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="logOperationWsDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="logOperationWsDict.updateBy" width="120"/>-->
      <el-table-column prop="createTime" :label="logOperationWsDict.createTime" width="220">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.createTime)) }}
        </template>
      </el-table-column>
      <!--<el-table-column prop="updateTime" :label="logOperationWsDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="logOperationWsDict.deleted" width="60"/>-->
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
