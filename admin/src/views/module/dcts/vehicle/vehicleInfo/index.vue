<script lang="ts">
export default {
  name: 'dcts:vehicle:vehicleInfo'
}
</script>

<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue";
import { CONFIG, final } from "@/utils/base.ts";
import Pagination from "@/components/pagination/pagination.vue";
import { funcTablePage } from "@/composition/tablePage/tablePage2.ts";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormRules } from "element-plus";
import { Delete, Download, Edit, Plus, Refresh, Upload, Search } from "@element-plus/icons-vue";
import { VehicleInfoDto, VehicleInfoUpdDto } from "@/type/module/dcts/vehicle/vehicleInfo.ts";
import { vehicleInfoApi } from "@/api/module/dcts/vehicle/vehicleInfo.ts";
import { vehicleInfoDict } from "@/dict/module/dcts/vehicle/vehicleInfo.ts";
import { useDictStore } from "@/store/module/dict.ts";
import { DicDataDto } from "@/type/module/main/sysManage/dicData.ts";

const dictStore = useDictStore();

const state = reactive<State2<VehicleInfoDto, VehicleInfoUpdDto>>({
  dialogForm: {
    id: -1,
    plateNumber: '',
    vehicleType: '',
    brand: '',
    color: '',
  },
  dialogForms: [],
  filterForm: {
    plateNumber: '',
    vehicleType: '',
    brand: '',
    color: '',
  },
})
const dFormRules: FormRules<VehicleInfoDto> = {
  plateNumber: [{required: true, trigger: 'change'}],
  vehicleType: [{required: true, trigger: 'change'}],
  brand: [{required: true, trigger: 'change'}],
  color: [{required: true, trigger: 'change'}],
}
const config = new TablePageConfig<VehicleInfoDto>({
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
} = funcTablePage<VehicleInfoDto, VehicleInfoUpdDto>({
  state,
  dFormRules,
  config,
  api: vehicleInfoApi,
  dict: vehicleInfoDict,
})

const vehicleTypeDict = ref<DicDataDto[]>([])
const boardDict = ref<DicDataDto[]>([])
const dict1 = dictStore.getDict('dcts:car:type');
watchEffect(() => {
  if (dict1.isLoading.value) {
  } else if (dict1.error.value) {
  } else {
    vehicleTypeDict.value = dict1.data.value
  }
})
const dict2 = dictStore.getDict('dcts:car:board');
watchEffect(() => {
  if (dict2.isLoading.value) {
  } else if (dict2.error.value) {
  } else {
    boardDict.value = dict2.data.value
  }
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
        <el-form-item v-if="dialogType.value!==final.ins" :label="vehicleInfoDict.id" prop="id">
          <span>{{ state.dialogForm.id }}</span>
        </el-form-item>
        <!--在此下方添加表单项-->
        <el-row>
          <el-col :span="12">
            <el-form-item :label="vehicleInfoDict.plateNumber" prop="plateNumber">
              <el-input v-model="state.dialogForm.plateNumber" :placeholder="vehicleInfoDict.plateNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="vehicleInfoDict.vehicleType" prop="vehicleType">
              <!--<el-input v-model="state.dialogForm.vehicleType" :placeholder="vehicleInfoDict.vehicleType"/>-->
              <el-select v-model="state.dialogForm.vehicleType" :placeholder="vehicleInfoDict.vehicleType" clearable filterable>
                <el-option v-for="item in vehicleTypeDict" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="vehicleInfoDict.brand" prop="brand">
              <!--<el-input v-model="state.dialogForm.brand" :placeholder="vehicleInfoDict.brand"/>-->
              <el-select v-model="state.dialogForm.brand" :placeholder="vehicleInfoDict.brand" clearable filterable>
                <el-option v-for="item in boardDict" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="vehicleInfoDict.color" prop="color">
              <el-input v-model="state.dialogForm.color" :placeholder="vehicleInfoDict.color"/>
            </el-form-item>
          </el-col>
        </el-row>
        <!--在此上方添加表单项-->
        <!--<el-form-item :label="vehicleInfoDict.orderNum" prop='orderNum'>-->
        <!--  <el-input-number v-model="state.dialogForm.orderNum" controls-position="right"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="vehicleInfoDict.ifDefault" prop='ifDefault'>-->
        <!--  <el-switch v-model="state.dialogForm.ifDefault" :active-value='final.Y' :inactive-value='final.N'/>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="vehicleInfoDict.ifDisabled" prop='ifDisabled'>-->
        <!--  <el-radio-group v-model="state.dialogForm.ifDisabled">-->
        <!--    <el-radio :value="final.Y">是</el-radio>-->
        <!--    <el-radio :value="final.N">否</el-radio>-->
        <!--  </el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item :label="vehicleInfoDict.ifDisabled" prop="ifDisabled">-->
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
          <el-table-column prop="plateNumber" :label="vehicleInfoDict.plateNumber" width="300">
            <template #header>
              <span :class="ifRequired('plateNumber')?'tp-table-header-required':''">{{ vehicleInfoDict.plateNumber }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.plateNumber`" :rules="dFormRules.plateNumber">
                <el-input v-model="state.dialogForms[$index].plateNumber" :placeholder="vehicleInfoDict.plateNumber"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="vehicleType" :label="vehicleInfoDict.vehicleType" width="300">
            <template #header>
              <span :class="ifRequired('vehicleType')?'tp-table-header-required':''">{{ vehicleInfoDict.vehicleType }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.vehicleType`" :rules="dFormRules.vehicleType">
                <!--<el-input v-model="state.dialogForms[$index].vehicleType" :placeholder="vehicleInfoDict.vehicleType"/>-->
                <el-select v-model="state.dialogForms[$index].vehicleType" :placeholder="vehicleInfoDict.vehicleType" clearable filterable>
                  <el-option v-for="item in vehicleTypeDict" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="brand" :label="vehicleInfoDict.brand" width="300">
            <template #header>
              <span :class="ifRequired('brand')?'tp-table-header-required':''">{{ vehicleInfoDict.brand }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.brand`" :rules="dFormRules.brand">
                <!--<el-input v-model="state.dialogForms[$index].brand" :placeholder="vehicleInfoDict.brand"/>-->
                <el-select v-model="state.dialogForms[$index].brand" :placeholder="vehicleInfoDict.brand" clearable filterable>
                  <el-option v-for="item in boardDict" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="color" :label="vehicleInfoDict.color" width="300">
            <template #header>
              <span :class="ifRequired('color')?'tp-table-header-required':''">{{ vehicleInfoDict.color }}</span>
            </template>
            <template #default="{$index}">
              <el-form-item :prop="`${$index}.color`" :rules="dFormRules.color">
                <el-input v-model="state.dialogForms[$index].color" :placeholder="vehicleInfoDict.color"/>
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
      <el-form-item :label="vehicleInfoDict.plateNumber" prop="plateNumber">
        <el-input v-model="state.filterForm.plateNumber" :placeholder="vehicleInfoDict.plateNumber"/>
      </el-form-item>
      <el-form-item :label="vehicleInfoDict.vehicleType" prop="vehicleType">
        <!--<el-input v-model="state.filterForm.vehicleType" :placeholder="vehicleInfoDict.vehicleType"/>-->
        <el-select v-model="state.filterForm.vehicleType" :placeholder="vehicleInfoDict.vehicleType" clearable filterable>
          <el-option v-for="item in vehicleTypeDict" :key="item.id" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="vehicleInfoDict.brand" prop="brand">
        <!--<el-input v-model="state.filterForm.brand" :placeholder="vehicleInfoDict.brand"/>-->
        <el-select v-model="state.filterForm.brand" :placeholder="vehicleInfoDict.brand" clearable filterable>
          <el-option v-for="item in boardDict" :key="item.id" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="vehicleInfoDict.color" prop="color">
        <el-input v-model="state.filterForm.color" :placeholder="vehicleInfoDict.color"/>
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
      <!--<el-table-column fixed prop="id" :label="vehicleInfoDict.id" width="180"/>-->
      <!--上面id列的宽度改一下-->
      <!--在此下方添加表格列-->
      <el-table-column prop="plateNumber" :label="vehicleInfoDict.plateNumber" width="120"/>
      <el-table-column prop="vehicleType" :label="vehicleInfoDict.vehicleType" width="120"/>
      <el-table-column prop="brand" :label="vehicleInfoDict.brand" width="120"/>
      <el-table-column prop="color" :label="vehicleInfoDict.color" width="120"/>
      <!--在此上方添加表格列-->
      <!--<el-table-column prop="createRole" :label="vehicleInfoDict.createRole" width="120"/>-->
      <!--<el-table-column prop="updateRole" :label="vehicleInfoDict.updateRole" width="120"/>-->
      <!--<el-table-column prop="createBy" :label="vehicleInfoDict.createBy" width="120"/>-->
      <!--<el-table-column prop="updateBy" :label="vehicleInfoDict.updateBy" width="120"/>-->
      <!--<el-table-column prop="createTime" :label="vehicleInfoDict.createTime" width="220"/>-->
      <!--<el-table-column prop="updateTime" :label="vehicleInfoDict.updateTime" width="220"/>-->
      <!--<el-table-column prop="deleted" :label="vehicleInfoDict.deleted" width="60"/>-->
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
