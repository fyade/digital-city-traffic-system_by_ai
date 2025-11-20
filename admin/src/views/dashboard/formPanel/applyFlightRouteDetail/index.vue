<script setup lang="ts">
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { useRoute } from "vue-router";
import { onBeforeUnmount, ref } from "vue";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { fileBaseUrl } from "@/api/request.ts";
import { base, timeUtils } from '@dcts/common'
import { userLowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/userLowAltitudeAircraft.ts";
import { UserLowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/userLowAltitudeAircraft.ts";
import { userFlightRouteUserApplyApi } from "@/api/module/dcts/airspace/userFlightRouteUserApply.ts";
import { userFlightRouteUserApplyDict } from "@/dict/module/dcts/airspace/userFlightRouteUserApply.ts";
import { UserFlightRouteUserApplyDto } from "@/type/module/dcts/airspace/userFlightRouteUserApply.ts";

const useCesium = useDashboardCesium
const sysStore = useSysStore()
const route = useRoute()

onBeforeUnmount(() => {
  useCesium.previewFlightRoute2({ifDelete: true})
})

const itemId = route.query.id as string | undefined
if (!itemId) {
  gotoDashboardHome()
}

const dataForm = ref(new UserFlightRouteUserApplyDto())
const tableLoadingRef = ref(false)
const allAircrafts = ref<UserLowAltitudeAircraftDto[]>([])
const init = () => {
  tableLoadingRef.value = true
  userFlightRouteUserApplyApi.selectById(Number(itemId)).then(res => {
    if (res) {
      dataForm.value = res
      userLowAltitudeAircraftApi.selectByIds(dataForm.value.aircraftId.split(',').map(Number)).then(res => {
        allAircrafts.value = res
      })
    }
  }).finally(() => {
    tableLoadingRef.value = false
  })
}
const openFile = (filename: string) => {
  window.open(sysStore.urlAddAuth(`${fileBaseUrl}${filename}`))
}
const showInMap = () => {
  useCesium.previewFlightRoute2({
    points: dataForm.value.path.split(', ').map(str => str.split(' ').map(Number)).map(pos => [pos[0], pos[1], pos[2]])
  })
}
</script>

<template>
  <FormPanelCard
      :if-ins="false"
      :if-upd="false"
      :if-del="false"
      :loading="tableLoadingRef"
      preset="drawer"
      :run-init="init"
  >
    <n-spin :show="tableLoadingRef">
      <n-form label-placement="left">
        <n-grid>
          <n-gi :span="24">
            <n-form-item path="aircraftId" :label="userFlightRouteUserApplyDict.aircraftId">
              <template v-if="dataForm.aircraftId">
                <n-tag v-for="aid in dataForm.aircraftId.split(',').map(Number)" :key="aid">
                  {{ allAircrafts.find(item => item.id === aid)?.aircraftName }}
                </n-tag>
              </template>
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid>
          <n-gi :span="24">
            <n-form-item path="taskName" :label="userFlightRouteUserApplyDict.taskName">
              {{ dataForm.taskName }}
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid>
          <n-gi :span="12">
            <n-form-item path="startTime" :label="userFlightRouteUserApplyDict.startTime">
              {{ timeUtils.formatDate(new Date(dataForm.startTime)) }}
            </n-form-item>
          </n-gi>
          <n-gi :span="12">
            <n-form-item path="endTime" :label="userFlightRouteUserApplyDict.endTime">
              {{ timeUtils.formatDate(new Date(dataForm.endTime)) }}
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid>
          <n-gi :span="12">
            <n-form-item path="applyStatus" :label="userFlightRouteUserApplyDict.applyStatus">
              {{ base.aFRASTypeDict[dataForm.applyStatus as base.AFRASTypeEnum] }}
            </n-form-item>
          </n-gi>
          <n-gi :span="12">
            <n-form-item path="files" :label="userFlightRouteUserApplyDict.files">
              <p class="download" @click="openFile(dataForm.files)">点击下载</p>
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid>
          <n-gi :span="24">
            <n-form-item path="applyOpinion" :label="userFlightRouteUserApplyDict.applyOpinion">
              {{ dataForm.applyOpinion }}
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-space>
          <n-button type="info" @click="showInMap">在地图上显示航线</n-button>
        </n-space>
      </n-form>
    </n-spin>
  </FormPanelCard>
</template>

<style scoped>
.download {
  font-style: oblique;
  text-decoration: underline;
  cursor: pointer;
}
</style>