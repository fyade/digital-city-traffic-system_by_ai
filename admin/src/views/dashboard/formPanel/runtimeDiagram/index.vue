<script setup lang="ts">
import { useRoute } from "vue-router";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { ref, watch } from "vue";
import { calculateLightsInPolygonApi } from "@/api/module/dcts/spatialData.ts";
import { CalculateLightsInPolygonVo } from "@/type/module/dcts/spatialData.ts";
import { arrayUtils, base, timeUtils } from "@dcts/common";
import { signalLightGroupInfoApi } from "@/api/module/dcts/signalLight/signalLightGroupInfo.ts";
import { signalLightGroupChildMappingApi } from "@/api/module/dcts/signalLight/signalLightGroupChildMapping.ts";
import { SignalLightGroupInfoDto } from "@/type/module/dcts/signalLight/signalLightGroupInfo.ts";
import { SignalLightInfoDto } from "@/type/module/dcts/signalLight/signalLightInfo.ts";
import { signalLightInfoApi } from "@/api/module/dcts/signalLight/signalLightInfo.ts";

const route = useRoute();
const useCesium = ref(useDashboardCesium);

const itemId = route.query.id as string | undefined
if (!itemId) {
  gotoDashboardHome()
}

watch(() => useCesium.value.currentTime, () => {
  currentTime.value = useCesium.value.currentTime
})

const loading = ref(false)
const startTime = ref(0)
const endTime = ref(0)
const currentTime = ref(0)
const timelines = ref<number[]>([])
const data = ref<CalculateLightsInPolygonVo[]>([])
const allSLG = ref<SignalLightGroupInfoDto[]>([])
const allSLC = ref<SignalLightInfoDto[]>([])
const init = () => {
  loading.value = true
  Promise.all([
    calculateLightsInPolygonApi({ifReturn: true, groupIds: [Number(itemId)]}),
    signalLightGroupInfoApi.selectByIds([Number(itemId)]),
    signalLightGroupChildMappingApi.selectAll({groupId: {in: {value: [Number(itemId)]}}})
  ]).then(ress => {
    data.value = ress[0].sort((a, b) => a.signalLightGroupId !== b.signalLightGroupId ? a.signalLightGroupId - b.signalLightGroupId : a.signalLightChildId - b.signalLightChildId)
    timelines.value = arrayUtils.arrNoRepeat(data.value.map(item => item.runParam.map(itm => [itm.start, itm.end]).flat()).flat()).sort((a, b) => a - b)
    startTime.value = timelines.value[0];
    endTime.value = timelines.value[timelines.value.length - 1];
    allSLG.value = ress[1]
    signalLightInfoApi.selectByIds(ress[2].map(item => item.childLightId)).then(res => {
      allSLC.value = res
    }).finally(() => {
      loading.value = false
    })
  }).catch(() => {
    loading.value = false
  })
}
</script>

<template>
  <FormPanelCard
      :if-ins="false"
      :if-upd="false"
      :if-del="false"
      :loading="loading"
      :run-init="init"
      wider
  >
    <n-spin :show="loading">
      <div class="ellll">
        <div class="lleft">
          <div
              v-for="(dat, index) in arrayUtils.arrNoRepeat(data.map(d => d.signalLightGroupId))"
              :key="index"
              :style="{
                height: `calc(var(--height-unit-of-this-page) * 4 * ${data.filter(d => d.signalLightGroupId === dat).length})`
              }"
          >
            {{ allSLG.find(item => item.id === dat)?.name || dat }}
          </div>
        </div>
        <div class="left">
          <div v-for="(dat, index) in data" :key="index">
            <div class="left">
              {{ allSLC.find(item => item.id === dat.signalLightChildId)?.name || dat.signalLightChildId }}
            </div>
            <div class="right">
              <div>{{ base.sLSPLTTypeDict[base.SLSPLTTypeEnum.AROUND] }}</div>
              <div>{{ base.sLSPLTTypeDict[base.SLSPLTTypeEnum.LEFT] }}</div>
              <div>{{ base.sLSPLTTypeDict[base.SLSPLTTypeEnum.STRAIGHT] }}</div>
              <div>{{ base.sLSPLTTypeDict[base.SLSPLTTypeEnum.RIGHT] }}</div>
            </div>
          </div>
        </div>
        <div class="main">
          <div v-for="(dat, index) in data" :key="index" class="data">
            <div v-for="(da, inde) in dat.runParam" :key="inde" :style="{
              paddingLeft: `${inde === 0 ? (da.start - startTime) / 1000 * 8 : 0}px`,
              width: `${(da.end - da.start) / 1000 * 8}px`
            }">
              <div :style="{
                backgroundColor:da.lightType.includes(base.SLSPLTTypeEnum.AROUND) ? da.color : base.SignalLightColorEnum.RED
              }"></div>
              <div :style="{
                backgroundColor:da.lightType.includes(base.SLSPLTTypeEnum.LEFT) ? da.color : base.SignalLightColorEnum.RED
              }"></div>
              <div :style="{
                backgroundColor:da.lightType.includes(base.SLSPLTTypeEnum.STRAIGHT) ? da.color : base.SignalLightColorEnum.RED
              }"></div>
              <div :style="{
                backgroundColor:da.lightType.includes(base.SLSPLTTypeEnum.RIGHT) ? da.color : base.SignalLightColorEnum.RED
              }"></div>
            </div>
          </div>
          <div class="timeline" :style="{
            width: `${(endTime - startTime) / 1000 * 8}px`
          }">
            <div v-for="(time, index) in timelines" :key="index" :style="{
              left: `${(time - startTime) / 1000 * 8}px`
            }">
              {{ timeUtils.formatDate(new Date(time)) }}
            </div>
          </div>
        </div>

        <div class="currentTime" :style="{
          left: `${250 + (currentTime - startTime) / 1000 * 8}px`
        }"></div>
      </div>
    </n-spin>
  </FormPanelCard>
</template>

<style scoped>
.ellll {
  position: relative;
  display: flex;
  overflow: auto;
  min-height: 200px;
  --height-unit-of-this-page: 24px;

  > .lleft {
    flex: none;
    width: 100px;
    position: sticky;
    left: 0;
    background-color: var(--common-page-bg);
  }

  > div {
    > div {
      margin: 3px 0;
    }
  }

  > .left, > .main {
    > div {
      height: calc(var(--height-unit-of-this-page) * 4);
    }
  }

  > .left {
    flex: none;
    width: 150px;
    position: sticky;
    left: 100px;
    background-color: var(--common-page-bg);

    > div {
      display: flex;

      > .left {
        flex: none;
        width: 100px;
      }

      > .right {
        flex: none;
        display: flex;
        flex-direction: column;
      }
    }
  }

  > .main {
    flex: auto;

    > .data {
      display: flex;

      > div {
        flex: none;
        display: flex;
        flex-direction: column;

        > div {
          flex: auto;
          width: 100%;
        }
      }
    }

    > .timeline {
      position: relative;
      height: 150px;

      > div {
        position: absolute;
        transform: rotate(60deg);
        transform-origin: left center;
        white-space: nowrap;
      }
    }
  }

  > .currentTime {
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background-color: #00f;
  }
}
</style>