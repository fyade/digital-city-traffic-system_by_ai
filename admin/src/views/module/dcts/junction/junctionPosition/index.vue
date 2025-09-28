<script lang="ts">
export default {
  name: 'dcts:junction:junctionPosition'
}
</script>

<script setup lang="ts">
import { reactive } from "vue";
import { CONFIG, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { JunctionPositionDto, JunctionPositionUpdDto } from "@/type/module/dcts/junction/junctionPosition.ts";
import { junctionPositionApi } from "@/api/module/dcts/junction/junctionPosition.ts";
import { junctionPositionDict } from "@/dict/module/dcts/junction/junctionPosition.ts";
import { timeUtils } from "@dcts/common";

const state = reactive<State2<JunctionPositionDto, JunctionPositionUpdDto>>({
  dialogForm: {
    id: -1,
    geom: '',
    name: '',
    junctionType: '',
  },
  dialogForms: [],
  filterForm: {
    name: '',
    junctionType: '',
  },
})
const dFormRules: FormRules<JunctionPositionDto> = {
  geom: [{required: true, trigger: 'change'}],
  name: [{required: true, trigger: 'change'}],
  junctionType: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<JunctionPositionDto>({
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
} = funcTablePage<JunctionPositionDto, JunctionPositionUpdDto>({
  state,
  dFormRules,
  config,
  api: junctionPositionApi,
  dict: junctionPositionDict,
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="junctionPositionDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="junctionPositionDict.geom" prop="geom">
              <el-input v-model="state.dialogForm.geom" :placeholder="junctionPositionDict.geom"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="junctionPositionDict.name" prop="name">
              <el-input v-model="state.dialogForm.name" :placeholder="junctionPositionDict.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="junctionPositionDict.junctionType" prop="junctionType">
              <el-input v-model="state.dialogForm.junctionType" :placeholder="junctionPositionDict.junctionType"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="junctionPositionDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="junctionPositionDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="junctionPositionDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="junctionPositionDict.ifDisabled" prop="ifDisabled">-->
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
          <el-table-column prop="geom" :label="junctionPositionDict.geom" width="300">
            <template #header>
              <span :class="ifRequired('geom')?'tp-table-header-required':''">{{ junctionPositionDict.geom }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.geom`" :rules="dFormRules.geom">
                <el-input v-model="state.dialogForms[$index].geom" :placeholder="junctionPositionDict.geom"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="junctionPositionDict.name" width="300">
            <template #header>
              <span :class="ifRequired('name')?'tp-table-header-required':''">{{ junctionPositionDict.name }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.name`" :rules="dFormRules.name">
                <el-input v-model="state.dialogForms[$index].name" :placeholder="junctionPositionDict.name"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="junctionType" :label="junctionPositionDict.junctionType" width="300">
            <template #header>
              <span :class="ifRequired('junctionType')?'tp-table-header-required':''">{{ junctionPositionDict.junctionType }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.junctionType`" :rules="dFormRules.junctionType">
                <el-input v-model="state.dialogForms[$index].junctionType" :placeholder="junctionPositionDict.junctionType"/>
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
      <el-form-item :label="junctionPositionDict.name" prop="name">
        <el-input v-model="state.filterForm.name" :placeholder="junctionPositionDict.name"/>
      </el-form-item>
      <el-form-item :label="junctionPositionDict.junctionType" prop="junctionType">
        <el-input v-model="state.filterForm.junctionType" :placeholder="junctionPositionDict.junctionType"/>
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
      <!--<el-table-column fixed prop="id" :label="junctionPositionDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="geom" :label="junctionPositionDict.geom" width="360"/>
      <el-table-column prop="name" :label="junctionPositionDict.name" width="120"/>
      <el-table-column prop="junctionType" :label="junctionPositionDict.junctionType" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="junctionPositionDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="junctionPositionDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="junctionPositionDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="junctionPositionDict.updateBy" width="120"/>-->
      <el-table-column prop="createTime" :label="junctionPositionDict.createTime" width="220">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.createTime)) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" :label="junctionPositionDict.updateTime" width="220">
        <template #default="{row}">
          {{ timeUtils.formatDate(new Date(row.updateTime)) }}
        </template>
      </el-table-column>
      <!--<el-table-column prop="deleted" :label="junctionPositionDict.deleted" width="60"/>-->
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
