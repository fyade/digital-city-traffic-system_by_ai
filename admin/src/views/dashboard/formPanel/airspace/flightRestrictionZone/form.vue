<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { ref, useTemplateRef, watchEffect, watch, onMounted, onBeforeUnmount } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { FlightRestrictionZoneDto } from "@/type/module/dcts/airspace/flightRestrictionZone.ts";
import { flightRestrictionZoneApi } from "@/api/module/dcts/airspace/flightRestrictionZone.ts";
import FormPanelCard from "@/components/formPanelCard/index.vue";
import { flightRestrictionZoneDict } from "@/dict/module/dcts/airspace/flightRestrictionZone.ts";
import { regularUtils } from "@dcts/common";
import { DicDataDto } from "@/type/module/main/sysManage/dicData.ts";
import { useDictStore } from "@/store/module/dict.ts";
import { EDIT_TYPE_ENUM } from "@/views/dashboard/functionModules/constant.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { objectUtils } from "@dcts/common";

const route = useRoute();
const useCesium = useDashboardCesium;
const dictStore = useDictStore()
const dashboardStore = useDashboardStore();

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemGeometry = route.query.geometry as string | undefined
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

const inited = ref(false)
const init = () => {
  if (ifIns) {
    const cacheData = dashboardStore.getCurrentCacheData<FlightRestrictionZoneDto>(0)
    if (cacheData) {
      objectUtils.copyObject(form.value, cacheData, ['geometry'])
    }
    if (itemGeometry && regularUtils.RegTest(regularUtils.REGEX_DCTS_GEOMETRY, itemGeometry)) {
      form.value.geometry = itemGeometry
    }
    inited.value = true
    dashboardStore.setCurrentCacheData<FlightRestrictionZoneDto>(0, form.value)
  }
  if (ifUpd) {
    formLoading.value = true
    flightRestrictionZoneApi.selectById(itemId!).then(res => {
      if (res) {
        objectUtils.copyObject(form.value, res)
      }
      const cacheData = dashboardStore.getCurrentCacheData<FlightRestrictionZoneDto>(0)
      if (cacheData) {
        objectUtils.copyObject(form.value, cacheData, ['geometry'])
      }
      if (itemGeometry && regularUtils.RegTest(regularUtils.REGEX_DCTS_GEOMETRY, itemGeometry)) {
        form.value.geometry = itemGeometry
      }
    }).finally(() => {
      formLoading.value = false
      inited.value = true
      dashboardStore.setCurrentCacheData<FlightRestrictionZoneDto>(0, form.value)
    })
  }
}

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new FlightRestrictionZoneDto())
const formRules: FormRules = {
  name: [{required: true, trigger: 'change'}],
  code: [{required: true, trigger: 'change'}],
  type: [{required: true, trigger: 'change'}],
  geometry: [{required: true, trigger: 'change'}],
  descr: [{required: true, trigger: 'change'}],
}
watch(form.value, () => {
  if (!inited.value) {
    return
  }
  dashboardStore.setCurrentCacheData<FlightRestrictionZoneDto>(0, form.value)
})
const dCon = () => {
  dialogFormRef.value?.validate(errors => {
    if (errors) {
      return
    }
    if (ifIns) {
      formLoading.value = true
      flightRestrictionZoneApi.insertOne(form.value).then(_ => {
        useCesium.refreshScreenEntities({ifRefresh: true, module: ['asModule']})
        gotoDashboardHome()
      }).finally(() => {
        formLoading.value = false
      })
    }
    if (ifUpd) {
      formLoading.value = true
      flightRestrictionZoneApi.updateOne(form.value).then(_ => {
        useCesium.refreshScreenEntities({ifRefresh: true, module: ['asModule']})
        gotoDashboardHome()
      }).finally(() => {
        formLoading.value = false
      })
    }
  })
}
const submitCallback = () => {
  formLoading.value = true
  flightRestrictionZoneApi.deleteList(Number(itemId)).then(_ => {
    useCesium.refreshScreenEntities({ifRefresh: true, module: ['asModule']})
    gotoDashboardHome()
  }).finally(() => {
    formLoading.value = false
  })
}

const dict = dictStore.getDict('dcts:airspace:type');
const airspaceTypes = ref<DicDataDto[]>([])
watchEffect(() => {
  if (dict.isLoading.value) {
  } else if (dict.error.value) {
  } else {
    airspaceTypes.value = dict.data.value
  }
})
const mapPoint = () => {
  if (ifIns) {
    useCesium.setEditType(EDIT_TYPE_ENUM.INS_FLIGHT_RESTRICTION_ZONE)
    gotoDashboardHome()
  }
  if (ifUpd) {
    useCesium.setEditType(EDIT_TYPE_ENUM.UPD_FLIGHT_RESTRICTION_ZONE)
    gotoDashboardHome()
  }
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
</script>

<template>
  <FormPanelCard
      :if-ins="ifIns"
      :if-upd="ifUpd"
      :if-del="ifDel"
      :loading="formLoading"
      @submit-callback="submitCallback"
      :run-init="init"
      preset="drawer"
  >
    <template v-if="ifIns || ifUpd">
      <n-spin :show="formLoading">
        <n-form
            ref="dialogFormRef"
            label-placement="left"
            label-width="auto"
            :model="form"
            :rules="formRules"
        >
          <n-form-item path="name" :label="flightRestrictionZoneDict.name">
            <n-input v-model:value="form.name" :placeholder="flightRestrictionZoneDict.name"/>
          </n-form-item>
          <n-form-item path="code" :label="flightRestrictionZoneDict.code">
            <n-input v-model:value="form.code" :placeholder="flightRestrictionZoneDict.code"/>
          </n-form-item>
          <n-form-item path="type" :label="flightRestrictionZoneDict.type">
            <!--<n-input v-model:value="form.type" :placeholder="flightRestrictionZoneDict.type"/>-->
            <n-select v-model:value="form.type" :options="airspaceTypes" clearable filterable/>
          </n-form-item>
          <n-form-item class="no-padding-right" path="geometry" :label="flightRestrictionZoneDict.geometry">
            <n-input v-model:value="form.geometry" :placeholder="flightRestrictionZoneDict.geometry" disabled>
              <template #suffix>
                <n-button @click="mapPoint">地图选点</n-button>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="descr" :label="flightRestrictionZoneDict.descr">
            <n-input v-model:value="form.descr" :placeholder="flightRestrictionZoneDict.descr"/>
          </n-form-item>
          <div class="box-flex-end">
            <n-button secondary type="primary" @click="dCon">确认</n-button>
          </div>
        </n-form>
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>
</style>