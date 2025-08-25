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
import { signalLightInfoDict } from "@/dict/module/dcts/signalLight/signalLightInfo.ts";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoApi } from "@/api/module/dcts/signalLight/signalLightInfo.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const message = useMessage();

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemClid = route.query.clid as string | undefined
if (ifIns && !itemClid) {
  gotoDashboardHome()
}
if (ifUpd) {
  gotoDashboardHome()
}
if (ifDel) {
  gotoDashboardHome()
}

// 子信号灯信息
const signalLightInfo = ref(new SignalLightInfoDto())
const getSLCI = () => {
  if (!itemClid) {
    return
  }
  signalLightInfoApi.selectById(itemClid).then(res => {
    if (res) {
      signalLightInfo.value = res
    }
  })
}

const init = () => {
  qzjc()
  getSLCI()
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
      <n-divider title-placement="left">子信号灯信息</n-divider>
      <n-form label-placement="left" >
        <n-grid>
          <n-gi :span="8">
            <n-form-item :label="signalLightInfoDict.name">
              {{ signalLightInfo.name }}
            </n-form-item>
          </n-gi>
          <n-gi :span="8">
            <n-form-item :label="signalLightInfoDict.description">
              {{ signalLightInfo.description }}
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>

      <n-divider title-placement="left">策略调度列表</n-divider>
      <n-spin :show="formLoading">
        <SelectSignalLightStrategySchedule
            v-if="visible2"
            :select-strategy-type-id="parentStrategyTypeId"
            :child-id="Number(itemClid)"
        />
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>

</style>