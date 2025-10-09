<script setup lang="ts">
import { ref } from "vue";
import { fileUploadOneFull } from "@/api/common/fileUpload.ts";
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus"
import { selectFiles } from "@/utils/FileUtils.ts";
import { adminConfig } from '@dcts/config';
import { numberUtils } from "@dcts/common";

const props = defineProps({
  label: {
    type: String,
    default: '单文件完整上传'
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits<{
  uploadSuccess: [filename: string];
  uploadFail: [msg?: string];
}>();
const isDisabled = ref(false)
const isLoading = ref(false)

const upload1 = async () => {
  isDisabled.value = true
  const filepicks = []
  try {
    filepicks.push(...await selectFiles())
  } catch (e) {
    isDisabled.value = false
    return
  }
  isLoading.value = true
  const file = filepicks[0]
  const chunksize = adminConfig.currentConfig().CHUNK_SIZE;
  if (file.size > chunksize) {
    // MessagePlugin.error(file.name + '文件大小超过' + numberUtils.unitConversion_storage(CHUNK_SIZE) + '。')
    ElMessage.warning(file.name + '文件大小超过' + numberUtils.unitConversion_storage(chunksize) + '。')
    isDisabled.value = false
    isLoading.value = false
    return
  }
  // const fd = new FormData();
  // fd.append('file', file)
  fileUploadOneFull(file, file.name).then(res => {
    uploadSuccess(res)
  }).catch(err => {
    uploadFail(`${file.name}上传失败。`)
  }).finally(() => {
    // fd.delete('file')
  })
}
const uploadSuccess = (filename: string) => {
  isDisabled.value = false
  isLoading.value = false
  emit('uploadSuccess', filename)
}
const uploadFail = (msg?: string) => {
  isDisabled.value = false
  isLoading.value = false
  //   MessagePlugin.error({
  //     closeBtn: true,
  //     content: msg,
  //     duration: 0
  //   })
  ElMessage.warning(msg)
  emit('uploadFail', msg)
}
</script>

<template>
  <el-button :loading="isLoading" :disabled="isDisabled" theme="primary" @click="upload1">
    <template v-if="props.showIcon" #icon>
      <slot name="icon">
        <Upload/>
      </slot>
    </template>
    <span>{{ props.label }}</span>
  </el-button>
</template>

<style scoped></style>
