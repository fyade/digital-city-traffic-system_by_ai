<script setup lang="ts">
import { ref, watch } from "vue";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { ID_PREFIX_VEHICLE_REAL_TIME } from "@/views/dashboard/functionModules/constant.ts";
import { vehicleInfoApi } from "@/api/module/dcts/vehicle/vehicleInfo.ts";
import { VehicleInfoDto } from "@/type/module/dcts/vehicle/vehicleInfo.ts";
import { vehicleInfoDict } from "@/dict/module/dcts/vehicle/vehicleInfo.ts";

const cesiumClass = ref(useDashboardCesium)

const trackedEntityId = ref<string | null>(null)
const trackedEntityType = ref<string | null>(null)

const vehicleInfoRef = ref<VehicleInfoDto>(new VehicleInfoDto())

watch(() => cesiumClass.value.trackedEntityId, () => {
  trackedEntityId.value = cesiumClass.value.trackedEntityId
  trackedEntityType.value = null
  if (trackedEntityId.value && trackedEntityId.value.startsWith(ID_PREFIX_VEHICLE_REAL_TIME)) {
    trackedEntityType.value = ID_PREFIX_VEHICLE_REAL_TIME
    vehicleInfoApi.selectById(Number(trackedEntityId.value.replace(ID_PREFIX_VEHICLE_REAL_TIME, ''))).then(res => {
      vehicleInfoRef.value = res
    })
  }
})
const cancelTrackEntity = () => {
  cesiumClass.value.trackEntity(null)
}
</script>

<template>
  <n-card class="card" v-if="trackedEntityId">
    <n-grid :y-gap="20" :cols="1">

      <template v-if="trackedEntityType===ID_PREFIX_VEHICLE_REAL_TIME">
        <n-gi>
          <n-grid>
            <n-gi :span="8">实体类型</n-gi>
            <n-gi :span="16"><strong>车辆</strong></n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">实体id</n-gi>
            <n-gi :span="16">{{ trackedEntityId.replace(ID_PREFIX_VEHICLE_REAL_TIME, '') }}</n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">{{ vehicleInfoDict.plateNumber }}</n-gi>
            <n-gi :span="16">{{ vehicleInfoRef.plateNumber }}</n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">{{ vehicleInfoDict.vehicleType }}</n-gi>
            <n-gi :span="16">{{ vehicleInfoRef.vehicleType }}</n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">{{ vehicleInfoDict.brand }}</n-gi>
            <n-gi :span="16">{{ vehicleInfoRef.brand }}</n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">{{ vehicleInfoDict.color }}</n-gi>
            <n-gi :span="16">{{ vehicleInfoRef.color }}</n-gi>
          </n-grid>
        </n-gi>
        <n-gi>
          <n-button @click="cancelTrackEntity">取消跟踪</n-button>
        </n-gi>
      </template>

    </n-grid>
  </n-card>
</template>

<style scoped>
.card {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 320px;
}
</style>
