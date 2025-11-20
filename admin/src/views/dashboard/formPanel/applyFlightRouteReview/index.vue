<script setup lang="ts">
import { useDashboardCesium } from "@/views/dashboard/core/useDashboardCesium.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { onBeforeUnmount, reactive, ref } from "vue";
import { State2, TablePageConfig } from "@/type/tablePage.ts";
import { arrayUtils, base, timeUtils } from '@dcts/common'
import { funcTablePageDashBoard } from "@/composition/tablePage/tablePageDashBoard2.ts";
import { fileBaseUrl } from "@/api/request.ts";
import { NMessage } from "@/utils/naiveBase.ts";
import { lowAltitudeAircraftApi } from "@/api/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { LowAltitudeAircraftDto } from "@/type/module/dcts/aircraftManage/lowAltitudeAircraft.ts";
import { flightRouteUserApplyApi } from "@/api/module/dcts/airspace/flightRouteUserApply.ts";
import { flightRouteUserApplyDict } from "@/dict/module/dcts/airspace/flightRouteUserApply.ts";
import { FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto } from "@/type/module/dcts/airspace/flightRouteUserApply.ts";
import { MdRefresh, MdSearch } from "@vicons/ionicons4";

const useCesium = useDashboardCesium
const sysStore = useSysStore()

onBeforeUnmount(() => {
  useCesium.previewFlightRoute2({ifDelete: true})
})

const state = reactive<State2<FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto>>({
  dialogForm: new FlightRouteUserApplyDto(),
  dialogForms: [],
  filterForm: {
    taskName: ''
  }
})
const config = new TablePageConfig<FlightRouteUserApplyDto>({
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
} = funcTablePageDashBoard<FlightRouteUserApplyDto, FlightRouteUserApplyUpdDto>({
  state,
  dFormRules: {},
  config,
  api: flightRouteUserApplyApi,
  dict: flightRouteUserApplyDict
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
const showInMap = (data: FlightRouteUserApplyDto) => {
  useCesium.previewFlightRoute2({
    points: data.path.split(', ').map(str => str.split(' ').map(Number)).map(pos => [pos[0], pos[1], pos[2]]),
    label: `id:${data.id}`
  })
}

const tg = (data: FlightRouteUserApplyDto) => {
  flightRouteUserApplyApi.updateOne({
    ...data,
    applyStatus: base.AFRASTypeEnum.approved,
  }).then(() => {
    refresh()
    useCesium.previewFlightRoute2({ifDelete: true})
  })
}
const bh = (data: FlightRouteUserApplyDto) => {
  const applyOpinion = data.applyOpinion.trim();
  if (applyOpinion === '') {
    NMessage.warning(`请输入${flightRouteUserApplyDict.applyOpinion}。`)
    return
  }
  flightRouteUserApplyApi.updateOne({
    ...data,
    applyStatus: base.AFRASTypeEnum.rejected,
    applyOpinion: applyOpinion,
  }).then(() => {
    refresh()
    useCesium.previewFlightRoute2({ifDelete: true})
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
         <n-form-item :label="flightRouteUserApplyDict.taskName" path="taskName">
           <n-input v-model:value="state.filterForm.taskName" :placeholder="flightRouteUserApplyDict.taskName"/>
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
                <n-form-item path="aircraftId" :label="flightRouteUserApplyDict.aircraftId">
                  <n-tag v-for="aid in data.aircraftId.split(',').map(Number)" :key="aid">
                    {{ allAircrafts.find(item => item.id === aid)?.aircraftName }}
                  </n-tag>
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="24">
                <n-form-item path="taskName" :label="flightRouteUserApplyDict.taskName">
                  {{ data.taskName }}
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="12">
                <n-form-item path="startTime" :label="flightRouteUserApplyDict.startTime">
                  {{ timeUtils.formatDate(new Date(data.startTime)) }}
                </n-form-item>
              </n-gi>
              <n-gi :span="12">
                <n-form-item path="endTime" :label="flightRouteUserApplyDict.endTime">
                  {{ timeUtils.formatDate(new Date(data.endTime)) }}
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="12">
                <n-form-item path="applyStatus" :label="flightRouteUserApplyDict.applyStatus">
                  {{ base.aFRASTypeDict[data.applyStatus as base.AFRASTypeEnum] }}
                </n-form-item>
              </n-gi>
              <n-gi :span="12">
                <n-form-item path="files" :label="flightRouteUserApplyDict.files">
                  <p class="download" @click="openFile(data.files)">点击下载</p>
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-grid>
              <n-gi :span="24">
                <n-form-item path="applyOpinion" :label="flightRouteUserApplyDict.applyOpinion">
                  <n-input v-model:value="data.applyOpinion" :placeholder="flightRouteUserApplyDict.applyOpinion"/>
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-space>
              <n-button type="info" @click="showInMap(data)">在地图上显示航线</n-button>
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