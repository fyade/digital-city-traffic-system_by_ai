<script setup lang="ts">
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { ref } from "vue";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { objectUtils } from "@dcts/common";

const useCesium = useDashboardCesium;
const allLayers = useCesium.allLayers;

const form = ref({
  mapLayer: '',
  dataLayer: [] as string[]
})
let form2 = deepClone(form.value)

const init = () => {
  form.value.mapLayer = useCesium.allLayers.currentIdOfBaseMap[1][0]
  form.value.dataLayer = useCesium.allLayers.currentIdOfRoadData[1]
  form2 = deepClone(form.value)
}
init()

const submit = () => {
  if (form.value.mapLayer !== form2.mapLayer) {
    useCesium.setLayer('baseMap', [form.value.mapLayer])
  }
  if (!objectUtils.ifSameArray(form.value.dataLayer, form2.dataLayer)) {
    useCesium.setLayer('roadData', form.value.dataLayer)
  }
  form2 = deepClone(form.value)
}
</script>

<template>
  <n-form label-placement="left" :model="form">
    <n-form-item label="影像底图">
      <n-radio-group v-model:value="form.mapLayer" name="mapLayer">
        <n-grid :y-gap="8" :cols="1">
          <n-gi v-for="item in allLayers.allLayersOfBaseMap" :key="item.id">
            <n-radio :value="item.id" :label="item.name"/>
          </n-gi>
        </n-grid>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="数据图层">
      <n-checkbox-group v-model:value="form.dataLayer">
        <n-grid :y-gap="8" :cols="1">
          <n-gi v-for="item in allLayers.allLayersOfRoadData" :key="item.id">
            <n-checkbox :value="item.id" :label="item.name"/>
          </n-gi>
        </n-grid>
      </n-checkbox-group>
    </n-form-item>
    <n-form-item>
      <n-button @click="submit">确认</n-button>
    </n-form-item>
  </n-form>
</template>

<style scoped>
</style>
