<script setup lang="ts">
import { funcTablePageDashBoard } from "@/composition/tablePage/tablePageDashBoard2.ts";
import { onBeforeUnmount, reactive, ref } from "vue";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { base, timeUtils, arrayUtils } from '@dcts/common'
import { fileBaseUrl } from "@/api/request.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { MdRefresh, MdSearch } from '@vicons/ionicons4'
import { NMessage } from "@/utils/naiveBase.ts";
import { lowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { LowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { flightRestrictionZoneUserApplyApi } from "@/api/module/dcts/airspace/flightRestrictionZoneUserApply.ts";
import { flightRestrictionZoneUserApplyDict } from "@/dict/module/dcts/airspace/flightRestrictionZoneUserApply.ts";
import { FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplyUpdDto } from "@/type/module/dcts/airspace/flightRestrictionZoneUserApply.ts";

const useCesium = useDashboardCesium
const sysStore = useSysStore()

onBeforeUnmount(() => {
  useCesium.previewFlightRestrictionZone2({ifDelete: true})
})

const state = reactive<State2<FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplyUpdDto>>({
  dialogForm: new FlightRestrictionZoneUserApplyDto(),
  dialogForms: [],
  filterForm: {
    taskName: '',
  },
})
const config = new TablePageConfig<FlightRestrictionZoneUserApplyDto>({
  selectParam: {
    applyStatus: base.AFRASTypeEnum.aaa
  },
  selectListCallback: () => {
    refreshAircrafts()
  }
})
const {
  filterFormRef,
  filterFormVisible1,
  filterFormVisible,
  tableLoadingRef,
  tableData,
  pageParam,
  total,
  refresh,
  fEnter,
  fCon,
  fCan,
  gRefresh,
  gChangeFilterFormVisible,
  pageChange,
} = funcTablePageDashBoard<FlightRestrictionZoneUserApplyDto, FlightRestrictionZoneUserApplyUpdDto>({
  state,
  dFormRules: {},
  config,
  api: flightRestrictionZoneUserApplyApi,
  dict: flightRestrictionZoneUserApplyDict,
})

const allAircrafts = ref<LowAltitudeAircraftDto[]>([])
const allAircraftLoading = ref(false)
const refreshAircrafts = () => {
  allAircraftLoading.value = true
  const aids = arrayUtils.arrNoRepeat(tableData.value.map(item => item.aircraftId.split(',').map(Number)).flat());
  lowAltitudeAircraftApi.selectByIds(aids).then(res => {
    allAircrafts.value = res
  }).finally(() => {
    allAircraftLoading.value = false
  })
}

const openFile = (filename: string) => {
  window.open(sysStore.urlAddAuth(`${fileBaseUrl}${filename}`))
}
const showInMap = (data: FlightRestrictionZoneUserApplyDto) => {
  useCesium.previewFlightRestrictionZone2({
    points: data.geometry.split(', ').map(str => str.split(' ').map(Number)).map(pos => [pos[0], pos[1]]),
    label: `id:${data.id}`
  })
}

const tg = (data: FlightRestrictionZoneUserApplyDto) => {
  flightRestrictionZoneUserApplyApi.updateOne({
    ...data,
    applyStatus: base.AFRASTypeEnum.approved,
  }).then(() => {
    refresh()
    useCesium.previewFlightRestrictionZone2({ifDelete: true})
  })
}
const bh = (data: FlightRestrictionZoneUserApplyDto) => {
  const applyOpinion = data.applyOpinion.trim();
  if (applyOpinion === '') {
    NMessage.warning(`请输入${flightRestrictionZoneUserApplyDict.applyOpinion}。`)
    return
  }
  flightRestrictionZoneUserApplyApi.updateOne({
    ...data,
    applyStatus: base.AFRASTypeEnum.rejected,
    applyOpinion: applyOpinion,
  }).then(() => {
    refresh()
    useCesium.previewFlightRestrictionZone2({ifDelete: true})
  })
}
</script>

<template>
  <FormPanelCard
      :if-ins="false"
      :if-upd="false"
      :if-del="false"
      :loading="tableLoadingRef"
      preset="drawer"
  >
    <n-spin :show="tableLoadingRef">
      <div class="zs-filter-form" v-show="filterFormVisible1 && filterFormVisible">
        <n-form
            class="demo-form-inline"
            ref="filterFormRef"
            :model="state.filterForm"
            :inline="true"
            label-placement="left"
            @keyup.enter="fEnter"
        >
          <n-form-item :label="flightRestrictionZoneUserApplyDict.taskName" path="taskName">
            <n-input v-model:value="state.filterForm.taskName" :placeholder="flightRestrictionZoneUserApplyDict.taskName"/>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="fCon">筛选</n-button>
            <n-button @click="fCan">重置</n-button>
          </n-form-item>
        </n-form>
      </div>

      <div class="zs-button-row">
        <div>
          <n-button type="primary" secondary @click="gRefresh">
            刷新
            <template #icon>
              <NIcon>
                <MdRefresh/>
              </NIcon>
            </template>
          </n-button>
        </div>
        <div>
          <n-button v-if="filterFormVisible1" secondary circle @click="gChangeFilterFormVisible">
            <NIcon>
              <MdSearch/>
            </NIcon>
          </n-button>
        </div>
      </div>

      <div class="zs-table-data">
        <n-card v-for="data in tableData" :key="data.id" :title="`id:${data.id}`">
          <n-form label-placement="left">
            <n-grid>
              <n-gi :span="24">
                <n-form-item path="aircraftId" :label="flightRestrictionZoneUserApplyDict.aircraftId">
                  <n-tag v-for="aid in data.aircraftId.split(',').map(Number)" :key="aid">
                    {{ allAircrafts.find(item => item.id === aid)?.aircraftName }}
                  </n-tag>
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="24">
                <n-form-item path="taskName" :label="flightRestrictionZoneUserApplyDict.taskName">
                  {{ data.taskName }}
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="12">
                <n-form-item path="startTime" :label="flightRestrictionZoneUserApplyDict.startTime">
                  {{ timeUtils.formatDate(new Date(data.startTime)) }}
                </n-form-item>
              </n-gi>
              <n-gi :span="12">
                <n-form-item path="endTime" :label="flightRestrictionZoneUserApplyDict.endTime">
                  {{ timeUtils.formatDate(new Date(data.endTime)) }}
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="12">
                <n-form-item path="applyStatus" :label="flightRestrictionZoneUserApplyDict.applyStatus">
                  {{ base.aFRASTypeDict[data.applyStatus as base.AFRASTypeEnum] }}
                </n-form-item>
              </n-gi>
              <n-gi :span="12">
                <n-form-item path="files" :label="flightRestrictionZoneUserApplyDict.files">
                  <p class="download" @click="openFile(data.files)">点击下载</p>
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="24">
                <n-form-item path="applyOpinion" :label="flightRestrictionZoneUserApplyDict.applyOpinion">
                  <n-input v-model:value="data.applyOpinion" :placeholder="flightRestrictionZoneUserApplyDict.applyOpinion"/>
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-space>
              <n-button type="info" @click="showInMap(data)">在地图上显示空域</n-button>
              <n-button type="success" @click="tg(data)">通过</n-button>
              <n-button type="error" @click="bh(data)">驳回</n-button>
            </n-space>
          </n-form>
        </n-card>
        <Pagination2
            v-if="config.pageQuery"
            :total="total"
            :page-num="pageParam.pageNum"
            :page-size="pageParam.pageSize"
            @page-change="pageChange"
        />
      </div>
    </n-spin>
  </FormPanelCard>
</template>

<style scoped>
.download {
  font-style: oblique;
  text-decoration: underline;
  cursor: pointer;
}
</style>