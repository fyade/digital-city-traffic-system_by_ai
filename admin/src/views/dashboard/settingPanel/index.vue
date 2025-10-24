<script setup lang="ts">
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { computed, ref } from "vue";
import { deepClone } from "@/utils/ObjectUtils.ts";
import { arrayUtils } from "@dcts/common";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { NMessage } from "@/utils/naiveBase.ts";
import { useUserStore } from "@/store/module/user.ts";

const userStore = useUserStore()

const useCesium = useDashboardCesium;
const allLayers = useCesium.allLayers;

const form = ref({
  mapLayer: '',
  dataLayer: [] as string[]
})
let form2 = deepClone(form.value)

const init = () => {
  form.value.mapLayer = useCesium.allLayers.currentIdOfBaseMap[1][0]
  form.value.dataLayer = useCesium.allLayers.currentIdOfRoadData[1]
  form2 = deepClone(form.value)
}
init()

const submit = () => {
  if (form.value.mapLayer !== form2.mapLayer) {
    useCesium.setLayer('baseMap', [form.value.mapLayer])
  }
  if (!arrayUtils.ifSameArray(form.value.dataLayer, form2.dataLayer)) {
    useCesium.setLayer('roadData', form.value.dataLayer)
  }
  form2 = deepClone(form.value)
  NMessage.success('保存更改成功。')
}

const ifShowSignalLight = ref(useCesium.getIfShowSignalLight())
const updateIfShowSignalLight = (val: boolean) => {
  useCesium.setIfShowSignalLight(val)
  ifShowSignalLight.value = useCesium.getIfShowSignalLight()
  NMessage.success('修改成功。')
}
const ifShowVehicleRealTime = ref(useCesium.getIfShowVehicleRealTime())
const updateIfShowVehicleRealTime = (val: boolean) => {
  useCesium.setIfShowVehicleRealTime(val)
  ifShowVehicleRealTime.value = useCesium.getIfShowVehicleRealTime()
  NMessage.success('修改成功。')
}
const lastActiveInterval = ref(useCesium.getLastActiveInterval())
const updateLastActiveInterval = (val: number) => {
  useCesium.setLastActiveInterval(val)
  lastActiveInterval.value = useCesium.getLastActiveInterval()
  NMessage.success('修改成功。')
}

const ifAdminLogin = computed(() => userStore.loginType === 'admin')
</script>

<template>
  <n-modal
      style="width: 60%;height: 60vh;"
      :auto-focus="false"
      content-style="overflow: auto;"
      show
      preset="card"
      @close="gotoDashboardHome"
      @mask-click="gotoDashboardHome"
      title="设置"
  >
    <n-divider title-placement="left">底图</n-divider>
    <n-form label-placement="left" :model="form">
      <n-form-item label="影像底图">
        <n-radio-group v-model:value="form.mapLayer" name="mapLayer">
          <n-radio v-for="item in allLayers.allLayersOfBaseMap" :key="item.id" :value="item.id" :label="item.name"/>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="数据图层">
        <n-checkbox-group v-model:value="form.dataLayer">
          <n-checkbox v-for="item in allLayers.allLayersOfRoadData" :key="item.id" :value="item.id" :label="item.name"/>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item>
        <n-button @click="submit">保存更改</n-button>
      </n-form-item>
    </n-form>

    <n-divider title-placement="left">实体</n-divider>
    <n-grid style="line-height: 34px;" :y-gap="20" :cols="2">
      <template v-if="ifAdminLogin">
        <n-gi>
          <n-grid>
            <n-gi :span="6">信号灯</n-gi>
            <n-gi :span="18">
              <n-switch :value="ifShowSignalLight" @update:value="updateIfShowSignalLight">
                <template #checked>显示</template>
                <template #unchecked>隐藏</template>
              </n-switch>
            </n-gi>
          </n-grid>
        </n-gi>
        <n-gi></n-gi>
      </template>
      <template v-if="ifAdminLogin">
        <n-gi>
          <n-grid>
            <n-gi :span="6">实时车流数据</n-gi>
            <n-gi :span="18">
              <n-switch :value="ifShowVehicleRealTime" @update:value="updateIfShowVehicleRealTime">
                <template #checked>显示</template>
                <template #unchecked>隐藏</template>
              </n-switch>
            </n-gi>
          </n-grid>
        </n-gi>
        <n-gi>
          <template v-if="ifShowVehicleRealTime">
            <n-grid>
              <n-gi :span="6">最近活动时间(秒)</n-gi>
              <n-gi :span="18">
                <n-input-number :value="lastActiveInterval" @update:value="updateLastActiveInterval" :max="60" :min="10"/>
              </n-gi>
            </n-grid>
          </template>
        </n-gi>
      </template>
    </n-grid>
  </n-modal>
</template>

<style scoped>
</style>
