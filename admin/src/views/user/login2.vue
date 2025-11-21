<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import { useUserStore } from "@/store/module/user.ts";
import { useSysStore } from "@/store/module/sys.ts";
import { getEmailCodeApi, getVerificationCode, regist2Api } from "@/api/module/main/sysManage/userLogin.ts";
import { adminConfig, mail126Config, publicConfig } from "@dcts/config";
import { base } from "@dcts/common";
import { FormRules } from "element-plus";
import { LoginCodeDto } from "@/type/module/main/sysManage/user.ts";

const userStore = useUserStore();
const sysStore = useSysStore();
const form = reactive({
  username: '',
  password: '',
  loginRole: base.LoginRoleEnum.admin,
  verificationCode: '',
  verificationCodeUuid: '',
})
const emailCode = ref('')
const rules: FormRules<typeof form> = {}

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
    const user2: LoginCodeDto = {
      username: form.username,
      code: emailCode.value,
      loginRole: form.loginRole,
      verificationCode: form.verificationCode,
      verificationCodeUuid: form.verificationCodeUuid,
    };
    userStore.login(form, user2, radio1.value === 'admin', ifCodewLogin.value).then().catch((e) => {
      logining.value = false
      refreshVerificationCode()
    })
  }
  if (radio1.value === 'regist') {
    logining.value = true
    regist2Api({...form, emailCode: emailCode.value}).then((res) => {
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

const emailCodewLoading = ref(false)
const getEmailCode_ = () => {
  if (!/^.+@.+\..+$/.test(form.username)) {
    ElMessage.warning('邮箱格式错误。')
    return
  }
  emailCodewLoading.value = true
  getEmailCodeApi({email: form.username})
      .then(() => {
        ElMessage.success('邮件已发送，请注意查收。')
      })
      .finally(() => {
        emailCodewLoading.value = false
      })
}

const ifCodewLogin = ref<'psd' | 'code'>('psd')
const changeCodeLogin = () => {
  ifCodewLogin.value = ifCodewLogin.value === 'psd' ? 'code' : 'psd'
}

const radio1 = ref<'user' | 'admin' | 'regist'>('user')
watchEffect(() => {
  if (radio1.value === 'admin') {
    form.loginRole = base.LoginRoleEnum.admin
  } else if (radio1.value === 'user' || radio1.value === 'regist') {
    form.loginRole = base.LoginRoleEnum.dcts
  }

  if (radio1.value === 'regist') {
    ifCodewLogin.value = 'psd'
  }
})
</script>

<template>
  <div class="el">
    <p class="title">{{ publicConfig.APP_NAME }}</p>
    <p class="title title2">
      <span>前端版本</span>
      <span>{{ adminConfig.currentVersion }}</span>
      <span>后端版本</span>
      <span>{{ sysStore.version.hd }}</span>
    </p>

    <el-tabs v-model="radio1">
      <el-tab-pane label="用户登录" name="user"/>
      <el-tab-pane label="管理员登录" name="admin"/>
      <el-tab-pane label="注册" name="regist"/>
    </el-tabs>

    <br/>

    <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="left"
        @keyup.enter="onSubmit"
    >
      <template v-if="radio1==='regist'">
        <el-alert
            title="注册成功后，可使用“用户登录”登录用户端，也可使用“管理员登录”登录后台。"
            type="info"
            show-icon
            :closable="false"
        />
        <br/>
      </template>
      <template v-if="radio1==='regist' || ifCodewLogin==='code'">
        <el-alert
            :title="`发送验证码的邮箱为${mail126Config.user}，若未收到邮件，请检查垃圾箱或黑名单。注意${mail126Config.user}只作为邮箱发送服务使用，请不要给此邮箱写信或回信。`"
            type="info"
            show-icon
            :closable="false"
        />
        <br/>
      </template>
      <el-form-item label="邮箱">
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" v-if="ifCodewLogin==='psd'">
        <el-input type="password" v-model="form.password"/>
      </el-form-item>
      <!-- <el-form-item label="登录身份" v-show="radio1 === 'admin'"> -->
      <!--   <el-select v-model="form.loginRole" disabled> -->
      <!--     <el-option v-for="key in base.LoginRoleEnum" :key="key" :label="base.loginRoleDict[key]" :value="key"/> -->
      <!--   </el-select> -->
      <!-- </el-form-item> -->
      <el-form-item label="邮箱验证码" v-if="radio1==='regist'||ifCodewLogin==='code'">
        <el-input v-model="emailCode">
          <template #append>
            <el-button :disabled="emailCodewLoading" @click="getEmailCode_">获取验证码</el-button>
          </template>
        </el-input>
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
        <el-button v-if="radio1==='user'||radio1==='admin'" @click="changeCodeLogin">
          <span v-if="ifCodewLogin==='psd'">不喜欢密码？点此切换为验证码登录</span>
          <span v-if="ifCodewLogin==='code'">不喜欢验证码？点此切换为密码登录</span>
        </el-button>
        <el-button type="primary" :disabled="logining" :loading="logining" @click="onSubmit">
          <span v-if="radio1==='user'">用户登录</span>
          <span v-if="radio1==='admin'">管理员登录</span>
          <span v-if="radio1==='regist'">注册</span>
        </el-button>
      </div>
    </el-form>
  </div>

  <!-- <div class="bottom-text"> -->
  <!--   <div class="grey"> -->
  <!--     <p>前端版本：{{ sysStore.version.qd }}</p> -->
  <!--     <p>后端版本：{{ sysStore.version.hd }}</p> -->
  <!--   </div> -->
  <!-- </div> -->
</template>

<style scoped>
.el {
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 50%;
  width: calc(100% - 20px);
  max-width: 500px;
  height: auto;
  transform: translate(-50%, -50%);

  > .title {
    text-align: center;
    font-size: 24px;
    line-height: 2;
    margin-bottom: 24px;
  }

  > .title2 {
    font-size: 14px;
    font-weight: lighter;
    display: flex;
    gap: 12px;
    justify-content: center;
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
