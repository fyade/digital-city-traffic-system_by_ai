<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watchEffect } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { FlightRouteDto } from "@/type/module/dcts/airspace/flightRoute.ts";
import { regularUtils } from "@dcts/common";
import { flightRouteApi } from "@/api/module/dcts/airspace/flightRoute.ts";
import { EDIT_TYPE_ENUM } from "@/views/dashboard/functionModules/constant.ts";
import FormPanelCard from "@/components/formPanelCard/index.vue";
import { flightRouteDict } from "@/dict/module/dcts/airspace/flightRoute.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemPath = route.query.path as string | undefined
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

const init = () => {
  if (ifUpd) {
    formLoading.value = true
    flightRouteApi.selectById(itemId!).then(res => {
      if (res) {
        form.value = res
      }
    }).finally(() => {
      formLoading.value = false
    })
  }
}

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new FlightRouteDto())
const formRules: FormRules = {
  name: [{required: true, trigger: 'change'}],
  path: [{required: true, trigger: 'change'}],
}
const dCon = () => {
  dialogFormRef.value?.validate(errors => {
    if (errors) {
      return
    }
    if (ifIns) {
      formLoading.value = true
      flightRouteApi.insertOne(form.value).then(_ => {
        useCesium.refreshScreenEntities({ifRefresh: true, module: ['asModule']})
        gotoDashboardHome()
      }).finally(() => {
        formLoading.value = false
      })
    }
    if (ifUpd) {
      formLoading.value = true
      flightRouteApi.updateOne(form.value).then(_ => {
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
  flightRouteApi.deleteList(Number(itemId)).then(_ => {
    useCesium.refreshScreenEntities({ifRefresh: true, module: ['asModule']})
    gotoDashboardHome()
  }).finally(() => {
    formLoading.value = false
  })
}

const mapPoint = () => {
  if (ifIns) {
    gotoDashboardHome()
    useCesium.setEditType(EDIT_TYPE_ENUM.INS_FLIGHT_ROUTE)
  }
  if (ifUpd) {
    gotoDashboardHome()
    useCesium.setEditType(EDIT_TYPE_ENUM.UPD_FLIGHT_ROUTE)
  }
}

onMounted(() => {
  useCesium.previewFlightRoute(pointsss.value)
})
onBeforeUnmount(() => {
  useCesium.previewFlightRoute(pointsss.value, true)
})
const pointsss = ref<[number, number, number][]>([])
if (itemPath && regularUtils.RegTest(regularUtils.REGEX_DCTS_PATH_Z, itemPath)) {
  pointsss.value = itemPath.split(', ').map(str => str.split(' ').map(Number)).map(pos => [pos[0], pos[1], pos[2]]);
}
watchEffect(() => {
  if (pointsss.value.length === 0) {
    return
  }
  const pointStr = pointsss.value.map(poi => poi.join(' ')).join(', ');
  form.value.path = pointStr
  useCesium.previewFlightRoute(pointsss.value)
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
          <n-form-item path="name" :label="flightRouteDict.name">
            <n-input v-model:value="form.name" :placeholder="flightRouteDict.name"/>
          </n-form-item>
          <n-form-item path="path" :label="flightRouteDict.path">
            <n-input v-model:value="form.path" :placeholder="flightRouteDict.path" disabled>
              <template #suffix>
                <n-button @click="mapPoint">地图选点</n-button>
              </template>
            </n-input>
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
    </template>
  </FormPanelCard>
</template>

<style scoped>
:deep(.n-input .n-input-wrapper) {
  padding-right: 0;
}
</style>