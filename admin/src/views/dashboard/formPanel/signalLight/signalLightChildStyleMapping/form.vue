<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { useMessage } from "naive-ui";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { ref } from "vue";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoApi } from "@/api/module/dcts/signalLight/signalLightInfo.ts";
import FormPanelCard from "@/components/formPanelCard/index.vue";
import { signalLightInfoDict } from "@/dict/module/dcts/signalLight/signalLightInfo.ts";
import SelectSignalLightStyle
  from "@/views/dashboard/formPanel/signalLight/signalLightChildStyleMapping/selectSignalLightStyle.vue";

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
  getSLCI()
}

const formLoading = ref(false)

const submitCallback = () => {
}
const selectRow = () => {}
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

      <n-divider title-placement="left">信号灯样式列表</n-divider>
      <n-spin :show="formLoading">
        <SelectSignalLightStyle
            :child-id="Number(itemClid)"
        />
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>

</style>