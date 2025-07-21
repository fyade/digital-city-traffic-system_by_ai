<script setup lang="ts">
import { PropType, ref, watch } from "vue";

const modelValue = defineModel({type: String});
const props = defineProps({
  kvs: {
    type: Object as PropType<Record<string, string>>,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  connection: {
    type: String,
    default: '-',
  }
});

const linshiParam = ref<string[]>([])
const modelValueChange = () => {
  linshiParam.value = !modelValue.value
      ? []
      : modelValue.value.split(props.connection).filter(_ => _)
}
const linshiParamChange = () => {
  modelValue.value = linshiParam.value.length === 0
      ? ''
      : `${props.connection}${linshiParam.value.join(props.connection)}${props.connection}`
}
watch(modelValue, modelValueChange, {immediate: true})
</script>

<template>
  <el-checkbox-group v-model="linshiParam" @change="linshiParamChange">
    <el-checkbox v-for="key in Object.keys(props.kvs)" :key="key" :label="kvs[key]" :value="key"/>
  </el-checkbox-group>
</template>

<style scoped>
</style>