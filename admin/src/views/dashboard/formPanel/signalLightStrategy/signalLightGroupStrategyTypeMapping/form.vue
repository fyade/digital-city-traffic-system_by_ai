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
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoApi } from "@/api/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoDict } from "@/dict/module/dcts/signalLight/signalLightGroupInfo.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemSlgid = route.query.slgid as string | undefined
if (ifIns && !itemSlgid) {
  gotoDashboardHome()
}
if (ifUpd) {
  gotoDashboardHome()
}
if (ifDel) {
  gotoDashboardHome()
}

// 信号灯组信息
const signalLightGroupInfo = ref(new SignalLightGroupInfoDto())
const getSLGI = () => {
  if (!itemSlgid) {
    return
  }
  signalLightGroupInfoApi.selectById(itemSlgid).then(res => {
    signalLightGroupInfo.value = res
  })
}

const init = () => {
  getSLGI()
}

const formLoading = ref(false)

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
      <n-divider title-placement="left">信号灯组信息</n-divider>
      <n-form label-placement="left">
        <n-grid>
          <n-gi :span="8">
            <n-form-item :label="signalLightGroupInfoDict.name">
              {{ signalLightGroupInfo.name }}
            </n-form-item>
          </n-gi>
          <n-gi :span="8">
            <n-form-item :label="signalLightGroupInfoDict.description">
              {{ signalLightGroupInfo.description }}
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>

      <n-divider title-placement="left">策略类型列表</n-divider>
      <n-spin :show="formLoading">
        <SelectSignalLightStrategyType
            :group-id="Number(itemSlgid)"
        />
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>

</style>