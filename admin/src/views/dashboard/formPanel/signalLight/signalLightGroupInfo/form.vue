<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from "vue";
import { FormInst, FormRules } from "naive-ui";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoDict } from "@/dict/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupInfoApi } from "@/api/module/dcts/signalLight/signalLightGroupInfo.ts";
import { UseCesium } from "@/views/dashboard/utils/useCesium.ts";
import { useRoute } from "vue-router";

const route = useRoute();
const useCesium = new UseCesium();

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
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
    signalLightGroupInfoApi.selectById(itemId!)
        .then(res => {
          form.value = res
        })
        .finally(() => {
          formLoading.value = false
        })
  }
})

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
      signalLightGroupInfoApi.insertOne(form.value).then(_ => {
        useCesium.refreshScreenEntities()
        gotoDashboardHome()
      })
    }
    if (ifUpd) {
      signalLightGroupInfoApi.updateOne(form.value).then(_ => {
        useCesium.refreshScreenEntities()
        gotoDashboardHome()
      })
    }
  })
}
const submitCallback = () => {
  signalLightGroupInfoApi.deleteList(itemId!).then(_ => {
    useCesium.refreshScreenEntities()
    gotoDashboardHome()
  })
}
</script>

<template>
  <FormPanelCard
      :if-ins="ifIns"
      :if-upd="ifUpd"
      :if-del="ifDel"
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
      </n-spin>
    </template>
  </FormPanelCard>
</template>

<style scoped>

</style>