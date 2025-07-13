<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { FormInst, FormRules, useMessage } from "naive-ui";
import { useRoute } from "vue-router";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { signalLightGroupChildMappingApi } from "@/api/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { signalLightGroupStrategyTypeMappingApi } from "@/api/module/dcts/signalLightStrategy/signalLightGroupStrategyTypeMapping.ts";
import SelectSignalLightStrategySchedule from "@/views/dashboard/formPanel/signalLightStrategy/signalLightChildStrategyScheduleMapping/selectSignalLightStrategySchedule.vue";
import { SignalLightStrategyScheduleDto } from "@/type/module/dcts/signalLightStrategy/signalLightStrategySchedule.ts";
import { SignalLightChildStrategyScheduleMappingInsDto } from "@/type/module/dcts/signalLightStrategy/signalLightChildStrategyScheduleMapping.ts";
import { signalLightChildStrategyScheduleMappingInsV2 } from "@/api/module/dcts/signalLightStrategy/signalLightChildStrategyScheduleMapping.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const message = useMessage();

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemClid = route.query.clid as string | undefined
if (ifIns && !itemClid) {
  gotoDashboardHome()
}
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

const init = () => {
  qzjc()
}

const formLoading = ref(false)
const parentStrategyTypeId = ref<number[]>([])
const visible2 = ref(false)

const qzjc = async () => {
  formLoading.value = true
  const slgcms = await signalLightGroupChildMappingApi.selectAll({childLightId: {in: {value: [Number(itemClid)]}}});
  const gids = slgcms.map(item => item.groupId);
  const slgstms = await signalLightGroupStrategyTypeMappingApi.selectAll({groupId: {in: {value: gids}}});
  formLoading.value = false
  if (slgstms.length === 0) {
    message.warning('请先给信号灯组绑定信号灯策略类型。')
    gotoDashboardHome()
    return
  }
  parentStrategyTypeId.value = slgstms.map(item => item.strategyTypeId);
  visible2.value = true
}

const submitCallback = () => {
}
const selectRow = (row: SignalLightStrategyScheduleDto) => {
  formLoading.value = true
  const dto = new SignalLightChildStrategyScheduleMappingInsDto()
  dto.childLightId = Number(itemClid)
  dto.strategyScheduleId = row.id
  signalLightChildStrategyScheduleMappingInsV2(dto).then(_ => {
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
        <SelectSignalLightStrategySchedule
            v-if="visible2"
            :select-strategy-type-id="parentStrategyTypeId"
            :child-id="Number(itemClid)"
            @select-row="selectRow"
        />
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>

</style>