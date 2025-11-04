import { useUserStore } from "@/store/module/user.ts";
import { base, objectUtils } from "@dcts/common";
import { UnwrapNestedRefs } from "vue";
import { MultiAuthUserDto, UserDto } from "@/type/module/main/sysManage/user.ts";
import { UserVisitorDto } from "@/type/module/main/otherUser/userVisitor.ts";
import { DctsUserDto } from "@/type/module/dcts/user/dctsUser.ts";

/**
 * 当前登录身份是否为管理员
 */
export function identityIfAdmin() {
  const userStore = useUserStore();
  return userStore.getLoginType() === base.LoginRoleEnum.admin
}

/**
 * 获取当前用户信息
 */
export function getCurrentUserInfo() {
  const userStore = useUserStore();
  const ret = {
    username: '???',
    avatar: '???',
    nickname: '???',
  }
  const userinfo = userStore.userinfo;
  if (userStore.loginRole === base.LoginRoleEnum.admin) {
    ret.username = userinfo.admin!.username;
    ret.avatar = userinfo.admin!.avatar;
    ret.nickname = userinfo.admin!.nickname;
  }
  if (userStore.loginRole === base.LoginRoleEnum.visitor) {
    ret.username = userinfo.visitor!.username;
    ret.avatar = userinfo.visitor!.avatar;
    ret.nickname = userinfo.visitor!.nickname;
  }
  return ret;
}

/**
 * 设置用户store信息
 * @param loginRole
 * @param to
 * @param from
 */
export function setUserStoreInfo(loginRole: string, to: UnwrapNestedRefs<MultiAuthUserDto>, from: MultiAuthUserDto) {
  if (loginRole === base.LoginRoleEnum.admin) {
    to.admin = new UserDto()
    objectUtils.copyObject(to.admin, from.admin)
  }
  if (loginRole === base.LoginRoleEnum.visitor) {
    to.visitor = new UserVisitorDto()
    objectUtils.copyObject(to.visitor, from.visitor)
  }
  if (loginRole === base.LoginRoleEnum.dcts) {
    to.dctsUser = new DctsUserDto()
    objectUtils.copyObject(to.dctsUser, from.dctsUser)
  }
}

/**
 * 用户头像修改页，拼接请求参数
 * @param user
 * @param fileName
 */
export function buildUserAvatarDto(user: { [P in keyof MultiAuthUserDto]: Partial<MultiAuthUserDto[P]> }, fileName: string) {
  const userStore = useUserStore();
  if (userStore.loginRole === base.LoginRoleEnum.admin) {
    user.admin = {
      id: userStore.userinfo.admin!.id,
      avatar: fileName
    }
  }
  if (userStore.loginRole === base.LoginRoleEnum.visitor) {
    user.visitor = {
      id: userStore.userinfo.visitor!.id,
      avatar: fileName
    }
  }
}

/**
 * 用户信息修改页，拼接请求参数
 * @param user
 * @param param
 */
export function buildUserInfoDto(user: { [P in keyof MultiAuthUserDto]: Partial<MultiAuthUserDto[P]> }, param: { nickname: string, username: string }) {
  const userStore = useUserStore();
  if (userStore.loginRole === base.LoginRoleEnum.admin) {
    user.admin = {
      id: userStore.userinfo.admin!.id,
      nickname: param.nickname,
      username: param.username,
    }
  }
  if (userStore.loginRole === base.LoginRoleEnum.visitor) {
    user.visitor = {
      id: userStore.userinfo.visitor!.id,
      nickname: param.nickname,
      username: param.username,
    }
  }
}

/**
 * 用户信息修改页，设置参数
 * @param state
 * @param res
 */
export function setUserInfoDto(state: {
  id: string
  nickname: string
  username: string
  avatar: string
}, res: MultiAuthUserDto) {
  const userStore = useUserStore();
  if (userStore.loginRole === base.LoginRoleEnum.admin) {
    const userDto = res.admin!
    state.id = userDto.id
    state.nickname = userDto.nickname
    state.username = userDto.username
    state.avatar = userDto.avatar
  }
  if (userStore.loginRole === base.LoginRoleEnum.visitor) {
    const userDto = res.visitor!
    state.id = userDto.id
    state.nickname = userDto.nickname
    state.username = userDto.username
    state.avatar = userDto.avatar
  }
}
