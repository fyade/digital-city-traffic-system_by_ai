import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../infra/prisma/mysql.prisma.service';
import { BaseContextService } from '../infra/base-context/base-context.service';
import { base, encryptUtils, idUtils, timeUtils } from '@dcts/common';
import { LoginDto, MultiAuthUserDto, RegistDto, UpdPsdDto, UserDto } from '../module/main/sys-manage/user/dto';
import { UserVisitorDto } from '../module/main/other-user/user-visitor/dto';
import { Exception } from '../exception/exception';
import { PostgresqlPrismaService } from '../infra/prisma/postgresql.prisma.service';
import { DctsUserDto } from '../module/dcts/user/dcts-user/dto';
import { UserUnknownException } from '../exception/user-unknown.exception';
import { PASSWORD_ERROR } from '../module/main/sys-log/log-user-login/dto';
import { CacheTokenService } from '../infra/cache/cache.token.service';
import { LogUserLoginFacadeService } from '../module/main/sys-log/log-user-login/log-user-login.facade.service';
import { IpInfoDto } from '../common/ipInfo';

@Injectable()
export class IdentityService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly pgsqlPrisma: PostgresqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly logUserLoginFacadeService: LogUserLoginFacadeService,
  ) {}

  private maxLoginFailCount: number | null = null;

  public setMaxLoginFailCount(val: number) {
    this.maxLoginFailCount = val;
  }

  /**
   * 当前登录身份是否为管理员
   * @param loginRole
   */
  identityIfAdmin(loginRole: string) {
    return loginRole === base.LoginRoleEnum.admin;
  }

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const { loginRole, userId } = this.bcs.getUserData();
    const multiAuthUser = new MultiAuthUserDto();
    let ifOk = false;
    if (loginRole === base.LoginRoleEnum.admin) {
      const user = await this.mysqlPrisma.findById<UserDto>('sys_user', userId);
      delete user.password;
      multiAuthUser.admin = user;
      ifOk = true;
    }
    if (loginRole === base.LoginRoleEnum.visitor) {
      const user = await this.mysqlPrisma.findById<UserVisitorDto>('sys_user_visitor', userId);
      delete user.password;
      multiAuthUser.visitor = user;
      ifOk = true;
    }
    return {
      multiAuthUser,
      ifOk,
    };
  }

  /**
   * 修改用户信息
   * @param dto
   */
  async updUserInfo(dto: MultiAuthUserDto) {
    const loginRole = this.bcs.getUserData().loginRole;
    if (loginRole === base.LoginRoleEnum.admin) {
      await this.mysqlPrisma.updateById<UserDto>('sys_user', dto.admin);
      return true;
    }
    if (loginRole === base.LoginRoleEnum.visitor) {
      await this.mysqlPrisma.updateById<UserVisitorDto>('sys_user_visitor', dto.visitor);
      return true;
    }
    return false;
  }

  /**
   * 修改用户密码
   * @param dto
   */
  async updUserPsd(dto: UpdPsdDto) {
    const { loginRole, userId } = this.bcs.getUserData();
    if (loginRole === base.LoginRoleEnum.admin) {
      const user_ = await this.mysqlPrisma.findById<UserDto>('sys_user', userId);
      const ifUserYes = await encryptUtils.bcrypt.comparePassword(dto.oldp, user_.password);
      if (!ifUserYes) {
        throw new Exception('旧密码错误。');
      }
      await this.mysqlPrisma.updateById('sys_user', {
        id: user_.id,
        password: await encryptUtils.bcrypt.hashPassword(dto.newp1),
      });
      return true;
    }
    if (loginRole === base.LoginRoleEnum.visitor) {
      const user_ = await this.mysqlPrisma.findById<UserVisitorDto>('sys_user_visitor', userId);
      const ifUserYes = await encryptUtils.bcrypt.comparePassword(dto.oldp, user_.password);
      if (!ifUserYes) {
        throw new Exception('旧密码错误。');
      }
      await this.mysqlPrisma.updateById('sys_user_visitor', {
        id: user_.id,
        password: await encryptUtils.bcrypt.hashPassword(dto.newp1),
      });
      return true;
    }
    return false;
  }

  /**
   * 用户注册
   * @param dto
   */
  async regist(dto: RegistDto) {
    if (dto.loginRole === base.LoginRoleEnum.admin) {
      const user = await this.mysqlPrisma.findFirst<UserDto>('sys_user', {
        username: dto.username,
      });
      if (user) {
        throw new Exception('用户名已被使用。');
      }
      const userid = idUtils.genId(5, false);
      await this.mysqlPrisma.create<UserDto>(
        'sys_user',
        {
          id: userid,
          username: dto.username,
          password: await encryptUtils.bcrypt.hashPassword(dto.password),
          createRole: dto.loginRole,
          updateRole: dto.loginRole,
          createBy: userid,
          updateBy: userid,
        },
        { ifCustomizeId: true },
      );
      return true;
    }
    if (dto.loginRole === base.LoginRoleEnum.visitor) {
      const user = await this.mysqlPrisma.findFirst<UserVisitorDto>('sys_user_visitor', {
        username: dto.username,
      });
      if (user) {
        throw new Exception('用户名已被使用。');
      }
      const userid = idUtils.genId(10, false);
      await this.mysqlPrisma.create<UserVisitorDto>(
        'sys_user_visitor',
        {
          id: userid,
          username: dto.username,
          password: await encryptUtils.bcrypt.hashPassword(dto.password),
          createRole: dto.loginRole,
          updateRole: dto.loginRole,
          createBy: userid,
          updateBy: userid,
        },
        { ifCustomizeId: true },
      );
      return true;
    }
    if (dto.loginRole === base.LoginRoleEnum.dcts) {
      const user = await this.pgsqlPrisma.findFirst<DctsUserDto>('dcts_user', {
        username: dto.username
      })
      if (user) {
        throw new Exception('用户名已被使用。');
      }
      const userid = idUtils.genId(10, false);
      await this.pgsqlPrisma.create<DctsUserDto>('dcts_user', {
        id: userid,
        username: dto.username,
        password: await encryptUtils.bcrypt.hashPassword(dto.password),
        createRole: dto.loginRole,
        updateRole: dto.loginRole,
        createBy: userid,
        updateBy: userid,
      }, {ifCustomizeId: true})
      return true;
    }
    return false;
  }

  /**
   * 用户登录
   * @param dto
   * @param netInfo
   * @param ifAdminLogin
   */
  async login(dto: LoginDto, netInfo: IpInfoDto, ifAdminLogin = false) {
    const multiAuthUser = new MultiAuthUserDto();
    if (dto.loginRole === base.LoginRoleEnum.admin) {
      const user = await this.mysqlPrisma.findFirst<UserDto>('sys_user', {
        username: dto.username,
      });
      if (!user) {
        throw new UserUnknownException();
      }
      const loginlogs = await this.logUserLoginFacadeService.selAllLogUserLogin(user.id, netInfo.ip, dto.loginRole);
      if (loginlogs.length >= this.maxLoginFailCount) {
        const sort = loginlogs.sort((a, b) => timeUtils.timestamp(a.createTime) - timeUtils.timestamp(b.createTime));
        const number = Math.ceil(
          24 - (timeUtils.timestamp() - timeUtils.timestamp(sort[0].createTime)) / (1000 * 60 * 60),
        );
        throw new Exception(`您的账号在当前IP密码错误次数过多，请${number}小时后重试或更换网络环境重试。`);
      }
      const b1 = await encryptUtils.bcrypt.comparePassword(dto.password, user.password);
      if (!b1) {
        await this.logUserLoginFacadeService.insLogUserLogin(
          {
            userId: user.id,
            loginRole: dto.loginRole,
            loginType: base.LoginTypeEnum.pw,
            loginIp: netInfo.ip,
            loginPosition: '',
            loginBrowser: netInfo.browser,
            loginOs: netInfo.os,
            ifSuccess: b1,
          },
          PASSWORD_ERROR,
        );
        throw new Exception(`密码错误，还剩${this.maxLoginFailCount - loginlogs.length - 1}次机会。`);
      }
      if (!ifAdminLogin) {
        await this.logUserLoginFacadeService.insLogUserLogin({
          userId: user.id,
          loginRole: dto.loginRole,
          loginType: base.LoginTypeEnum.pw,
          loginIp: netInfo.ip,
          loginPosition: '',
          loginBrowser: netInfo.browser,
          loginOs: netInfo.os,
          ifSuccess: b1,
        });
      }
      delete user.password;
      const token = await this.cacheTokenService.genToken(user.id, user.username, dto.loginRole, netInfo);
      multiAuthUser.admin = user;
      return {
        token: token,
        loginRole: dto.loginRole,
        multiAuthUser: multiAuthUser,
      };
    }
    if (dto.loginRole === base.LoginRoleEnum.visitor) {
      const user = await this.mysqlPrisma.findFirst<UserVisitorDto>('sys_user_visitor', {
        username: dto.username,
      });
      if (!user) {
        throw new UserUnknownException();
      }
      const loginlogs = await this.logUserLoginFacadeService.selAllLogUserLogin(user.id, netInfo.ip, dto.loginRole);
      if (loginlogs.length >= this.maxLoginFailCount) {
        const sort = loginlogs.sort((a, b) => timeUtils.timestamp(a.createTime) - timeUtils.timestamp(b.createTime));
        const number = Math.ceil(
          24 - (timeUtils.timestamp() - timeUtils.timestamp(sort[0].createTime)) / (1000 * 60 * 60),
        );
        throw new Exception(`您的账号在当前IP密码错误次数过多，请${number}小时后重试或更换网络环境重试。`);
      }
      const b1 = await encryptUtils.bcrypt.comparePassword(dto.password, user.password);
      if (!b1) {
        await this.logUserLoginFacadeService.insLogUserLogin(
          {
            userId: user.id,
            loginRole: dto.loginRole,
            loginType: base.LoginTypeEnum.pw,
            loginIp: netInfo.ip,
            loginPosition: '',
            loginBrowser: netInfo.browser,
            loginOs: netInfo.os,
            ifSuccess: b1,
          },
          PASSWORD_ERROR,
        );
        throw new Exception(`密码错误，还剩${this.maxLoginFailCount - loginlogs.length - 1}次机会。`);
      }
      if (!ifAdminLogin) {
        await this.logUserLoginFacadeService.insLogUserLogin({
          userId: user.id,
          loginRole: dto.loginRole,
          loginType: base.LoginTypeEnum.pw,
          loginIp: netInfo.ip,
          loginPosition: '',
          loginBrowser: netInfo.browser,
          loginOs: netInfo.os,
          ifSuccess: b1,
        });
      }
      delete user.password;
      const token = await this.cacheTokenService.genToken(user.id, user.username, dto.loginRole, netInfo);
      multiAuthUser.visitor = user;
      return {
        token: token,
        loginRole: dto.loginRole,
        multiAuthUser: multiAuthUser,
      };
    }
    if (dto.loginRole === base.LoginRoleEnum.dcts) {
      const user = await this.pgsqlPrisma.findFirst<DctsUserDto>('dcts_user', {
        username: dto.username
      })
      if (!user) {
        throw new UserUnknownException();
      }
      const loginlogs = await this.logUserLoginFacadeService.selAllLogUserLogin(user.id, netInfo.ip, dto.loginRole);
      if (loginlogs.length >= this.maxLoginFailCount) {
        const sort = loginlogs.sort((a, b) => timeUtils.timestamp(a.createTime) - timeUtils.timestamp(b.createTime))
        const number = Math.ceil(24 - (timeUtils.timestamp() - timeUtils.timestamp(sort[0].createTime)) / (1000 * 60 * 60));
        throw new Exception(`您的账号在当前IP密码错误次数过多，请${number}小时后重试或更换网络环境重试。`);
      }
      const b1 = await encryptUtils.bcrypt.comparePassword(dto.password, user.password)
      if (!b1) {
        await this.logUserLoginFacadeService.insLogUserLogin(
            {
              userId: user.id,
              loginRole: dto.loginRole,
              loginType: base.LoginTypeEnum.pw,
              loginIp: netInfo.ip,
              loginPosition: '',
              loginBrowser: netInfo.browser,
              loginOs: netInfo.os,
              ifSuccess: b1,
            },
            PASSWORD_ERROR,
        );
        throw new Exception(`密码错误，还剩${this.maxLoginFailCount - loginlogs.length - 1}次机会。`);
      }
      if (!ifAdminLogin) {
        await this.logUserLoginFacadeService.insLogUserLogin({
          userId: user.id,
          loginRole: dto.loginRole,
          loginType: base.LoginTypeEnum.pw,
          loginIp: netInfo.ip,
          loginPosition: '',
          loginBrowser: netInfo.browser,
          loginOs: netInfo.os,
          ifSuccess: b1,
        });
      }
      delete user.password;
      const token = await this.cacheTokenService.genToken(user.id, user.username, dto.loginRole, netInfo);
      multiAuthUser.dctsUser = user
      return {
        token: token,
        loginRole: dto.loginRole,
        multiAuthUser: multiAuthUser,
      };
    }
    return null;
  }
}
