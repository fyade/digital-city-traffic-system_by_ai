<script setup lang="ts">
import { ref } from "vue";
import { Close } from '@vicons/ionicons5'
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import {
  EDIT_TYPE_DICT,
  EDIT_TYPE_ENUM,
  ID_PREFIX_VEHICLE_REAL_TIME
} from "@/views/dashboard/functionModules/constant.ts";
import { vehicleInfoApi } from "@/api/module/dcts/vehicle/vehicleInfo.ts";
import { VehicleInfoDto } from "@/type/module/dcts/vehicle/vehicleInfo.ts";
import { vehicleInfoDict } from "@/dict/module/dcts/vehicle/vehicleInfo.ts";
import { queryVehicleTrajectoryDict } from "@/dict/module/dcts/spatialData.ts";
import { DrawedVehicleTrajectoryClass } from "@/views/dashboard/utils/class.ts";

const cesiumClass = useDashboardCesium

// 正在编辑
const ifEditing = ref(false)
cesiumClass.setSetIfEditingCB(data => ifEditing.value = data)
const editType = ref<EDIT_TYPE_ENUM>(EDIT_TYPE_ENUM.DEFAULT)
cesiumClass.setSetEditTypeCB(data => editType.value = data)

// 聚焦实体,车辆轨迹
const drawedVehicleTrajectoryIds = ref<DrawedVehicleTrajectoryClass[]>([])
cesiumClass.setSetDrawedVehicleTrajectoryIdsCB(data => {
  drawedVehicleTrajectoryIds.value = data
  watchDrawedVehicleTrajectoryIds()
})

const trackedEntityId = ref<string | null>(null)
const trackedEntityType = ref<string | null>(null)
cesiumClass.setSetTrackedEntityIdCB(data => {
  trackedEntityId.value = data
  trackedEntityType.value = null
  if (trackedEntityId.value && trackedEntityId.value.startsWith(ID_PREFIX_VEHICLE_REAL_TIME)) {
    trackedEntityType.value = ID_PREFIX_VEHICLE_REAL_TIME
    vehicleInfoApi.selectById(Number(trackedEntityId.value.replace(ID_PREFIX_VEHICLE_REAL_TIME, ''))).then(res => {
      if (res) {
        vehicleInfoRef.value = res
      }
    })
  }
})

const vehicleInfoRef = ref<VehicleInfoDto>(new VehicleInfoDto())

const cancelTrackEntity = () => {
  cesiumClass.trackEntity(null)
}

const vals1 = ref<boolean[]>([])
const watchDrawedVehicleTrajectoryIds = () => {
  const number = drawedVehicleTrajectoryIds.value.length - vals1.value.length;
  if (number > 0) {
    for (let i = 0; i < number; i++) {
      vals1.value.push(true)
    }
  }
}
const close1 = (index: number) => {
  vals1.value.splice(index, 1)
  const cesiumLineId = drawedVehicleTrajectoryIds.value[index].cesiumLineId;
  cesiumClass.closeVehicleTrajectory(cesiumLineId)
}
const update1 = (index: number) => {
  vals1.value[index] = !vals1.value[index]
  const cesiumLineId = drawedVehicleTrajectoryIds.value[index].cesiumLineId;
  if (vals1.value[index]) {
    cesiumClass.setVehicleTrajectoryOpacity(cesiumLineId, 1)
  } else {
    cesiumClass.setVehicleTrajectoryOpacity(cesiumLineId, 0)
  }
}

// 限飞区
const endInsFlightRestrictionZone = () => {
  cesiumClass.endInsFlightRestrictionZone()
}
</script>

<template>
  <n-card
      class="card"
      v-if="
        ifEditing
        || trackedEntityId
        || drawedVehicleTrajectoryIds.length > 0
      "
  >
    <n-grid :y-gap="20" :cols="1">

      <template v-if="ifEditing">
        <n-gi>
          <n-divider style="margin: 0;" title-placement="left">
            <span>正在{{ EDIT_TYPE_DICT[editType] }}</span>
          </n-divider>
        </n-gi>
        <n-gi
            v-if="[EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE, EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE].includes(editType)"
        >
          <n-button @click="endInsFlightRestrictionZone">点击完成限飞区绘制</n-button>
        </n-gi>
      </template>

      <template v-if="trackedEntityType===ID_PREFIX_VEHICLE_REAL_TIME">
        <n-gi>
          <n-divider style="margin: 0;" title-placement="left">聚焦实体</n-divider>
        </n-gi>
        <n-gi>
          <n-grid>
            <n-gi :span="8">实体类型</n-gi>
            <n-gi :span="16"><strong>车辆</strong></n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">实体id</n-gi>
            <n-gi :span="16">{{ trackedEntityId?.replace(ID_PREFIX_VEHICLE_REAL_TIME, '') }}</n-gi>
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

      <template v-if="drawedVehicleTrajectoryIds.length>0">
        <n-gi>
          <n-divider style="margin: 0;" title-placement="left">车辆轨迹</n-divider>
        </n-gi>
        <n-gi v-for="(item, index) in drawedVehicleTrajectoryIds" :key="index">
          <n-grid>
            <n-gi :span="8">轨迹{{ index + 1 }}</n-gi>
            <n-gi :span="16">
              <div class="box-flex-end">
                <n-icon style="cursor: pointer;" @click="close1(index)">
                  <Close/>
                </n-icon>
              </div>
            </n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">{{ queryVehicleTrajectoryDict.plateNumber }}</n-gi>
            <n-gi :span="16">{{ item.plateNumber }}</n-gi>
          </n-grid>
          <n-grid>
            <n-gi :span="8">是否显示</n-gi>
            <n-gi :span="16">
              <n-switch :value="vals1[index]" @update:value="update1(index)"/>
            </n-gi>
          </n-grid>
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
