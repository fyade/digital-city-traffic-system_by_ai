import request from "@/api/request.ts";
import {
  EmailCodeDto,
  LoginCodeDto,
  LoginDto,
  MultiAuthUserDto,
  Regist2Dto,
  RegistDto
} from "@/type/module/main/sysManage/user.ts";
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

/**
 * 注册
 * @param data
 */
export async function regist2Api(data: Regist2Dto) {
  if (!window.isSecureContext) {
    return request({
      url: '/sys/user/regist2',
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
    url: '/sys/user/regist2',
    method: 'POST',
    data: {
      ...data,
      password: newPassword,
      psdType: 'c',
      passwordKeyUuid: key.uuid
    }
  })
}

export async function getEmailCodeApi(data: EmailCodeDto) {
  return request({
    url: '/sys/user/get-email-code',
    method: 'POST',
    data: data,
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
 * 验证码登录
 * @param data
 * @param ifAdminLogin
 */
export async function loginCodeApi(data: LoginCodeDto, ifAdminLogin = false) {
  return request<UserLoginVo>({
    url: ifAdminLogin ? '/sys/user/adminlogin-code' : '/sys/user/login-code',
    method: 'POST',
    data: data,
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
