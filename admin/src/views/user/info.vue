<script setup lang="ts">
import { getSelfInfo, updUser } from '@/api/module/main/sysManage/user';
import { reactive } from 'vue';
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/module/user.ts";
import { MultiAuthUserDto } from "@/type/module/main/sysManage/user.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { fileBaseUrl } from "@/api/request.ts";
import { buildUserInfoDto, setUserInfoDto } from "@/identity/utils/identityUtils.ts";

const userStore = useUserStore();
const sysStore = useSysStore();

const state = reactive({
  id: '',
  nickname: '',
  username: '',
  avatar: '',
})
const getUserInfo = () => {
  getSelfInfo().then(res => {
    setUserInfoDto(state, res);
  })
}
getUserInfo()

const onSubmit = () => {
  const multiAuthUser: { [P in keyof MultiAuthUserDto]: Partial<MultiAuthUserDto[P]> } = new MultiAuthUserDto();
  buildUserInfoDto(multiAuthUser, state);
  updUser(multiAuthUser).then(res => {
    if (res) {
      ElMessage.success('用户资料修改成功。')
      getUserInfo()
      userStore.refreshSelfInfo()
    }
  })
}
</script>

<template>
  <div>
    <el-form :model="state" label-width="auto" style="max-width: 500px;">
      <el-form-item label="头像">
        <el-image
          v-if="state.avatar"
          :src="sysStore.urlAddAuth(fileBaseUrl+state.avatar)"
          fit="contain"
        />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="state.nickname"/>
      </el-form-item>
      <el-form-item label="用户名">
        {{ state.username }}
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped></style>