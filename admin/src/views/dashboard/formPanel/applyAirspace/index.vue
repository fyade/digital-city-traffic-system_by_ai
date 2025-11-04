<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch, watchEffect } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { objectUtils, regularUtils } from "@dcts/common";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { EDIT_TYPE_ENUM } from "@/views/dashboard/functionModules/constant.ts";
import { UserFlightRestrictionZoneUserApplyDto } from "@/type/module/dcts/airspace/userFlightRestrictionZoneUserApply.ts";
import { userLowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/userLowAltitudeAircraft.ts";
import { userFlightRestrictionZoneUserApplyApi } from "@/api/module/dcts/airspace/userFlightRestrictionZoneUserApply.ts";
import { userFlightRestrictionZoneUserApplyDict } from "@/dict/module/dcts/airspace/userFlightRestrictionZoneUserApply.ts";

const route = useRoute();
const useCesium = useDashboardCesium;
const dashboardStore = useDashboardStore();

const itemGeometry = route.query.geometry as string | undefined

const inited = ref(false)
const init = () => {
  const cacheData = dashboardStore.getCurrentCacheData<UserFlightRestrictionZoneUserApplyDto>(0);
  if (cacheData) {
    objectUtils.copyObject(form.value, cacheData)
  }
  if (itemGeometry && regularUtils.RegTest(regularUtils.REGEX_DCTS_GEOMETRY, itemGeometry)) {
    form.value.geometry = itemGeometry
  }
  val1.value = form.value.startTime ? new Date(form.value.startTime).getTime() : null
  val2.value = form.value.endTime ? new Date(form.value.endTime).getTime() : null
  if (form.value.aircraftId) {
    userLowAltitudeAircraftApi.selectByIds(form.value.aircraftId.split(',').filter(_ => _).map(Number)).then(res => {
      selectOption.value = res.map(item => ({label: item.aircraftName, value: item.id}))
    })
  }
  inited.value = true
  dashboardStore.setCurrentCacheData<UserFlightRestrictionZoneUserApplyDto>(0, form.value)
}

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
watch(form.value, () => {
  if (!inited.value) {
    return
  }
  dashboardStore.setCurrentCacheData<UserFlightRestrictionZoneUserApplyDto>(0, form.value)
})
const dCon = () => {
  dialogFormRef.value?.validate(errors => {
    if (errors) {
      return
    }
    formLoading.value = true
    userFlightRestrictionZoneUserApplyApi.insertOne(form.value).then(_ => {
      gotoDashboardHome()
    }).finally(() => {
      formLoading.value = false
    })
  })
}

const mapPoint = () => {
  useCesium.setEditType(EDIT_TYPE_ENUM.INS_APPLY_AIRSPACE)
  gotoDashboardHome()
}

onMounted(() => {
  useCesium.previewFlightRestrictionZone(pointsss.value)
})
onBeforeUnmount(() => {
  useCesium.previewFlightRestrictionZone(pointsss.value, true)
})
const pointsss = ref<[number, number][]>([])
const setPointsss = (geometry: string) => {
  pointsss.value = geometry.split(', ').map(str => str.split(' ').map(Number)).map(pos => [pos[0], pos[1]])
}
if (itemGeometry && regularUtils.RegTest(regularUtils.REGEX_DCTS_GEOMETRY, itemGeometry)) {
  setPointsss(itemGeometry)
}
watchEffect(() => {
  if (pointsss.value.length === 0) {
    return
  }
  const geometryStr = pointsss.value.map(poi => poi.join(' ')).join(', ')
  form.value.geometry = geometryStr
  useCesium.previewFlightRestrictionZone(pointsss.value)
})

const selectValue = ref<number[]>([])
const selectChange = (val: number[]) => {
  selectValue.value = val;
  form.value.aircraftId = selectValue.value.join(',')
}
watch(() => form.value.aircraftId, () => {
  selectValue.value = form.value.aircraftId.split(',').filter(_ => _).map(Number)
})
const selectLoading = ref(false)
const selectOption = ref<{ label: string, value: number }[]>([])
const handleSearch = (query: string) => {
  if (query) {
    userLowAltitudeAircraftApi.selectAll({aircraftName: query}).then(res => {
      selectOption.value = res.map(item => ({label: item.aircraftName, value: item.id}))
    })
  } else {
    selectOption.value = []
  }
}
const val1 = ref<number | null>(null)
const val2 = ref<number | null>(null)
const update1 = (value: number | null) => {
  val1.value = value
  form.value.startTime = value ? new Date(value).toISOString() : ''
}
const update2 = (value: number | null) => {
  val2.value = value
  form.value.endTime = value ? new Date(value).toISOString() : ''
}
</script>

<template>
  <FormPanelCard
      :if-ins="true"
      :if-upd="false"
      :if-del="false"
      :loading="formLoading"
      :run-init="init"
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
          <n-select
              v-model:value="selectValue"
              :placeholder="userFlightRestrictionZoneUserApplyDict.aircraftId"
              multiple
              filterable
              remote
              :options="selectOption"
              :loading="selectLoading"
              @search="handleSearch"
              :on-update:value="selectChange"
          />
        </n-form-item>
        <n-form-item path="taskName" :label="userFlightRestrictionZoneUserApplyDict.taskName">
          <n-input v-model:value="form.taskName" :placeholder="userFlightRestrictionZoneUserApplyDict.taskName"/>
        </n-form-item>
        <n-form-item class="no-padding-right" path="geometry" :label="userFlightRestrictionZoneUserApplyDict.geometry">
          <n-input v-model:value="form.geometry" :placeholder="userFlightRestrictionZoneUserApplyDict.geometry" disabled>
            <template #suffix>
              <n-button @click="mapPoint">地图选点</n-button>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="startTime" :label="userFlightRestrictionZoneUserApplyDict.startTime">
          <n-date-picker v-model:value="val1" :placeholder="userFlightRestrictionZoneUserApplyDict.startTime"
                         type="datetime" clearable :on-update:value="update1"/>
        </n-form-item>
        <n-form-item path="endTime" :label="userFlightRestrictionZoneUserApplyDict.endTime">
          <n-date-picker v-model:value="val2" :placeholder="userFlightRestrictionZoneUserApplyDict.endTime"
                         type="datetime" clearable :on-update:value="update2"/>
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