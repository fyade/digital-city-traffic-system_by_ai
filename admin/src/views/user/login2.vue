<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { useUserStore } from "@/store/module/user.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { getVerificationCode, registApi } from "@/api/module/main/sysManage/userLogin.ts";
import { publicConfig } from "@dcts/config";
import { base } from "@dcts/common";

const userStore = useUserStore();
const sysStore = useSysStore();
const form = reactive({
  username: '',
  password: '',
  loginRole: base.LoginRoleEnum.admin,
  verificationCode: '',
  verificationCodeUuid: '',
})

const logining = ref(false)
const onSubmit = async () => {
  if (logining.value) {
    return;
  }
  if (radio1.value === 'user') {
    userStore.setLoginType('user')
  }
  if (radio1.value === 'admin') {
    userStore.setLoginType('admin')
  }
  if (radio1.value === 'user' || radio1.value === 'admin') {
    logining.value = true
    userStore.login(form, radio1.value === 'admin').then().catch((e) => {
      logining.value = false
      refreshVerificationCode()
    })
  }
  if (radio1.value === 'regist') {
    logining.value = true
    registApi(form).then((res) => {
      ElMessage.success('注册成功，请前往"用户登录" tab 页登录。')
    }).finally(() => {
      logining.value = false
      refreshVerificationCode()
    })
  }
}

const vcode = ref('')
const refreshVerificationCode = () => {
  getVerificationCode().then(res => {
    form.verificationCodeUuid = res.uuid
    vcode.value = res.svg
  })
}
refreshVerificationCode()

const radio1 = ref('user')
watchEffect(() => {
  if (radio1.value === 'admin') {
    form.loginRole = base.LoginRoleEnum.admin
  } else if (radio1.value === 'user' || radio1.value === 'regist') {
    form.loginRole = base.LoginRoleEnum.dcts
  }
})
</script>

<template>
  <div class="el">
    <p class="title">{{ publicConfig.APP_NAME }}</p>

    <el-tabs v-model="radio1">
      <el-tab-pane label="用户登录" name="user"/>
      <el-tab-pane label="用户注册" name="regist"/>
      <el-tab-pane label="管理员登录" name="admin"/>
    </el-tabs>

    <br/>

    <el-form
        :model="form"
        label-width="80px"
        label-position="left"
        @keyup.enter="onSubmit"
    >
      <el-form-item label="用户名">
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password"/>
      </el-form-item>
      <el-form-item label="登录身份" v-show="radio1 === 'admin'">
        <el-select v-model="form.loginRole">
          <el-option v-for="key in base.LoginRoleEnum" :key="key" :label="base.loginRoleDict[key]" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="form.verificationCode">
          <template #append>
            <div class="vcodeBox" @click="refreshVerificationCode">
              <div v-html="vcode"></div>
            </div>
          </template>
        </el-input>
      </el-form-item>
      <div class="button-row">
        <el-button type="primary" :disabled="logining" :loading="logining" @click="onSubmit">登录</el-button>
      </div>
    </el-form>
  </div>

  <div class="bottom-text">
    <div class="grey">
      <p>前端版本：{{ sysStore.version.qd }}</p>
      <p>后端版本：{{ sysStore.version.hd }}</p>
    </div>
  </div>
</template>

<style scoped>
.el {
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 50%;
  width: calc(100% - 20px);
  max-width: 500px;
  height: 500px;
  transform: translate(-50%, -50%);

  > .title {
    text-align: center;
    font-size: 24px;
    line-height: 2;
    margin-bottom: 24px;
  }

  .vcodeBox {
    margin: 0 -20px;
    min-width: 120px;
    height: 40px;
    background-color: var(--login-page-code-bg);
  }
}

.button-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;

  > * {
    flex: 1;
  }
}

.bottom-text {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;

  .grey {
    color: gray;
  }

  > * {
    display: flex;
    gap: 24px;
  }
}
</style>
