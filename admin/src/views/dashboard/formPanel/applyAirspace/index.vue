<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import {
  UserFlightRestrictionZoneUserApplyDto
} from "@/type/module/dcts/airspace/userFlightRestrictionZoneUserApply.ts";
import {
  userFlightRestrictionZoneUserApplyDict
} from "@/dict/module/dcts/airspace/userFlightRestrictionZoneUserApply.ts";

// todo
const route = useRoute();
const useCesium = useDashboardCesium;
const dashboardStore = useDashboardStore();

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new UserFlightRestrictionZoneUserApplyDto())
const formRules: FormRules = {
  aircraftId: [{required: true, trigger: 'change'}],
  taskName: [{required: true, trigger: 'change'}],
  geometry: [{required: true, trigger: 'change'}],
  startTime: [{required: true, trigger: 'change'}],
  endTime: [{required: true, trigger: 'change'}],
}
const dCon = () => {
}

const mapPoint = () => {}
</script>

<template>
  <FormPanelCard
      :if-ins="true"
      :if-upd="false"
      :if-del="false"
      :loading="formLoading"
      preset="drawer"
  >
    <n-spin :show="formLoading">
      <n-form
          ref="dialogFormRef"
          label-placement="left"
          label-width="auto"
          :model="form"
          :rules="formRules"
      >
        <n-form-item path="aircraftId" :label="userFlightRestrictionZoneUserApplyDict.aircraftId">
          <n-input v-model:value="form.aircraftId" :placeholder="userFlightRestrictionZoneUserApplyDict.aircraftId"/>
        </n-form-item>
        <n-form-item path="taskName" :label="userFlightRestrictionZoneUserApplyDict.taskName">
          <n-input v-model:value="form.taskName" :placeholder="userFlightRestrictionZoneUserApplyDict.taskName"/>
        </n-form-item>
        <n-form-item path="geometry" :label="userFlightRestrictionZoneUserApplyDict.geometry">
          <n-input v-model:value="form.geometry" :placeholder="userFlightRestrictionZoneUserApplyDict.geometry" disabled>
            <template #suffix>
              <n-button @click="mapPoint">地图选点</n-button>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="startTime" :label="userFlightRestrictionZoneUserApplyDict.startTime">
          <n-input v-model:value="form.startTime" :placeholder="userFlightRestrictionZoneUserApplyDict.startTime"/>
        </n-form-item>
        <n-form-item path="endTime" :label="userFlightRestrictionZoneUserApplyDict.endTime">
          <n-input v-model:value="form.endTime" :placeholder="userFlightRestrictionZoneUserApplyDict.endTime"/>
        </n-form-item>
        <div class="box-flex-end">
          <n-button secondary type="primary" @click="dCon">确认</n-button>
        </div>
      </n-form>
    </n-spin>
  </FormPanelCard>
</template>

<style scoped>
:deep(.n-input .n-input-wrapper) {
  padding-right: 0;
}
</style>