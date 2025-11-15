import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import {
  AdminNewUserDto,
  LoginDto,
  MultiAuthUserDto,
  RegistDto,
  ResetUserPsdDto,
  UpdPsdDto,
  UserDto,
  UserSelListDto,
} from './dto';
import { AuthService } from '../../../../infra/auth/auth.service';
import { HTTP } from '../../../../common/Enum';
import { final } from '../../../../util/base';
import { UserUnknownException } from '../../../../exception/user-unknown.exception';
import { UserPermissionDeniedException } from '../../../../exception/user-permission-denied.exception';
import { LogUserLoginFacadeService } from '../../sys-log/log-user-login/log-user-login.facade.service';
import { CacheTokenService } from '../../../../infra/cache/cache.token.service';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { NOT_ADMIN } from '../../sys-log/log-user-login/dto';
import * as svgCaptcha from 'svg-captcha';
import { Exception } from '../../../../exception/exception';
import { base, encryptUtils, idUtils } from '@dcts/common'
import { serverConfig } from '@dcts/config';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { IdentityService } from '../../../../identity/identity.service';
import { IpInfoDto } from '../../../../common/ipInfo';
import { UserRoleFacadeService } from '../user-role/user-role.facade.service';
import { RoleFacadeService } from '../role/role.facade.service';
import { UserDeptFacadeService } from '../user-dept/user-dept.facade.service';
import { DeptFacadeService } from '../dept/dept.facade.service';
import { UserUserGroupFacadeService } from '../../../algorithm/user-user-group/user-user-group.facade.service';
import { UserGroupFacadeService } from '../../../algorithm/user-group/user-group.facade.service';
import { AdminTopFacadeService } from '../admin-top/admin-top.facade.service';
import { SysConfigFacadeService } from '../sys-config/sys-config.facade.service';

@Injectable()
export class UserService {
  private maxLoginFailCount: number;

  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly authService: AuthService,
    private readonly logUserLoginFacadeService: LogUserLoginFacadeService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly bcs: BaseContextService,
    private readonly identityService: IdentityService,
    private readonly userRoleFacadeService: UserRoleFacadeService,
    private readonly roleFacadeService: RoleFacadeService,
    private readonly userDeptFacadeService: UserDeptFacadeService,
    private readonly deptFacadeService: DeptFacadeService,
    private readonly userUserGroupFacadeService: UserUserGroupFacadeService,
    private readonly userGroupFacadeService: UserGroupFacadeService,
    private readonly adminTopFacadeService: AdminTopFacadeService,
    private readonly sysConfigFacadeService: SysConfigFacadeService,
  ) {
    this.maxLoginFailCount = 10;
    this.bcs.setFieldSelectParam('sys_user', {
      notNullKeys: ['id', 'username'],
    });

    this.identityService.setMaxLoginFailCount(this.maxLoginFailCount);
  }

  async selUser(dto: UserSelListDto): Promise<R> {
    const ifWithRole = dto.ifWithRole;
    delete dto.ifWithRole;
    const res = await this.mysqlPrisma.findPage<UserDto>('sys_user', {
      data: dto,
      orderBy: false,
    });
    res.list.forEach((item) => {
      delete item.password;
    });
    if (ifWithRole !== final.Y) {
      return R.ok(res);
    }
    const topAdminUser = await this.adminTopFacadeService.getAdminUsersByUserId(res.list.map((item) => item.id));
    const res2 = [];
    const userIds = res.list.map((item) => item.id);
    const allUserRolesOfThoseUsers = await this.userRoleFacadeService.getByUserInfo(userIds, base.LoginRoleEnum.admin);
    const allRoleIdsOfThoseUsers = allUserRolesOfThoseUsers.map((item) => item.roleId);
    const allRolesOfThoseUsers = await this.roleFacadeService.getByIds(allRoleIdsOfThoseUsers);
    const allUserDeptsOfThoseUsers = await this.userDeptFacadeService.getByUserInfo(userIds, base.LoginRoleEnum.admin);
    const allUserDeptIdsOfThoseUsers = allUserDeptsOfThoseUsers.map((item) => item.deptId);
    const allDeptsOfThoseUsers = await this.deptFacadeService.getByIds(allUserDeptIdsOfThoseUsers);
    const allUserUserGroupsOfThoseUsers = await this.userUserGroupFacadeService.getByUserInfo(userIds, base.LoginRoleEnum.admin);
    const allUserUserGroupIdsOfThoseUsers = allUserUserGroupsOfThoseUsers.map((item) => item.userGroupId);
    const allUserGroupsOfThoseUsers = await this.userGroupFacadeService.getByIds(allUserUserGroupIdsOfThoseUsers);
    for (let i = 0; i < res.list.length; i++) {
      const roleIdsOfThisUser = allUserRolesOfThoseUsers.filter((item) => item.userId === res.list[i].id).map((item) => item.roleId);
      const rolesOfThisUser = allRolesOfThoseUsers.filter((item) => roleIdsOfThisUser.indexOf(item.id) > -1);
      const deptIdsOfThisUser = allUserDeptsOfThoseUsers.filter((item) => item.userId === res.list[i].id).map((item) => item.deptId);
      const deptsOfThisUser = allDeptsOfThoseUsers.filter((item) => deptIdsOfThisUser.indexOf(item.id) > -1);
      const ugIdsOfThisUser = allUserUserGroupsOfThoseUsers.filter((item) => item.userId === res.list[i].id).map((item) => item.userGroupId);
      const ugsOfThisUser = allUserGroupsOfThoseUsers.filter((item) => ugIdsOfThisUser.indexOf(item.id) > -1);
      res2.push({
        ...res.list[i],
        roles: rolesOfThisUser,
        depts: deptsOfThisUser,
        ugs: ugsOfThisUser,
        ifTopAdmin: topAdminUser.findIndex((item) => item.userId === res.list[i].id) > -1,
      });
    }
    return R.ok({
      ...res,
      list: res2,
    });
  }

  async getSelfInfo(): Promise<R> {
    const userinfo = await this.identityService.getUserInfo();
    if (userinfo.ifOk) {
      return R.ok(userinfo.multiAuthUser);
    }
    throw new UserUnknownException();
  }

  async selOnesUser(ids: string[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<UserDto>('sys_user', ids);
    res.forEach((item) => {
      delete item.password;
    });
    return R.ok(res);
  }

  async insUser(dto: AdminNewUserDto): Promise<R> {
    const user = await this.mysqlPrisma.findFirst<UserDto>('sys_user', { username: dto.username });
    if (user) {
      throw new Exception('用户名已存在。');
    }
    await this.mysqlPrisma.create<UserDto>(
      'sys_user',
      {
        ...dto,
        password: await encryptUtils.bcrypt.hashPassword(dto.password),
        id: idUtils.genId(5, false),
      },
      { ifCustomizeId: true },
    );
    return R.ok(true);
  }

  async updUser(dto: MultiAuthUserDto): Promise<R> {
    const b = await this.identityService.updUserInfo(dto);
    if (b) {
      return R.ok(true);
    }
    throw new UserUnknownException();
  }

  async updPsd(dto: UpdPsdDto): Promise<R> {
    const b = await this.identityService.updUserPsd(dto);
    if (b) {
      return R.ok(true);
    }
    throw new UserUnknownException();
  }

  async adminResetUserPsd(dto: ResetUserPsdDto): Promise<R> {
    if (!(await this.authService.ifAdminUserUpdNotAdminUser(this.bcs.getUserData().userId, dto.id))) {
      throw new UserPermissionDeniedException();
    }
    await this.mysqlPrisma.updateById<UserDto>('sys_user', {
      ...dto,
      password: await encryptUtils.bcrypt.hashPassword(dto.password),
    });
    return R.ok(true);
  }

  async generateKey(): Promise<R> {
    const key = await encryptUtils.rsa.generateKey();
    const uuid = idUtils.randomUUID();
    await this.cacheTokenService.savePasswordKey(uuid, key);
    return R.ok({
      uuid,
      publicKey: key.publicKey,
    });
  }

  async regist(dto: RegistDto): Promise<R> {
    const sysConfigs = await this.sysConfigFacadeService.getAllConfigs();
    if (sysConfigs.length > 0) {
      const sysConfig = sysConfigs[0];
      if (sysConfig.ifAllowUserRegist === final.N) {
        throw new Exception('当前不允许新用户注册。');
      }
    }
    const b = await this.identityService.regist(dto);
    if (b) {
      return R.ok('注册成功。');
    }
    throw new UserUnknownException();
  }

  async login(
    dto: LoginDto,
    netInfo: IpInfoDto,
    ifAdminLogin = false,
  ): Promise<
    R<{
      token: string;
      loginRole: string;
      multiAuthUser: MultiAuthUserDto;
    }>
  > {
    if (!serverConfig.currentConfig().ifIgnoreVerificationCode) {
      const vcode = await this.cacheTokenService.getVerificationCode(dto.verificationCodeUuid);
      if (!vcode) {
        throw new Exception('验证码已过期。');
      }
      if (vcode.toLowerCase() !== dto.verificationCode.toLowerCase()) {
        throw new Exception('验证码错误。');
      }
    }
    const b = await this.identityService.login(dto, netInfo, ifAdminLogin);
    if (b) {
      return R.ok(b);
    }
    throw new UserUnknownException();
  }

  async adminlogin(dto: LoginDto, netInfo: IpInfoDto): Promise<R> {
    const userinfo = await this.login(dto, netInfo, true);
    if (userinfo.code !== HTTP.SUCCESS().code) {
      throw new Exception(userinfo.msg);
    }
    let userId = '';
    if (userinfo.data.multiAuthUser.admin) userId = userinfo.data.multiAuthUser.admin.id;
    if (userinfo.data.multiAuthUser.visitor) userId = userinfo.data.multiAuthUser.visitor.id;
    const ifAdminUser = await this.authService.ifAdminUser(userId, dto.loginRole);
    if (ifAdminUser) {
      await this.logUserLoginFacadeService.insLogUserLogin({
        userId: userId,
        loginRole: dto.loginRole,
        loginType: base.LoginTypeEnum.pw,
        loginIp: netInfo.ip,
        loginPosition: '',
        loginBrowser: netInfo.browser,
        loginOs: netInfo.os,
        ifSuccess: true,
      });
      return R.ok(userinfo.data);
    } else {
      await this.logUserLoginFacadeService.insLogUserLogin(
        {
          userId: userId,
          loginRole: dto.loginRole,
          loginType: base.LoginTypeEnum.pw,
          loginIp: netInfo.ip,
          loginPosition: '',
          loginBrowser: netInfo.browser,
          loginOs: netInfo.os,
          ifSuccess: false,
        },
        NOT_ADMIN,
        '不是管理员用户',
      );
      throw new Exception('你不是管理员用户。');
    }
    throw new UserUnknownException();
  }

  async logOut(): Promise<R> {
    await this.cacheTokenService.deleteToken(this.bcs.getUserData().token);
    return R.ok(true);
  }

  async getVerificationCode(): Promise<R> {
    const captcha = svgCaptcha.create({
      noise: 3,
      ignoreChars: 'Oo01iIlt',
      width: 120,
      height: 40,
      fontSize: 45,
    });
    const text = captcha.text;
    const uuid = idUtils.randomUUID();
    await this.cacheTokenService.saveVerificationCode(uuid, text);
    return R.ok({ uuid, svg: captcha.data });
  }
}
