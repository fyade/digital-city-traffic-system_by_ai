import { ApiConfig, State2, TablePageConfig } from "@/type/tablePage.ts";
import { FormInst, FormRules } from "naive-ui";
import { computed, onMounted, reactive, ref, Ref, toRaw, useTemplateRef } from "vue";
import { PAGINATION } from "@/utils/base.ts";
import { objectUtils } from "@dcts/common";

export const funcTablePageDashBoard = <T extends { id: string | number }, T2 = T>({
                                                                                    state,
                                                                                    dFormRules = {},
                                                                                    config = new TablePageConfig(),
                                                                                    api,
                                                                                    dict,
                                                                                    dialogFormRefName = 'dialogFormRef',
                                                                                    dialogFormsRefName = 'dialogFormsRef',
                                                                                    filterFormRefName = 'filterFormRef',
                                                                                  }: {
                                                                                    state: State2<T, T2>
                                                                                    dFormRules: FormRules,
                                                                                    config: TablePageConfig
                                                                                    api: ApiConfig<T, T2>
                                                                                    dict: { [P in keyof T]: string }
                                                                                    dialogFormRefName?: string
                                                                                    dialogFormsRefName?: string
                                                                                    filterFormRefName?: string
                                                                                  }
) => {
  const filterFormRef = useTemplateRef<FormInst>(filterFormRefName)
  const filterFormVisible = ref<boolean>(true)
  const tableLoadingRef = ref<boolean>(false)
  const tableData: Ref<T[]> = ref([])
  const pageParam = reactive({
    pageNum: PAGINATION.pageNum,
    pageSize: PAGINATION.pageSize
  })
  const total = ref<number>(0)

  const initialStateFilterForm = structuredClone(toRaw(state.filterForm));

  const ifHasConfig = (key: keyof TablePageConfig, value: string | boolean) => {
    return Object.keys(config).includes(key) && config[key] === value
  }

  /**
   * 查询
   */
  const getData = () => {
    tableLoadingRef.value = true
    // tableData.value = []
    const ifByPage = !ifHasConfig('pageQuery', false)
    if (ifByPage) {
      config.beforeSelectListCallback && config.beforeSelectListCallback()
      api.selectList({...pageParam, ...state.filterForm, ...(config.selectParam || {})}).then(res => {
        tableData.value = res.list
        total.value = res.total
        config.selectListCallback && config.selectListCallback()
      }).catch(() => {
        tableData.value = []
      }).finally(() => {
        tableLoadingRef.value = false
      })
    }
    if (!ifByPage) {
      config.beforeSelectListCallback && config.beforeSelectListCallback()
      api.selectAll({...state.filterForm, ...(config.selectParam || {})}).then(res => {
        tableData.value = res
        config.selectListCallback && config.selectListCallback()
      }).catch(() => {
        tableData.value = []
      }).finally(() => {
        tableLoadingRef.value = false
      })
    }
  }

  onMounted(() => {
    if (!ifHasConfig('getDataOnMounted', false)) {
      getData()
    }
  })

  // 筛选
  const fEnter = () => {
    fCon()
  }
  // 筛选
  const fCon = () => {
    Object.keys(state.filterForm).forEach(item => {
      if (typeof state.filterForm[item as keyof typeof state.filterForm] === 'string') {
        (state.filterForm[item as keyof typeof state.filterForm] as string) = (state.filterForm[item as keyof typeof state.filterForm] as string).trim()
      }
    })
    pageParam.pageNum = 1
    getData()
  }
  // 重置
  const fCan = () => {
    state.filterForm = structuredClone(initialStateFilterForm)
    getData()
  }
  // 刷新
  const gRefresh = () => {
    getData()
  }
  // 显示/隐藏筛选表达
  const gChangeFilterFormVisible = () => {
    filterFormVisible.value = !filterFormVisible.value
  }
  const pageChange = (newVal: { pageNum: number, pageSize: number }) => {
    pageParam.pageNum = newVal.pageNum
    pageParam.pageSize = newVal.pageSize
    getData()
  }

  const refresh = () => {
    getData()
  }

  const filterFormVisible1 = computed(() => objectUtils.ifHasKey(state, 'filterForm') && Object.keys(state.filterForm).length > 0)

  return {
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
  }
}
