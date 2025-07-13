<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { useRoute } from "vue-router";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { SignalLightGroupStrategyTypeMappingDto, SignalLightGroupStrategyTypeMappingInsDto } from "@/type/module/dcts/signalLightStrategy/signalLightGroupStrategyTypeMapping.ts";
import { signalLightGroupStrategyTypeMappingApi, signalLightGroupStrategyTypeMappingInsV2 } from "@/api/module/dcts/signalLightStrategy/signalLightGroupStrategyTypeMapping.ts";
import SelectSignalLightStrategyType from "@/views/dashboard/formPanel/signalLightStrategy/signalLightGroupStrategyTypeMapping/selectSignalLightStrategyType.vue";
import { SignalLightStrategyTypeDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategyType.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemSlgid = route.query.slgid as string | undefined
if (ifIns && !itemSlgid) {
  gotoDashboardHome()
}
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

const init = () => {
}

const formLoading = ref(false)

const submitCallback = () => {
  formLoading.value = true
  signalLightGroupStrategyTypeMappingApi.deleteList(itemId!).then(_ => {
    useCesium.refreshScreenEntities(true)
    gotoDashboardHome()
  }).finally(() => {
    formLoading.value = false
  })
}
const selectRow = (row: SignalLightStrategyTypeDto) => {
  formLoading.value = true
  const dto = new SignalLightGroupStrategyTypeMappingInsDto();
  dto.groupId = Number(itemSlgid)
  dto.strategyTypeId = row.id
  signalLightGroupStrategyTypeMappingInsV2(dto).then(_ => {
    gotoDashboardHome()
  }).finally(() => {
    formLoading.value = false
  })
}
</script>

<template>
  <FormPanelCard
      :if-ins="ifIns"
      :if-upd="ifUpd"
      :if-del="ifDel"
      :loading="formLoading"
      :wider="true"
      @submit-callback="submitCallback"
      :run-init="init"
  >
    <template v-if="ifIns || ifUpd">
      <n-spin :show="formLoading">
        <SelectSignalLightStrategyType
            :group-id="Number(itemSlgid)"
            @select-row="selectRow"
        />
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>

</style>