<script lang="ts">
export default {
  name: 'dcts:signalLight:signalLightStyle'
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
import { SignalLightStyleDto, SignalLightStyleUpdDto } from "@/type/module/dcts/signalLight/signalLightStyle.ts";
import { signalLightStyleApi } from "@/api/module/dcts/signalLight/signalLightStyle.ts";
import { signalLightStyleDict } from "@/dict/module/dcts/signalLight/signalLightStyle.ts";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { base } from "@dcts/common";

const state = reactive<State2<SignalLightStyleDto, SignalLightStyleUpdDto>>({
  dialogForm: {
    id: -1,
    name: '',
    style: '',
  },
  dialogForms: [],
  filterForm: {
    name: '',
  },
})
const dFormRules: FormRules<SignalLightStyleDto> = {
  name: [{required: true, trigger: 'change'}],
  style: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<SignalLightStyleDto>({
  dialogVisibleCallback: () => {
    dialogChange()
  },
  dialogFormLoadingFinishCallback: () => {
    dialogChange()
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
} = funcTablePage<SignalLightStyleDto, SignalLightStyleUpdDto>({
  state,
  dFormRules,
  config,
  api: signalLightStyleApi,
  dict: signalLightStyleDict,
})

const lightCount = 10
const checkBoxValue = ref<boolean[][]>([])
const signalLightUnitStyleEnumValue = Object.values(base.SignalLightUnitStyleEnum)
const initCheckBoxValue = () => {
  checkBoxValue.value = []
  const _arr = []
  for (let key in base.SignalLightUnitStyleEnum) {
    _arr.push(false)
  }
  for (let i = 0; i < lightCount; i++) {
    checkBoxValue.value.push(deepClone(_arr))
  }
}
initCheckBoxValue()
const setValueToForm = () => {
  const arr = []
  for (const val of checkBoxValue.value) {
    const indexOf = val.indexOf(true);
    if (indexOf === -1) {
      continue
    }
    arr.push(signalLightUnitStyleEnumValue[indexOf])
  }
  state.dialogForm.style = arr.length > 0 ? `-${arr.join('-')}-` : ''
}
const dialogChange = () => {
  initCheckBoxValue()
  if (dialogType.value === final.upd) {
    const splits = state.dialogForm.style.split('-').filter(_ => _);
    for (let i = 0; i < splits.length; i++) {
      const inde = signalLightUnitStyleEnumValue.indexOf(splits[i] as base.SignalLightUnitStyleEnum);
      checkBoxValue.value[i][inde] = true
    }
  }
}
const change = (ind: number, ind2: number, key: base.SignalLightUnitStyleEnum) => {
  if (checkBoxValue.value[ind].filter(_ => _).length > 1) {
    for (let i = 0; i < checkBoxValue.value[ind].length; i++) {
      if (i === ind2) {
        continue
      }
      checkBoxValue.value[ind][i] = false
    }
  }
  setValueToForm()
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="signalLightStyleDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="24">
            <el-form-item :label="signalLightStyleDict.name" prop="name">
              <el-input v-model="state.dialogForm.name" :placeholder="signalLightStyleDict.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="signalLightStyleDict.style" prop="style">
              <!--<el-input v-model="state.dialogForm.style" :placeholder="signalLightStyleDict.style"/>-->
              <div v-for="(ind, i1) in lightCount" :key="ind">
                <span>左{{ ind }}：</span>
                <el-checkbox v-for="(key, v, i2) in base.SignalLightUnitStyleEnum" :key="key" v-model="checkBoxValue[i1][i2]" :label="base.signalLightUnitStyleDict[key]" @change="change(i1, i2, key)"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="signalLightStyleDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStyleDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStyleDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="signalLightStyleDict.ifDisabled" prop="ifDisabled">-->
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
      <el-form-item :label="signalLightStyleDict.name" prop="name">
        <el-input v-model="state.filterForm.name" :placeholder="signalLightStyleDict.name"/>
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
      <!--<el-table-column fixed prop="id" :label="signalLightStyleDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="name" :label="signalLightStyleDict.name" width="120"/>
      <el-table-column prop="style" :label="signalLightStyleDict.style" width="480">
        <template #default="{row}">
          {{ row.style.split('-').filter((_: string) => _).map((str: string) => base.signalLightUnitStyleDict[str as base.SignalLightUnitStyleEnum]).join('-') }}
        </template>
      </el-table-column>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="signalLightStyleDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="signalLightStyleDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="signalLightStyleDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="signalLightStyleDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="signalLightStyleDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="signalLightStyleDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="signalLightStyleDict.deleted" width="60"/>-->
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
