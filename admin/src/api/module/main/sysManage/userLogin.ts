import request from "@/api/request.ts";
import { LoginDto, MultiAuthUserDto, RegistDto } from "@/type/module/main/sysManage/user.ts";
import { encryptUtils } from "@dcts/common";

/**
 * 获取公钥
 */
export function generateLoginKey() {
  return request<{ uuid: string, publicKey: string }>({
    url: '/sys/user/generate-key',
    method: 'POST',
  })
}

/**
 * 注册
 * @param data
 */
export async function registApi(data: RegistDto) {
  if (!window.isSecureContext) {
    return request({
      url: '/sys/user/regist',
      method: 'POST',
      data: {
        ...data,
        password: encryptUtils.aes.encrypt(data.password),
        psdType: 'b'
      }
    })
  }
  const key = await generateLoginKey();
  const newPassword = await encryptUtils.rsa.encrypt(key.publicKey, data.password);
  return request({
    url: '/sys/user/regist',
    method: 'POST',
    data: {
      ...data,
      password: newPassword,
      psdType: 'c',
      passwordKeyUuid: key.uuid
    }
  })
}

type UserLoginVo = {
  token: string;
  loginRole: string;
  multiAuthUser: MultiAuthUserDto;
};

/**
 * 登录
 * @param data
 * @param ifAdminLogin
 */
export async function loginApi(data: LoginDto, ifAdminLogin = false) {
  if (!window.isSecureContext) {
    return request<UserLoginVo>({
      url: ifAdminLogin ? '/sys/user/adminlogin' : '/sys/user/login',
      method: 'POST',
      data: {
        ...data,
        password: encryptUtils.aes.encrypt(data.password),
        psdType: 'b'
      }
    })
  }
  const key = await generateLoginKey();
  const newPassword = await encryptUtils.rsa.encrypt(key.publicKey, data.password);
  return request<UserLoginVo>({
    url: ifAdminLogin ? '/sys/user/adminlogin' : '/sys/user/login',
    method: 'POST',
    data: {
      ...data,
      password: newPassword,
      psdType: 'c',
      passwordKeyUuid: key.uuid
    }
  })
}

/**
 * 登出
 */
export function logOutApi() {
  return request({
    url: '/sys/user/log-out',
    method: 'POST',
  })
}

/**
 * 获取验证码
 */
export function getVerificationCode() {
  return request({
    url: '/sys/user/verification-code',
    method: 'GET',
  })
}
