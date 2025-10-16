<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { useRoute } from "vue-router";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoDict } from "@/dict/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoApi, signalLightGroupInfoDelV2 } from "@/api/module/dcts/signalLight/signalLightGroupInfo.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { EDIT_TYPE_ENUM } from "@/views/dashboard/functionModules/constant.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemXy = route.query.xy as string | undefined
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

const init = () => {
  if (ifIns) {
    form.value.location = `${useCesium.mouseClickPosition[0]},${useCesium.mouseClickPosition[1]}`
  }
  if (ifUpd) {
    formLoading.value = true
    signalLightGroupInfoApi.selectById(itemId!).then(res => {
      if (res) {
        form.value = res
      }
      if (itemXy) {
        form.value.location = `${useCesium.mouseClickPosition[0]},${useCesium.mouseClickPosition[1]}`
      }
    }).finally(() => {
      formLoading.value = false
    })
  }
}

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new SignalLightGroupInfoDto())
const formRules: FormRules = {
  name: [{required: true, trigger: 'change'}],
  location: [{required: true, trigger: 'change'}],
  description: [{required: true, trigger: 'change'}],
}
const dCon = () => {
  dialogFormRef.value?.validate(errors => {
    if (errors) {
      return
    }
    if (ifIns) {
      formLoading.value = true
      signalLightGroupInfoApi.insertOne(form.value).then(_ => {
        useCesium.refreshScreenEntities({ifRefresh: true, module: ['slModule']})
        gotoDashboardHome()
      }).finally(() => {
        formLoading.value = false
      })
    }
    if (ifUpd) {
      formLoading.value = true
      signalLightGroupInfoApi.updateOne(form.value).then(_ => {
        useCesium.refreshScreenEntities({ifRefresh: true, module: ['slModule']})
        gotoDashboardHome()
      }).finally(() => {
        formLoading.value = false
      })
    }
  })
}
const submitCallback = () => {
  formLoading.value = true
  signalLightGroupInfoDelV2(Number(itemId)).then(_ => {
    useCesium.refreshScreenEntities({ifRefresh: true, module: ['slModule']})
    gotoDashboardHome()
  }).finally(() => {
    formLoading.value = false
  })
}

const mapPoint = () => {
  if (ifIns) {
    gotoDashboardHome()
    useCesium.setEditType(EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT_GROUP)
  }
  if (ifUpd) {
    gotoDashboardHome()
    useCesium.setEditType(EDIT_TYPE_ENUM.UPD_SIGNAL_LIGHT_GROUP)
  }
}
</script>

<template>
  <FormPanelCard
      :if-ins="ifIns"
      :if-upd="ifUpd"
      :if-del="ifDel"
      :loading="formLoading"
      @submit-callback="submitCallback"
      :run-init="init"
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
          <n-form-item path="name" :label="signalLightGroupInfoDict.name">
            <n-input v-model:value="form.name" :placeholder="signalLightGroupInfoDict.name"/>
          </n-form-item>
          <n-form-item path="location" :label="signalLightGroupInfoDict.location">
            <n-input v-model:value="form.location" :placeholder="signalLightGroupInfoDict.location" disabled>
              <template #suffix>
                <n-button @click="mapPoint">地图选点</n-button>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="description" :label="signalLightGroupInfoDict.description">
            <n-input v-model:value="form.description" :placeholder="signalLightGroupInfoDict.description"/>
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
:deep(.n-input .n-input-wrapper) {
  padding-right: 0;
}
</style>