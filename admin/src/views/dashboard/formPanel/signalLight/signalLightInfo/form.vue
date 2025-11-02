<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import { FormInst, FormRules } from "naive-ui";
import { useRoute } from "vue-router";
import FormPanelCard from '@/components/formPanelCard/index.vue'
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoApi, signalLightInfoDelV2 } from "@/api/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoDict } from "@/dict/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightGroupChildMappingApi } from "@/api/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { SignalLightGroupChildMappingInsDto } from "@/type/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { EDIT_TYPE_ENUM } from "@/views/dashboard/functionModules/constant.ts";
import { useDashboardStore } from "@/store/module/dashboard.ts";
import { objectUtils } from "@dcts/common";

const route = useRoute();
const useCesium = useDashboardCesium;
const dashboardStore = useDashboardStore();

const ifIns = route.path.endsWith('ins')
const ifUpd = route.path.endsWith('upd')
const ifDel = route.path.endsWith('del')
const itemId = route.query.id as string | undefined
const itemPid = route.query.pid as string | undefined
const itemXy = route.query.xy as string | undefined
if (ifIns && !itemPid) {
  gotoDashboardHome()
}
if (ifUpd && !itemId) {
  gotoDashboardHome()
}
if (ifDel && !itemId) {
  gotoDashboardHome()
}

const init = () => {
  if (ifIns) {
    const cacheData = dashboardStore.getCurrentCacheData<SignalLightInfoDto>(0)
    if (cacheData) {
      objectUtils.copyObject(form.value, cacheData, ['location'])
    }
    form.value.location = `${useCesium.mouseClickPosition[0]},${useCesium.mouseClickPosition[1]}`
  }
  if (ifUpd) {
    formLoading.value = true
    signalLightInfoApi.selectById(itemId!).then(res => {
      if (res) {
        objectUtils.copyObject(form.value, res)
      }
      if (itemXy) {
        const cacheData = dashboardStore.getCurrentCacheData<SignalLightInfoDto>(0)
        if (cacheData) {
          objectUtils.copyObject(form.value, cacheData, ['location'])
        }
        form.value.location = `${useCesium.mouseClickPosition[0]},${useCesium.mouseClickPosition[1]}`
      }
    }).finally(() => {
      formLoading.value = false
    })
  }
}

const formLoading = ref(false)
const dialogFormRef = useTemplateRef<FormInst>('dialogFormRef')
const form = ref(new SignalLightInfoDto())
const formRules: FormRules = {
  name: [{required: true, trigger: 'change'}],
  location: [{required: true, trigger: 'change'}],
  description: [{required: true, trigger: 'change'}],
}
watch(form.value, () => {
  dashboardStore.setCurrentCacheData<SignalLightInfoDto>(0, form.value)
})
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
          useCesium.refreshScreenEntities({ifRefresh: true, module: ['slModule']})
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
  signalLightInfoDelV2(Number(itemId)).then(_ => {
    useCesium.refreshScreenEntities({ifRefresh: true, module: ['slModule']})
    gotoDashboardHome()
  }).finally(() => {
    formLoading.value = false
  })
}

const mapPoint = () => {
  if (ifIns) {
    gotoDashboardHome()
    useCesium.setEditType(EDIT_TYPE_ENUM.INS_SIGNAL_LIGHT)
  }
  if (ifUpd) {
    gotoDashboardHome()
    useCesium.setEditType(EDIT_TYPE_ENUM.UPD_SIGNAL_LIGHT)
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
          <n-form-item path="name" :label="signalLightInfoDict.name">
            <n-input v-model:value="form.name" :placeholder="signalLightInfoDict.name"/>
          </n-form-item>
          <n-form-item path="location" :label="signalLightInfoDict.location">
            <n-input v-model:value="form.location" :placeholder="signalLightInfoDict.location" disabled>
              <template #suffix>
                <n-button @click="mapPoint">地图选点</n-button>
              </template>
            </n-input>
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
:deep(.n-input .n-input-wrapper) {
  padding-right: 0;
}
</style>