<script setup lang="ts">
import ImageCrop from "@/components/imageCrop/imageCrop.vue";
import { updUser } from "@/api/module/main/sysManage/user.ts";
import { useUserStore } from "@/store/module/user.ts";
import { ElMessage } from "element-plus";
import { MultiAuthUserDto } from "@/type/module/main/sysManage/user.ts";
import { base, numberUtils } from "@dcts/common";
import { selectFiles } from "@/utils/FileUtils.ts";
import { fileUploadAvatar } from "@/api/common/fileUpload.ts";
import { adminConfig } from "@dcts/config";

const userStore = useUserStore();

const chunksize = adminConfig.currentConfig().CHUNK_SIZE;

const uploadSuccess = (fileName: string) => {
  const multiAuthUser: {
    [P in keyof MultiAuthUserDto]: Partial<MultiAuthUserDto[P]>;
  } = new MultiAuthUserDto();
  if (userStore.loginRole === base.LoginRoleEnum.admin) {
    multiAuthUser.admin = {
      id: userStore.userinfo.admin!.id,
      avatar: fileName,
    };
  }
  if (userStore.loginRole === base.LoginRoleEnum.visitor) {
    multiAuthUser.visitor = {
      id: userStore.userinfo.visitor!.id,
      avatar: fileName,
    };
  }
  updUser(multiAuthUser).then((res) => {
    if (res) {
      ElMessage.success("头像上传成功。");
      userStore.refreshSelfInfo();
    } else {
      ElMessage.error("头像上传失败。");
    }
  });
};

const upload2 = () => {
  selectFiles().then((res) => {
    if (res.length === 0) {
      return;
    }
    const file = res[0];
    if (file.size > chunksize) {
      ElMessage.warning(file.name + '文件大小超过' + numberUtils.unitConversion_storage(chunksize) + '。')
      return;
    }
    fileUploadAvatar(file, file.name).then((res) => {
      uploadSuccess(res);
    });
  });
};
</script>

<template>
  <div>
    <ImageCrop @upload-success="uploadSuccess" />
    <br />
    <div>
      <el-button type="primary" @click="upload2">也可以戳这里上传gif</el-button>
    </div>
  </div>
</template>

<style scoped></style>
