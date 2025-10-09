<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { fileUploadOneFull } from "@/api/common/fileUpload.ts";
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus"
import { selectFiles } from "@/utils/FileUtils.ts";
import { adminConfig } from '@dcts/config';
import { numberUtils } from "@dcts/common";

let pageNotUnmounted = true
onBeforeUnmount(() => {
  pageNotUnmounted = false
})
const props = defineProps({
  label: {
    type: String,
    default: '多文件完整上传'
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits<{
  uploadSuccess: [filenames: string[]];
  uploadFail: [msg?: string];
}>();
const isDisabled = ref(false)
const isLoading = ref(false)

const upload2 = async () => {
  isDisabled.value = true
  const filepicks = []
  try {
    filepicks.push(...await selectFiles(true))
  } catch (e) {
    isDisabled.value = false
    return
  }
  isLoading.value = true
  const filenames: string[] = []
  for (let i = 0; i < filepicks.length; i++) {
    if (pageNotUnmounted) {
      const file = filepicks[i]
      const chunksize = adminConfig.currentConfig().CHUNK_SIZE;
      if (file.size > chunksize) {
        // MessagePlugin.error(file.name + '文件大小超过' + numberUtils.unitConversion_storage(CHUNK_SIZE) + '。')
        ElMessage.warning(file.name + '文件大小超过' + numberUtils.unitConversion_storage(chunksize) + '。')
      } else {
        // const fd = new FormData();
        // fd.append('file', file)
        try {
          const s = await fileUploadOneFull(file, file.name);
          filenames.push(s)
        } catch (e) {
          uploadFail(`${file.name}上传失败。`)
        }
      }
    }
  }
  uploadSuccess(filenames)
}
const uploadSuccess = (filenames: string[]) => {
  isDisabled.value = false
  isLoading.value = false
  emit('uploadSuccess', filenames)
}
const uploadFail = (msg?: string) => {
  isDisabled.value = false
  isLoading.value = false
  // MessagePlugin.error({
  //   closeBtn: true,
  //   content: msg,
  //   duration: 0
  // })
  ElMessage.warning(msg)
  emit('uploadFail', msg)
}
</script>

<template>
  <el-button :loading="isLoading" :disabled="isDisabled" theme="primary" @click="upload2">
    <template v-if="props.showIcon" #icon>
      <slot name="icon">
        <Upload/>
      </slot>
    </template>
    <span>{{ props.label }}</span>
  </el-button>
</template>

<style scoped>
</style>
