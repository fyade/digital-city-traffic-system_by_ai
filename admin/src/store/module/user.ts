import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { ElMessage, ElNotification, NotificationHandle } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { LoginCodeDto, LoginDto, MultiAuthUserDto } from "@/type/module/main/sysManage/user.ts";
import { getSelfInfo } from "@/api/module/main/sysManage/user.ts";
import { ifWebsiteLink } from "@/utils/LinkUtils.ts";
import { BCService } from "@/services/broadcastChannel.ts";
import { loginApi, loginCodeApi, logOutApi } from "@/api/module/main/sysManage/userLogin.ts";
import { gotoDashboardHome } from "@/views/dashboard/utils/base.ts";
import { setUserStoreInfo } from "@/identity/utils/identityUtils.ts";

export const useUserStore = defineStore('userStore', () => {
  const route = useRoute()
  const router = useRouter()
  const token = ref('')
  const loginRole = ref('')
  const userinfo = reactive(new MultiAuthUserDto())
  const ifLogin = ref(false)
  // 普通用户登录还是管理员登录
  const loginType = ref('')
  const setLoginType = (val: string) => {
    loginType.value = val
    refreshLoginRoleCB()
  }
  const getLoginType = () => {
    return loginType.value
  }
  const refreshLoginRoleCB = () => {
    const routes = router.getRoutes();
    const find = routes.find(item => item.name === '~');
    if (find) {
      if (loginType.value === 'user') {
        find.redirect = '/dashboard'
      }
      if (loginType.value === 'admin') {
        find.redirect = '/home'
      }
    }
  }
  refreshLoginRoleCB()
  const login = async (user: LoginDto, user2: LoginCodeDto, ifAdminLogin = false, loginType: 'psd' | 'code' = 'psd') => {
    return new Promise((resolve, reject) => {
      (loginType === 'psd' ? loginApi(user, ifAdminLogin) : loginCodeApi(user2, ifAdminLogin)).then(async res => {
        // 其他标签页如果有不同用户，则将其登出
        BCService.emit('login', {username: user.username, loginRole: user.loginRole})
        if (res) {
          const notification: NotificationHandle = ElNotification({
            title: '提示',
            message: '登录成功，系统资源加载中。。。',
            type: 'success',
            showClose: false,
            duration: 0,
          });
          try {
            token.value = res.token
            loginRole.value = res.loginRole
            ifLogin.value = true
            setUserStoreInfo(loginRole.value, userinfo, res.multiAuthUser)
            if (route.query.redirect && !ifWebsiteLink(route.query.redirect.toString(), '/')) {
              notification.close()
              await router.replace(route.query.redirect as string)
            } else {
              notification.close()
              if (ifAdminLogin) {
                await router.replace('/')
              } else {
                gotoDashboardHome()
              }
            }
          } catch (e) {
            console.error(e);
            ElMessage.error({
              message: '系统发生故障，请检查菜单是否有错误，若无法解决，请查看开发文档或联系开发者。',
              duration: 0,
              showClose: true
            })
            notification.close()
            reject()
          }
        }
        resolve(null)
      }).catch((e) => {
        console.error(e)
        reject(e)
      })
    })
  }
  const logOut = (ifReload = true) => {
    logOutApi()
    setTimeout(() => {
      removeToken()
      if (ifReload) {
        location.reload()
      }
    })
  }
  const removeToken = () => {
    token.value = ''
    ifLogin.value = false
    for (let userinfoKey in userinfo) {
      userinfo[userinfoKey as keyof typeof userinfo] = null;
    }
  }
  const refreshSelfInfo = () => {
    getSelfInfo().then(res => {
      setUserStoreInfo(loginRole.value, userinfo, res)
    })
  }
  return {
    token,
    loginRole,
    userinfo,
    ifLogin,
    loginType,
    setLoginType,
    getLoginType,
    login,
    removeToken,
    logOut,
    refreshSelfInfo
  }
}, {
  persist: true,
})
