<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch, watchEffect } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { objectUtils, regularUtils } from "@dcts/common";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { EDIT_TYPE_ENUM } from "@/views/dashboard/functionModules/constant.ts";
import { UserFlightRouteUserApplyDto } from "@/type/module/dcts/airspace/userFlightRouteUserApply.ts";
import { userLowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/userLowAltitudeAircraft.ts";
import { userFlightRouteUserApplyApi } from "@/api/module/dcts/airspace/userFlightRouteUserApply.ts";
import { userFlightRouteUserApplyDict } from "@/dict/module/dcts/airspace/userFlightRouteUserApply.ts";

const route = useRoute();
const useCesium = useDashboardCesium;
const dashboardStore = useDashboardStore();

const itemPath = route.query.path as string | undefined

const inited = ref(false)
const init = () => {
  const cacheData = dashboardStore.getCurrentCacheData<UserFlightRouteUserApplyDto>(0);
  if (cacheData) {
    objectUtils.copyObject(form.value, cacheData)
  }
  if (itemPath && regularUtils.RegTest(regularUtils.REGEX_DCTS_PATH_Z, itemPath)) {
    form.value.path = itemPath
  }
  val1.value = form.value.startTime ? new Date(form.value.startTime).getTime() : null
  val2.value = form.value.endTime ? new Date(form.value.endTime).getTime() : null
  if (form.value.aircraftId) {
    userLowAltitudeAircraftApi.selectByIds(form.value.aircraftId.split(',').filter(_ => _).map(Number)).then(res => {
      selectOption.value = res.map(item => ({label: item.aircraftName, value: item.id}))
    })
  }
  inited.value = true
  dashboardStore.setCurrentCacheData<UserFlightRouteUserApplyDto>(0, form.value);
}

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new UserFlightRouteUserApplyDto())
const formRules: FormRules = {
  aircraftId: [{required: true, trigger: 'change'}],
  taskName: [{required: true, trigger: 'change'}],
  path: [{required: true, trigger: 'change'}],
  startTime: [{required: true, trigger: 'change'}],
  endTime: [{required: true, trigger: 'change'}],
}
watch(form.value, () => {
  if (!inited.value) {
    return
  }
  dashboardStore.setCurrentCacheData<UserFlightRouteUserApplyDto>(0, form.value);
})
const dCon = () => {
  dialogFormRef.value?.validate(errors => {
    if (errors) {
      return
    }
    formLoading.value = true
    userFlightRouteUserApplyApi.insertOne(form.value).then(_ => {
      gotoDashboardHome()
    }).finally(() => {
      formLoading.value = false
    })
  })
}

const mapPoint = () => {
  useCesium.setEditType(EDIT_TYPE_ENUM.INS_APPLY_FLIGHT_ROUTE)
  gotoDashboardHome()
}

onMounted(() => {
  useCesium.previewFlightRoute(pointsss.value)
})
onBeforeUnmount(() => {
  useCesium.previewFlightRoute(pointsss.value, true)
})
const pointsss = ref<[number, number, number][]>([])
const setPointsss = (path: string) => {
  pointsss.value = path.split(', ').map(str => str.split(' ').map(Number)).map(pos => [pos[0], pos[1], pos[2]])
}
if (itemPath && regularUtils.RegTest(regularUtils.REGEX_DCTS_PATH_Z, itemPath)) {
  setPointsss(itemPath)
}
watchEffect(() => {
  if (pointsss.value.length === 0) {
    return
  }
  const pointStr = pointsss.value.map(poi => poi.join(' ')).join(', ');
  form.value.path = pointStr
  useCesium.previewFlightRoute(pointsss.value)
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
        <n-form-item path="aircraftId" :label="userFlightRouteUserApplyDict.aircraftId">
          <n-select
              v-model:value="selectValue"
              :placeholder="userFlightRouteUserApplyDict.aircraftId"
              multiple
              filterable
              remote
              :options="selectOption"
              :loading="selectLoading"
              @search="handleSearch"
              :on-update:value="selectChange"
          />
        </n-form-item>
        <n-form-item path="taskName" :label="userFlightRouteUserApplyDict.taskName">
          <n-input v-model:value="form.taskName" :placeholder="userFlightRouteUserApplyDict.taskName"/>
        </n-form-item>
        <n-form-item class="no-padding-right" path="path" :label="userFlightRouteUserApplyDict.path">
          <n-input v-model:value="form.path" :placeholder="userFlightRouteUserApplyDict.path" disabled>
            <template #suffix>
              <n-button @click="mapPoint">地图选点</n-button>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="startTime" :label="userFlightRouteUserApplyDict.startTime">
          <n-date-picker v-model:value="val1" :placeholder="userFlightRouteUserApplyDict.startTime"
                         type="datetime" clearable :on-update:value="update1"/>
        </n-form-item>
        <n-form-item path="endTime" :label="userFlightRouteUserApplyDict.endTime">
          <n-date-picker v-model:value="val2" :placeholder="userFlightRouteUserApplyDict.endTime"
                         type="datetime" clearable :on-update:value="update2"/>
        </n-form-item>
        <template v-for="(item, index) in pointsss" :key="index">
          <n-form-item :label="`第${index+1}个点的高度`">
            <n-input-number v-model:value="pointsss[index][2]" :precision="2"/>
          </n-form-item>
        </template>
        <div class="box-flex-end">
          <n-button secondary type="primary" @click="dCon">确认</n-button>
        </div>
      </n-form>
    </n-spin>
  </FormPanelCard>
</template>

<style scoped>
</style>