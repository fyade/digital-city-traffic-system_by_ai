<script setup lang="ts">
const props = defineProps({
  pageNum: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});
const emits = defineEmits(['pageChange']);

const handleSizeChange = (val: number) => {
  const obj = {
    pageNum: props.pageNum,
    pageSize: val
  };
  if ((props.pageNum - 1) * val > props.total) {
    obj.pageNum = Math.floor(props.total / props.pageSize)
  }
  emits('pageChange', obj);
};
const handleCurrentChange = (val: number) => {
  const obj = {
    pageNum: val,
    pageSize: props.pageSize
  };
  emits('pageChange', obj);
}
</script>

<template>
  <n-pagination
      class="my-pagination"
      :page="props.pageNum"
      :page-size="props.pageSize"
      :page-count="Math.ceil(props.total / props.pageSize)"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      show-size-picker
      show-quick-jumper
      :on-update:page="handleCurrentChange"
      :on-update:page-size="handleSizeChange"
  >
    <template #prefix>
      共 {{ props.total }} 条
    </template>
  </n-pagination>
</template>

<style scoped>
.my-pagination {
  display: flex;
  justify-content: flex-end;
}
</style>