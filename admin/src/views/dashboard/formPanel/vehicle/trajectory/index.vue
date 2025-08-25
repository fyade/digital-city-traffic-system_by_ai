<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { QueryVehicleTrajectoryDto } from "@/type/module/dcts/spatialData.ts";
import { queryVehicleTrajectoryDict } from "@/dict/module/dcts/spatialData.ts";
import { queryVehicleTrajectoryApi } from "@/api/module/dcts/spatialData.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { vehicleInfoApi } from "@/api/module/dcts/vehicle/vehicleInfo.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.vid as string | undefined
const init = () => {
  if (itemId) {
    vehicleInfoApi.selectById(itemId).then(res => {
      if (res && !form.value.plateNumber) {
        form.value.plateNumber = res.plateNumber
      }
    })
  }
}

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new QueryVehicleTrajectoryDto())
const formRules: FormRules = {
  startTime: [{required: true, trigger: 'change', type: 'number'}],
  endTime: [{required: true, trigger: 'change', type: 'number'}],
  plateNumber: [{required: true, trigger: 'change'}],
}
const dCon = () => {
  dialogFormRef.value?.validate(errors => {
    if (errors) {
      return
    }
    formLoading.value = true
    queryVehicleTrajectoryApi(form.value).then(res => {
      useCesium.drawVehicleTrajectory(res, form.value.plateNumber)
      gotoDashboardHome()
    }).finally(() => {
      formLoading.value = false
    })
  })
}

const val1 = ref<number | null>(null)
const val2 = ref<number | null>(null)
const update1 = (value: number | null) => {
  val1.value = value
  form.value.startTime = value || 0
}
const update2 = (value: number | null) => {
  val2.value = value
  form.value.endTime = value || 0
}
</script>

<template>
  <FormPanelCard
      :if-ins="ifIns"
      :if-upd="ifUpd"
      :if-del="ifDel"
      :loading="formLoading"
      :run-init="init"
  >
    <n-spin :show="formLoading">
      <n-form
          ref="dialogFormRef"
          label-placement="left"
          label-width="auto"
          :model="form"
          :rules="formRules"
      >
        <n-form-item path="startTime" :label="queryVehicleTrajectoryDict.startTime">
          <n-date-picker v-model:value="val1" :placeholder="queryVehicleTrajectoryDict.startTime"
                         type="datetime" clearable :on-update:value="update1"/>
        </n-form-item>
        <n-form-item path="endTime" :label="queryVehicleTrajectoryDict.endTime">
          <n-date-picker v-model:value="val2" :placeholder="queryVehicleTrajectoryDict.endTime"
                         type="datetime" clearable :on-update:value="update2"/>
        </n-form-item>
        <n-form-item path="plateNumber" :label="queryVehicleTrajectoryDict.plateNumber">
          <n-input v-model:value="form.plateNumber" :placeholder="queryVehicleTrajectoryDict.plateNumber"/>
        </n-form-item>
        <div class="box-flex-end">
          <n-button secondary type="primary" @click="dCon">确认</n-button>
        </div>
      </n-form>
    </n-spin>
  </FormPanelCard>
</template>

<style scoped>
</style>
