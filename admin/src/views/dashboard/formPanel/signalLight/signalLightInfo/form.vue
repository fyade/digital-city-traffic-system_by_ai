<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { useRoute } from "vue-router";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { SignalLightInfoDto, SignalLightInfoInsDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoApi } from "@/api/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoDict } from "@/dict/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightGroupChildMappingApi } from "@/api/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { SignalLightGroupChildMappingInsDto } from "@/type/module/dcts/signalLight/signalLightGroupChildMapping.ts";

const route = useRoute();
const useCesium = useDashboardCesium;

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemPid = route.query.pid as string | undefined
if (ifIns && !itemPid) {
  gotoDashboardHome()
}
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

nextTick(() => {
  if (ifIns) {
    form.value.location = `${useCesium.mouseClickPosition[0]},${useCesium.mouseClickPosition[1]}`
  }
  if (ifUpd) {
    formLoading.value = true
    signalLightInfoApi.selectById(itemId!).then(res => {
      form.value = res
    }).finally(() => {
      formLoading.value = false
    })
  }
})

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new SignalLightInfoDto())
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
      signalLightInfoApi.insertOne(form.value).then(res => {
        const dto = new SignalLightGroupChildMappingInsDto();
        dto.groupId = Number(itemPid)
        dto.childLightId = res.id
        signalLightGroupChildMappingApi.insertOne(dto).then(_ => {
          useCesium.refreshScreenEntities(true)
          gotoDashboardHome()
        }).finally(() => {
          formLoading.value = false
        })
      }).finally(() => {
        formLoading.value = false
      })
    }
    if (ifUpd) {
      formLoading.value = true
      signalLightInfoApi.updateOne(form.value).then(_ => {
        useCesium.refreshScreenEntities(true)
        gotoDashboardHome()
      }).finally(() => {
        formLoading.value = false
      })
    }
  })
}
const submitCallback = () => {
  formLoading.value = true
  signalLightInfoApi.deleteList(itemId!).then(_ => {
    useCesium.refreshScreenEntities(true)
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
      @submit-callback="submitCallback"
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
          <n-form-item path="name" :label="signalLightInfoDict.name">
            <n-input v-model:value="form.name" :placeholder="signalLightInfoDict.name"/>
          </n-form-item>
          <n-form-item path="location" :label="signalLightInfoDict.location">
            <n-input v-model:value="form.location" :placeholder="signalLightInfoDict.location" disabled/>
          </n-form-item>
          <n-form-item path="description" :label="signalLightInfoDict.description">
            <n-input v-model:value="form.description" :placeholder="signalLightInfoDict.description"/>
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