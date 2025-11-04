<script lang="ts">
export default {
  name: 'dcts:asset:threeDFile'
}
</script>

<script setup lang="ts">
import { onActivated, onMounted, reactive } from "vue";
import { CONFIG, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { ThreeDFileDto, ThreeDFileUpdDto } from "@/type/module/dcts/asset/threeDFile.ts";
import { threeDFileApi } from "@/api/module/dcts/asset/threeDFile.ts";
import { threeDFileDict } from "@/dict/module/dcts/asset/threeDFile.ts";
import { useRoute, useRouter } from "vue-router";
import { gotoHiddenPath } from "@/utils/RouterUtils.ts";
import { ifDashboardPage } from "@/utils/DashboardUtils.ts";

const route = useRoute()
const router = useRouter()
let unitid = 0
const fun = (cb?: () => void) => {
  const unitid_ = route.query.unitid
  const b = unitid !== Number(unitid_)
  if (unitid_) {
    unitid = Number(unitid_)
  } else {
    if (ifDashboardPage()) {
      router.push('/dashboard/admin-panel/asset/three-d-file-unit')
    } else {
      gotoHiddenPath('dcts:asset:threeDFileUnit')
    }
  }
  state.dialogForm.unitId = unitid
  config.selectParam.unitId = unitid
  if (b && cb) {
    cb()
  }
}

onMounted(() => {
  fun()
})
onActivated(() => {
  fun(() => {
    refresh()
  })
})

const state = reactive<State2<ThreeDFileDto, ThreeDFileUpdDto>>({
  dialogForm: {
    id: -1,
    unitId: unitid,
    fileName: '',
    orderNum: final.DEFAULT_ORDER_NUM,
  },
  dialogForms: [],
  filterForm: {},
})
const dFormRules: FormRules<ThreeDFileDto> = {
  unitId: [{required: true, trigger: 'change'}],
  fileName: [{required: true, trigger: 'change'}],
  orderNum: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<ThreeDFileDto>({
  selectParam: {
    unitId: unitid
  },
  bulkOperation: false,
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
} = funcTablePage<ThreeDFileDto, ThreeDFileUpdDto>({
  state,
  dFormRules,
  config,
  api: threeDFileApi,
  dict: threeDFileDict,
})

const uploadSuccess = (filename: string) => {
  state.dialogForm.fileName = filename
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="threeDFileDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <!--<el-col :span="12">-->
          <!--  <el-form-item :label="threeDFileDict.unitId" prop="unitId">-->
          <!--    <el-input-number v-model="state.dialogForm.unitId" controls-position="right"/>-->
          <!--  </el-form-item>-->
          <!--</el-col>-->
          <el-col :span="24">
            <el-form-item :label="threeDFileDict.fileName" prop="fileName">
              <el-input v-model="state.dialogForm.fileName" :placeholder="threeDFileDict.fileName" disabled>
                <template #append>
                  <el-button-group>
                    <FileUploadOneFull
                        label="上传小文件"
                        :show-icon="false"
                        module="dcts:threeDFile"
                        @uploadSuccess="uploadSuccess"
                    />
                    <FileUploadOneChunk
                        label="上传大文件"
                        :show-icon="false"
                        module="dcts:threeDFile"
                        @uploadSuccess="uploadSuccess"
                    />
                  </el-button-group>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="threeDFileDict.orderNum" prop="orderNum">
              <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="threeDFileDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="threeDFileDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="threeDFileDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="threeDFileDict.ifDisabled" prop="ifDisabled">-->
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
      <!--<el-form-item :label="threeDFileDict." prop="">-->
      <!--  <el-input v-model="state.filterForm." :placeholder="threeDFileDict."/>-->
      <!--</el-form-item>-->
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
      <!--<el-button type="success" plain :icon="Edit" :disabled="config.bulkOperation?multipleSelection.length===0:multipleSelection.length!==1" @click="gUpd">修改</el-button>-->
      <el-button type="danger" plain :icon="Delete" :disabled="multipleSelection.length===0" @click="gDel">删除</el-button>
      <!--<el-button type="warning" plain :icon="Download" :disabled="multipleSelection.length===0" @click="gExport">导出</el-button>-->
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
      <!--<el-table-column fixed prop="id" :label="threeDFileDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <!--<el-table-column prop="unitId" :label="threeDFileDict.unitId" width="120"/>-->
      <el-table-column prop="fileName" :label="threeDFileDict.fileName" width="480"/>
      <el-table-column prop="orderNum" :label="threeDFileDict.orderNum" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="threeDFileDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="threeDFileDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="threeDFileDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="threeDFileDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="threeDFileDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="threeDFileDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="threeDFileDict.deleted" width="60"/>-->
      <!--上方几个酌情使用-->
      <el-table-column fixed="right" label="操作" min-width="140">
        <template #default="{row}">
          <div class="zs-table-data-operate-button-row">
            <!--<el-button link type="primary" size="small" :icon="Edit" @click="tUpd(row.id)">修改</el-button>-->
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
