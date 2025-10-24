import { final } from '../../util/base';
import { Injectable } from '@nestjs/common';
import { LogAlgorithmCallDto } from '../../module/algorithm/log-algorithm-call/dto';
import { getIpInfoFromRequest } from '../../util/RequestUtils';
import { UserGroupPermissionDto } from '../../module/algorithm/user-group-permission/dto';
import { Exception } from '../../exception/exception';
import { Request } from 'express';
import { MenuDto } from '../../module/main/sys-manage/menu/dto';
import { MenuIpWhiteListDto } from '../../module/main/sys-manage/menu-ip-white-list/dto';
import { BaseContextService } from '../base-context/base-context.service';
import { CachePermissionService } from '../cache/cache.permission.service';
import { UserTableDefaultPermissionDto } from '../../module/main/other-user/user-table-default-permission/dto';
import { SysDto } from '../../module/main/sys-manage/sys/dto';
import { base, baseUtils, timeUtils } from '@dcts/common';
import { MenuThrottleDto } from '../../module/main/sys-manage/menu-throttle/dto';
import { WinstonService } from '../winston/winston.service';
import { MysqlPrismaoService } from '../prisma/mysql.prismao.service';
import { PrismaoService } from '../prisma/prismao.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismao: PrismaoService,
    private readonly mysqlPrismao: MysqlPrismaoService,
    private readonly cachePermissionService: CachePermissionService,
    private readonly bcs: BaseContextService,
    private readonly winston: WinstonService,
  ) {}

  /**
   * 根据 apiKey 获取 userId
   * @param apiKey
   */
  async getUserIdByApiKey(apiKey: string) {
    const data = await this.mysqlPrismao.sys_user_api_key.findMany({
      where: {
        api_key: apiKey,
        ...this.prismao.defaultSelArg().where,
      },
    });
    return data[0];
  }

  /**
   * 是否管理员用户
   * @param userId
   * @param loginRole
   */
  async ifAdminUser(userId: string, loginRole: string) {
    if (await this.hasTopAdminPermission(loginRole, userId)) {
      return true;
    }
    const { allRoleIds, allDeptIds } = await this.rolesAndDeptsOfUser(userId, loginRole, true);
    return allRoleIds.length > 0 || allDeptIds.length > 0;
  }

  /**
   * 是否超级管理员用户
   * @param loginRole
   * @param userId
   */
  async hasTopAdminPermission(loginRole: string, userId: string) {
    const s = await this.cachePermissionService.getAdminTopInCache(loginRole, userId);
    if (s) {
      return s === final.Y;
    }
    if (loginRole === base.LoginRoleEnum.admin) {
      const admintop = await this.mysqlPrismao.sys_admin_top.findFirst({
        where: {
          user_id: userId,
          ...this.prismao.defaultSelArg().where,
        },
      });
      const b = !!admintop;
      await this.cachePermissionService.setAdminTopInCache(loginRole, userId, b);
      return b;
    }
    return false;
  }

  /**
   * 用户是否有某权限
   * @param userId
   * @param permission
   * @param loginRole
   */
  async hasAdminPermissionByUserid(userId: string, permission: string, loginRole: string) {
    const b = await this.cachePermissionService.ifHavePermissionInCache(userId, permission, loginRole);
    if (b) {
      return b === final.Y;
    }
    if (await this.hasTopAdminPermission(loginRole, userId)) {
      return true;
    }
    const permissionsOfUser = await this.permissionsOfUser({ userId: userId, permission, loginRole });
    const index = permissionsOfUser.findIndex((item) => item.perms === permission);
    await this.cachePermissionService.setPermissionInCache(userId, permission, loginRole, index > -1);
    return index > -1;
  }

  /**
   * 是否公共接口
   * @param permission
   */
  async ifPublicInterface(permission: string) {
    const ifPublicInterfaceInCache = await this.cachePermissionService.getIfPublicPermissionInCache(permission);
    if (ifPublicInterfaceInCache) {
      return ifPublicInterfaceInCache === final.Y;
    }
    const raw = await this.mysqlPrismao.sys_menu.findMany({
      where: {
        perms: permission,
        if_public: final.Y,
        if_disabled: final.N,
        ...this.prismao.defaultSelArg().where,
      },
    });
    const b = raw.length > 0;
    await this.cachePermissionService.setPublicPermissionInCache(permission, b ? final.Y : final.N);
    return b;
  }

  /**
   * 请求源是否在接口的ip白名单中
   * @param permission
   * @param request
   */
  async ifIpInWhiteListOfPermission(permission: string, request: Request): Promise<boolean> {
    const menuIpWhiteLists = await this.cachePermissionService.getIpWhiteListOfPermissionInCache(permission);
    const ips: MenuIpWhiteListDto[] = [];
    if (menuIpWhiteLists) {
      const parse = JSON.parse(menuIpWhiteLists) as MenuIpWhiteListDto[];
      ips.push(...parse);
    } else {
      // 接口是否存在
      const menus = await this.mysqlPrismao.sys_menu.findMany({
        where: {
          if_disabled: final.N,
          type: base.MenuTypeEnum.T_IS,
          id: {
            in: (
              await this.mysqlPrismao.sys_menu.findMany({
                where: {
                  if_disabled: final.N,
                  type: base.MenuTypeEnum.T_Inter,
                  perms: permission,
                  ...this.prismao.defaultSelArg().where,
                },
                select: {
                  parent_id: true,
                },
              })
            ).map((item) => item.parent_id),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      if (menus.length === 0) {
        return true;
      }
      const ips__ = await this.mysqlPrismao.sys_menu_ip_white_list.findMany({
        where: {
          type: base.MenuTypeEnum.T_IS,
          menu_id: {
            in: menus.map((item) => item.id),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      const ips_ = baseUtils.objToCamelCase<MenuIpWhiteListDto[]>(ips__);
      ips.push(...ips_);
      await this.cachePermissionService.setIpWhiteListOfPermissionInCache(permission, ips_);
    }
    if (ips.length === 0) {
      return true;
    }
    const ipInfoFromRequest = getIpInfoFromRequest(request);
    const whiteList_ip = ips.filter((item) => item.fromType === base.TMWLTypeEnum.T_IP).map((item) => item.whiteList);
    if (
      whiteList_ip.findIndex((wip) => {
        return wip.startsWith('http://') || wip.startsWith('https://')
          ? wip === `${ipInfoFromRequest.proto}://${ipInfoFromRequest.ip}`
          : wip === ipInfoFromRequest.ip;
      }) > -1 ||
      (ipInfoFromRequest.ip === '::1' && whiteList_ip.includes('127.0.0.1')) ||
      (ipInfoFromRequest.ip === '::1' && whiteList_ip.includes(`${ipInfoFromRequest.proto}://127.0.0.1`))
    ) {
      return true;
    }
    const whiteList_host = ips
      .filter((item) => item.fromType === base.TMWLTypeEnum.T_HOST)
      .map((item) => item.whiteList);
    if (
      whiteList_host.findIndex((who) => {
        return who.startsWith('http://') || who.startsWith('https://')
          ? who === `${ipInfoFromRequest.proto}://${ipInfoFromRequest.host}`
          : who === ipInfoFromRequest.host;
      }) > -1
    ) {
      return true;
    }
    return false;
  }

  /**
   * 用户的系统
   * @param userId
   * @param loginRole
   */
  async systemsOfUser(userId: string, loginRole: string) {
    const retarr = [];
    const sysPublicSelectParam = { if_disabled: final.N };
    const ifTopAdmin = await this.hasTopAdminPermission(loginRole, userId);
    if (ifTopAdmin) {
      const userSyss_ = await this.mysqlPrismao.sys_sys.findMany({
        where: {
          ...sysPublicSelectParam,
          ...this.prismao.defaultSelArg().where,
        },
        orderBy: {
          order_num: 'asc',
        },
      });
      const userSyss = baseUtils.objToCamelCase<SysDto[]>(userSyss_);
      retarr.push(...userSyss);
      return retarr;
    }
    const { allRoleIds, allDeptIds } = await this.rolesAndDeptsOfUser(userId, loginRole);
    const allSysIdsOfRole = await this.mysqlPrismao.sys_role_sys.findMany({
      select: {
        sys_id: true,
      },
      where: {
        role_id: {
          in: allRoleIds,
        },
        ...this.prismao.defaultSelArg().where,
      },
    });
    const allSysIdsOfDept = await this.mysqlPrismao.sys_dept_sys.findMany({
      select: {
        sys_id: true,
      },
      where: {
        dept_id: {
          in: allDeptIds,
        },
        ...this.prismao.defaultSelArg().where,
      },
    });
    const userSyss_ = await this.mysqlPrismao.sys_sys.findMany({
      where: {
        id: {
          in: [...allSysIdsOfRole.map((item) => item.sys_id), ...allSysIdsOfDept.map((item) => item.sys_id)],
        },
        ...sysPublicSelectParam,
        ...this.prismao.defaultSelArg().where,
      },
      orderBy: {
        order_num: 'asc',
      },
    });
    const userSyss = baseUtils.objToCamelCase<SysDto[]>(userSyss_);
    retarr.push(...userSyss);
    return retarr;
  }

  /**
   * 用户的权限
   * @param userId
   * @param loginRole
   * @param permission
   * @param sysId
   * @param menuType
   */
  async permissionsOfUser({
    userId,
    loginRole,
    permission,
    sysId,
    menuType = [base.MenuTypeEnum.T_MENU, base.MenuTypeEnum.T_COMP, base.MenuTypeEnum.T_IS, base.MenuTypeEnum.T_Inter],
  }: {
    userId: string;
    loginRole: string;
    permission?: string;
    sysId?: number;
    menuType?: string[];
  }) {
    const retarr = [];
    const menuPublicSelectParam = {
      type: {
        in: menuType,
      },
      ...(sysId ? { sys_id: Number(sysId) } : {}),
      ...(permission ? { perms: permission } : {}),
      if_disabled: final.N,
    };
    const ifTopAdmin = await this.hasTopAdminPermission(loginRole, userId);
    if (ifTopAdmin) {
      const userPermissions_ = await this.mysqlPrismao.sys_menu.findMany({
        where: {
          ...menuPublicSelectParam,
          ...this.prismao.defaultSelArg().where,
        },
        orderBy: {
          order_num: 'asc',
        },
      });
      const userPermissions = baseUtils.objToCamelCase<MenuDto[]>(userPermissions_);
      retarr.push(...userPermissions);
      return retarr;
    }
    const { allRoleIds, allDeptIds } = await this.rolesAndDeptsOfUser(userId, loginRole);
    const allPermissionIdsOfRole = await this.mysqlPrismao.sys_role_permission.findMany({
      select: {
        permission_id: true,
      },
      where: {
        role_id: {
          in: allRoleIds,
        },
        ...this.prismao.defaultSelArg().where,
      },
    });
    const allPermissionIdsOfDept = await this.mysqlPrismao.sys_dept_permission.findMany({
      select: {
        permission_id: true,
      },
      where: {
        dept_id: {
          in: allDeptIds,
        },
        ...this.prismao.defaultSelArg().where,
      },
    });
    const userPermissions_ = await this.mysqlPrismao.sys_menu.findMany({
      where: {
        id: {
          in: [
            ...allPermissionIdsOfRole.map((item) => item.permission_id),
            ...allPermissionIdsOfDept.map((item) => item.permission_id),
          ],
        },
        ...menuPublicSelectParam,
        ...this.prismao.defaultSelArg().where,
      },
      orderBy: {
        order_num: 'asc',
      },
    });
    const userPermissions = baseUtils.objToCamelCase<MenuDto[]>(userPermissions_);
    retarr.push(...userPermissions);
    return retarr;
  }

  /**
   * 某权限是否被禁用
   * @param permission
   */
  async permissionIfDisabled(permission: string) {
    const newVar = await this.mysqlPrismao.sys_menu.findMany({
      where: {
        perms: permission,
        if_disabled: final.Y,
        ...this.prismao.defaultSelArg().where,
      },
    });
    return newVar.length > 0;
  }

  /**
   * 是否请求频繁
   * @param request
   * @param permission
   */
  async ifRequestThrottle(request: Request, permission: string) {
    const ipInfo = getIpInfoFromRequest(request);
    const menuThrottles: MenuThrottleDto[] = [];
    const s = await this.cachePermissionService.getMenuThrottleInCache(permission);
    if (s) {
      const parse = JSON.parse(s) as MenuThrottleDto[];
      menuThrottles.push(...parse);
    } else {
      const menus = await this.mysqlPrismao.sys_menu.findMany({
        where: {
          if_disabled: final.N,
          type: base.MenuTypeEnum.T_IS,
          id: {
            in: (
              await this.mysqlPrismao.sys_menu.findMany({
                where: {
                  if_disabled: final.N,
                  type: base.MenuTypeEnum.T_Inter,
                  perms: permission,
                  ...this.prismao.defaultSelArg().where,
                },
                select: {
                  parent_id: true,
                },
              })
            ).map((item) => item.parent_id),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      if (menus.length === 0) {
        return true;
      }
      const menuThrottles_ = await this.mysqlPrismao.sys_menu_throttle.findMany({
        where: {
          menu_id: {
            in: menus.map((item) => item.id),
          },
          type: base.MTTypeEnum.T_IP,
          ...this.prismao.defaultSelArg().where,
        },
      });
      const menuThrottles__ = baseUtils.objToCamelCase<MenuThrottleDto[]>(menuThrottles_);
      menuThrottles.push(...menuThrottles__);
      await this.cachePermissionService.setMenuThrottleInCache(permission, menuThrottles__);
    }
    if (menuThrottles.length === 0) {
      return true;
    }
    menuThrottles.sort((a, b) => b.ttl - a.ttl);
    const now = timeUtils.timestamp();
    const logs = await this.mysqlPrismao.log_operation.findMany({
      where: {
        call_ip: ipInfo.ip,
        perms: permission,
        create_time: {
          gte: new Date(now - menuThrottles[0].ttl),
          lte: new Date(now),
        },
        if_success: final.Y,
        ...this.prismao.defaultSelArg({ ifDeleted: false }).where,
      },
    });
    const ifThrottle = menuThrottles.every((menuThrottle) => {
      const filter = logs.filter((item) => {
        return (
          timeUtils.timestamp(item.create_time) < now && timeUtils.timestamp(item.create_time) > now - menuThrottle.ttl
        );
      });
      return filter.length < menuThrottle.limit;
    });
    return ifThrottle;
  }

  /**
   * 是否管理员用户操作非管理员用户
   * @param controlUserId
   * @param controledUserId
   */
  async ifAdminUserUpdNotAdminUser(controlUserId: string, controledUserId: string) {
    const topAdminUser = await this.mysqlPrismao.sys_admin_top.findMany({
      where: {
        user_id: {
          in: [controlUserId, controledUserId],
        },
        ...this.prismao.defaultSelArg().where,
      },
    });
    return (
      controlUserId === controledUserId ||
      (topAdminUser.findIndex((item) => item.user_id === controlUserId) > -1 &&
        topAdminUser.findIndex((item) => item.user_id === controledUserId) === -1)
    );
  }

  /**
   * 当前用户是否有此算法权限
   * @param userid
   * @param loginRole
   * @param authType
   * @param ppermission
   * @param permission
   * @param request
   */
  async hasSFPermissionByUserid(
    userid: string,
    loginRole: string,
    authType: base.AuthTypeEnum,
    ppermission: string,
    permission: string,
    request?: Request,
  ) {
    const algorithmCallDto = new LogAlgorithmCallDto();
    algorithmCallDto.userId = userid;
    algorithmCallDto.callIp = '';
    algorithmCallDto.ifSuccess = '?';
    if (request) {
      try {
        const ipInfoFromRequest = getIpInfoFromRequest(request);
        algorithmCallDto.callIp = `${ipInfoFromRequest.ip}`;
      } catch (e) {
        this.winston.error(e);
      }
    }
    const interfg = await this.mysqlPrismao.sys_interface_group.findMany({
      where: {
        perms: ppermission,
        ...this.prismao.defaultSelArg().where,
      },
    });
    const interf = await this.mysqlPrismao.sys_interface.findMany({
      where: {
        perms: permission,
        if_disabled: final.N,
        ...this.prismao.defaultSelArg().where,
      },
    });
    if (interfg.length === 0 || interf.length === 0) {
      throw new Exception('算法组或算法不存在。');
    }
    const interfgf = await this.mysqlPrismao.sys_interface_interface_group.findMany({
      where: {
        interface_id: interf[0].id,
        interface_group_id: interfg[0].id,
        ...this.prismao.defaultSelArg().where,
      },
    });
    if (interfgf.length === 0) {
      throw new Exception('当前算法组中不存在当前算法。');
    }
    if (interf.length > 0) {
      // 是否公共算法
      if (interf[0].if_public === final.Y) {
        await this.insLogAlgorithmCall(
          -1,
          ppermission,
          permission,
          algorithmCallDto.userId,
          loginRole,
          authType,
          algorithmCallDto.callIp,
          '?',
          algorithmCallDto.remark,
        );
        return true;
      }
      // 是否禁用
      if (interf[0].if_disabled === final.Y) {
        throw new Exception('当前算法被禁用。');
      }
    }
    const permissions = await this.getSFPermissionsOfUserid(userid, ppermission, permission, loginRole);
    if (permissions.length === 0) {
      const permissions2 = await this.getSFPermissionsOfUserid(userid, ppermission, permission, loginRole, final.Y);
      if (permissions2.length > 0) {
        throw new Exception('请求次数已使用完。');
      } else {
        return false;
      }
    }
    const userGroupPermission = permissions[0] as UserGroupPermissionDto;
    algorithmCallDto.userGroupPermissionId = userGroupPermission.id;
    // 没长期权限，不在时间期限内，则阻止
    if (userGroupPermission.ifLongTerm === final.N) {
      if (
        timeUtils.timestamp() < timeUtils.timestamp(userGroupPermission.permissionStartTime) ||
        timeUtils.timestamp() > timeUtils.timestamp(userGroupPermission.permissionEndTime)
      ) {
        throw new Exception('您不在权限期限内。');
      }
    }
    // 在期限内，且不限制次数，则放行
    if (userGroupPermission.ifLimitRequestTimes === final.N) {
      await this.insLogAlgorithmCall(
        algorithmCallDto.userGroupPermissionId,
        ppermission,
        permission,
        algorithmCallDto.userId,
        loginRole,
        authType,
        algorithmCallDto.callIp,
        '?',
        algorithmCallDto.remark,
      );
      return true;
    }
    // 在时间期限内，次数还没用光，则放行
    const limitRequestTimes = userGroupPermission.limitRequestTimes;
    const count1: { count: number }[] = await this.mysqlPrismao.$queryRaw`
      select count(id) as count
      from log_algorithm_call
      where user_group_permission_id = ${userGroupPermission.id};
    `;
    const count = count1[0].count;
    if (limitRequestTimes > count) {
      await this.insLogAlgorithmCall(
        algorithmCallDto.userGroupPermissionId,
        ppermission,
        permission,
        algorithmCallDto.userId,
        loginRole,
        authType,
        algorithmCallDto.callIp,
        '?',
        algorithmCallDto.remark,
      );
      if (Number(count) === limitRequestTimes - 1) {
        if (userGroupPermission.ifRejectRequestUseUp === final.N) {
        } else {
          // 把状态更改为已用完
          await this.mysqlPrismao.$queryRaw`
            update sys_user_group_permission
            set if_use_up = ${final.Y}
            where id = ${userGroupPermission.id};
          `;
        }
      }
      return true;
    }
    // 次数用光后是否停止服务
    if (userGroupPermission.ifRejectRequestUseUp === final.N) {
      await this.insLogAlgorithmCall(
        algorithmCallDto.userGroupPermissionId,
        ppermission,
        permission,
        algorithmCallDto.userId,
        loginRole,
        authType,
        algorithmCallDto.callIp,
        '?',
        algorithmCallDto.remark,
      );
      return true;
    } else {
      // 把状态更改为已用完
      await this.mysqlPrismao.$queryRaw`
        update sys_user_group_permission
        set if_use_up = ${final.Y}
        where id = ${userGroupPermission.id};
      `;
      throw new Exception('请求次数已使用完。');
    }
  }

  /**
   * 当前用户的算法权限列表
   * @param userid
   * @param ppermission
   * @param permission
   * @param loginRole
   * @param ifIgnoreUseUp
   */
  async getSFPermissionsOfUserid(
    userid: string,
    ppermission: string,
    permission: string,
    loginRole: string,
    ifIgnoreUseUp = final.N,
  ): Promise<UserGroupPermissionDto[]> {
    const userSFPermissions: UserGroupPermissionDto[] = await this.mysqlPrismao.$queryRaw`
      select sugp.id                       as id,
             sugp.user_group_id            as userGroupId,
             sugp.permission_id            as permissionId,
             sugp.if_long_term             as ifLongTerm,
             sugp.if_limit_request_times   as ifLimitRequestTimes,
             sugp.if_reject_request_use_up as ifRejectRequestUseUp,
             sugp.permission_start_time    as permissionStartTime,
             sugp.permission_end_time      as permissionEndTime,
             sugp.limit_request_times      as limitRequestTimes,
             sugp.if_use_up                as ifUseUp,
             sugp.order_num                as orderNum,
             sugp.remark                   as remark,
             sugp.create_role              as createRole,
             sugp.update_role              as updateRole,
             sugp.create_by                as createBy,
             sugp.update_by                as updateBy,
             sugp.create_time              as createTime,
             sugp.update_time              as updateTime,
             sugp.deleted                  as deleted
      from sys_user_group_permission sugp
      where sugp.deleted = ${final.N}
        and sugp.if_use_up like ${ifIgnoreUseUp === final.Y ? '%%' : `${final.N}`}
        and sugp.user_group_id in
            (select suug.user_group_id
             from sys_user_user_group suug
             where suug.deleted = ${final.N}
               and suug.login_role = ${loginRole}
               and suug.user_id = ${userid})
        and sugp.permission_id in
            (select siig.interface_group_id
             from sys_interface_interface_group siig
             where siig.deleted = ${final.N}
               and siig.interface_group_id = (select sig.id
                                              from sys_interface_group sig
                                              where sig.deleted = ${final.N}
                                                and sig.perms = ${ppermission})
               and siig.interface_id = (select si.id
                                        from sys_interface si
                                        where si.deleted = ${final.N}
                                          and si.if_disabled = ${final.N}
                                          and si.perms = ${permission}))
      order by sugp.order_num;
    `;
    return userSFPermissions;
  }

  /**
   * 用户的角色和部门
   * @param userId
   * @param loginRole
   * @param ifAdmin
   */
  async rolesAndDeptsOfUser(userId: string, loginRole: string, ifAdmin: boolean = false) {
    const allRoleIds1: { role_id: number }[] = await this.mysqlPrismao.$queryRaw`
      select sur.role_id
      from sys_user_role sur
             left join
           sys_role sr
           on sur.role_id = sr.id
      where sur.deleted = ${final.N}
        and sur.login_role = ${loginRole}
        and sur.user_id = ${userId}
        and sr.deleted = ${final.N}
        and sr.if_admin like ${ifAdmin ? final.Y : '%%'}
        and sr.if_disabled = ${final.N}
      group by sur.role_id;
    `;
    const allDeptIds1: { dept_id: number }[] = await this.mysqlPrismao.$queryRaw`
      select sud.dept_id
      from sys_user_dept sud
             left join
           sys_dept sd
           on sud.dept_id = sd.id
      where sud.deleted = ${final.N}
        and sud.login_role = ${loginRole}
        and sud.user_id = ${userId}
        and sd.deleted = ${final.N}
        and sd.if_admin like ${ifAdmin ? final.Y : '%%'}
        and sd.if_disabled = ${final.N}
      group by sud.dept_id;
    `;
    const allRoleIds = [...allRoleIds1.map((item) => item.role_id)];
    const allDeptIds = [...allDeptIds1.map((item) => item.dept_id)];
    if (loginRole === base.LoginRoleEnum.admin) {
      const sutdps_ = await this.mysqlPrismao.sys_user_table_default_permission.findMany({
        where: {
          table_name: 'sys_user',
          ...this.prismao.defaultSelArg().where,
        },
      });
      const sutdps = baseUtils.objToCamelCase<UserTableDefaultPermissionDto[]>(sutdps_);
      const allRoleIds2 = await this.mysqlPrismao.sys_role.findMany({
        where: {
          ...(ifAdmin ? { if_admin: final.Y } : {}),
          if_disabled: final.N,
          id: {
            in: sutdps.filter((item) => item.permType === base.UTDPTypeEnum.T_ROLE).map((item) => item.permId),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      const allDeptIds2 = await this.mysqlPrismao.sys_dept.findMany({
        where: {
          ...(ifAdmin ? { if_admin: final.Y } : {}),
          if_disabled: final.N,
          id: {
            in: sutdps.filter((item) => item.permType === base.UTDPTypeEnum.T_DEPT).map((item) => item.permId),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      allRoleIds.push(...allRoleIds2.map((item) => item.id));
      allDeptIds.push(...allDeptIds2.map((item) => item.id));
    }
    if (loginRole === base.LoginRoleEnum.visitor) {
      const sutdps_ = await this.mysqlPrismao.sys_user_table_default_permission.findMany({
        where: {
          table_name: 'sys_user_visitor',
          ...this.prismao.defaultSelArg().where,
        },
      });
      const sutdps = baseUtils.objToCamelCase<UserTableDefaultPermissionDto[]>(sutdps_);
      const allRoleIds2 = await this.mysqlPrismao.sys_role.findMany({
        where: {
          ...(ifAdmin ? { if_admin: final.Y } : {}),
          if_disabled: final.N,
          id: {
            in: sutdps.filter((item) => item.permType === base.UTDPTypeEnum.T_ROLE).map((item) => item.permId),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      const allDeptIds2 = await this.mysqlPrismao.sys_dept.findMany({
        where: {
          ...(ifAdmin ? { if_admin: final.Y } : {}),
          if_disabled: final.N,
          id: {
            in: sutdps.filter((item) => item.permType === base.UTDPTypeEnum.T_DEPT).map((item) => item.permId),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      allRoleIds.push(...allRoleIds2.map((item) => item.id));
      allDeptIds.push(...allDeptIds2.map((item) => item.id));
    }
    if (loginRole === base.LoginRoleEnum.dcts) {
      const sutdps_ = await this.mysqlPrismao.sys_user_table_default_permission.findMany({
        where: {
          table_name: 'dcts_user',
          ...this.prismao.defaultSelArg().where,
        },
      });
      const sutdps = baseUtils.objToCamelCase<UserTableDefaultPermissionDto[]>(sutdps_);
      const allRoleIds2 = await this.mysqlPrismao.sys_role.findMany({
        where: {
          ...(ifAdmin ? { if_admin: final.Y } : {}),
          if_disabled: final.N,
          id: {
            in: sutdps.filter((item) => item.permType === base.UTDPTypeEnum.T_ROLE).map((item) => item.permId),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      const allDeptIds2 = await this.mysqlPrismao.sys_dept.findMany({
        where: {
          ...(ifAdmin ? { if_admin: final.Y } : {}),
          if_disabled: final.N,
          id: {
            in: sutdps.filter((item) => item.permType === base.UTDPTypeEnum.T_DEPT).map((item) => item.permId),
          },
          ...this.prismao.defaultSelArg().where,
        },
      });
      allRoleIds.push(...allRoleIds2.map((item) => item.id));
      allDeptIds.push(...allDeptIds2.map((item) => item.id));
    }
    return {
      allRoleIds,
      allDeptIds,
    };
  }

  /**
   * 用户的角色名和部门名
   * @param userId
   * @param loginRole
   * @param ifAdmin
   */
  async rnamesAndDnamesOfUser(userId: string, loginRole: string, ifAdmin: boolean = false) {
    const rads = await this.rolesAndDeptsOfUser(userId, loginRole, ifAdmin);
    const defaultSelArg = this.prismao.defaultSelArg();
    const roles = await this.mysqlPrismao.sys_role.findMany({
      where: {
        id: {
          in: rads.allRoleIds,
        },
        ...defaultSelArg.where,
      },
    });
    const depts = await this.mysqlPrismao.sys_dept.findMany({
      where: {
        id: {
          in: rads.allDeptIds,
        },
        ...defaultSelArg.where,
      },
    });
    return {
      allRoleNames: roles.map((item) => item.label),
      allDeptNames: depts.map((item) => item.label),
    };
  }

  /**
   * 插入操作记录
   * @param permission
   * @param request
   * @param ifSuccess
   * @param remark
   * @param ifIgnoreParamInLog
   */
  async insLogOperation(
    permission: string,
    request: Request,
    ifSuccess: boolean | string,
    {
      remark,
      ifIgnoreParamInLog,
    }: {
      remark?: string;
      ifIgnoreParamInLog?: boolean;
    } = {
      remark: '',
      ifIgnoreParamInLog: false,
    },
  ) {
    const reqId = this.bcs.getUserData().reqId;
    const userId = this.bcs.getUserData().userId || '???';
    const loginRole = this.bcs.getUserData().loginRole || '???';
    const authType = this.bcs.getUserData().authType;
    const ipInfoFromRequest = getIpInfoFromRequest(request);
    await this.insLogOperation2(permission, ipInfoFromRequest, ifSuccess, {
      remark: remark,
      ifIgnoreParamInLog,
      reqBody: request.body,
      reqQuery: request.query,
      reqParam: request.params,
      reqMethod: request.method,
      reqId: reqId,
      userId: userId,
      loginRole: loginRole,
      authType: authType,
      createTime: new Date(),
    });
  }

  /**
   * 插入操作记录
   * @param permission
   * @param request
   * @param ifSuccess
   * @param remark
   * @param ifIgnoreParamInLog
   * @param reqBody
   * @param reqQuery
   * @param reqParam
   * @param reqMethod
   * @param reqId
   * @param userId
   * @param loginRole
   * @param authType
   * @param createTime
   */
  async insLogOperation2(
    permission: string,
    request: ReturnType<typeof getIpInfoFromRequest>,
    ifSuccess: boolean | string,
    {
      remark,
      ifIgnoreParamInLog,
      reqBody,
      reqQuery,
      reqParam,
      reqMethod,
      reqId,
      userId,
      loginRole,
      authType,
      createTime,
    }: {
      remark?: string;
      ifIgnoreParamInLog?: boolean;
      reqBody: object;
      reqQuery: object;
      reqParam: object;
      reqMethod: string;
      reqId: string;
      userId: string;
      loginRole: string;
      authType: base.AuthTypeEnum;
      createTime: Date;
    } = {
      remark: '',
      ifIgnoreParamInLog: false,
      reqBody: {},
      reqQuery: {},
      reqParam: {},
      reqMethod: '',
      reqId: '',
      userId: '',
      loginRole: '',
      authType: base.AuthTypeEnum.unknown,
      createTime: new Date(),
    },
  ) {
    await this.mysqlPrismao.log_operation.create({
      data: {
        req_id: reqId,
        call_ip: request.ip,
        host_name: `${request.proto}://${request.host}`,
        perms: permission,
        user_id: userId || '???',
        login_role: loginRole || '???',
        auth_type: authType || '???',
        req_param: ifIgnoreParamInLog
          ? JSON.stringify({ body: 'hidden', query: 'hidden', param: 'hidden' })
          : JSON.stringify({ body: reqBody, query: reqQuery, param: reqParam }),
        old_value: '',
        operate_type: reqMethod,
        if_success: typeof ifSuccess === 'boolean' ? (ifSuccess ? final.Y : final.N) : ifSuccess,
        remark: remark,
        create_time: createTime,
      },
    });
  }

  /**
   * 插入算法调用日志
   * @param userGroupPermissionId
   * @param pperms
   * @param perms
   * @param userId
   * @param loginRole
   * @param authType
   * @param callIp
   * @param ifSuccess
   * @param remark
   */
  async insLogAlgorithmCall(
    userGroupPermissionId: number,
    pperms: string,
    perms: string,
    userId: string,
    loginRole: string,
    authType: base.AuthTypeEnum,
    callIp: string,
    ifSuccess: string,
    remark: string,
  ) {
    await this.mysqlPrismao.log_algorithm_call.create({
      data: {
        user_group_permission_id: userGroupPermissionId,
        pperms: pperms,
        perms: perms,
        user_id: userId,
        login_role: loginRole,
        auth_type: authType,
        call_ip: callIp,
        if_success: ifSuccess,
        remark: remark,
      },
    });
  }
}
