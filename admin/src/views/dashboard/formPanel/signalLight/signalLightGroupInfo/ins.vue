<script setup lang="ts">
import { inject, nextTick, ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoDict } from "@/dict/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoApi } from "@/api/module/dcts/signalLight/signalLightGroupInfo.ts";
import { UseCesium } from "@/views/dashboard/utils/useCesium.ts";

nextTick(() => {
  const useCesium = new UseCesium();
  form.value.location = `${useCesium.mouseClickPosition[0]},${useCesium.mouseClickPosition[1]}`
})

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
    signalLightGroupInfoApi.insertOne(form.value).then(res => {
      gotoDashboardHome()
    })
  })
}
</script>

<template>
  <FormPanelCard>
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
        <n-input v-model:value="form.location" :placeholder="signalLightGroupInfoDict.location" disabled/>
      </n-form-item>
      <n-form-item path="description" :label="signalLightGroupInfoDict.description">
        <n-input v-model:value="form.description" :placeholder="signalLightGroupInfoDict.description"/>
      </n-form-item>
      <div class="box-flex-end">
        <n-button secondary type="primary" @click="dCon">确认</n-button>
      </div>
    </n-form>
  </FormPanelCard>
</template>

<style scoped>

</style>