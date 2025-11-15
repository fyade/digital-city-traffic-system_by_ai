import { Injectable } from '@nestjs/common';
import { LogUserLoginDto, LogUserLoginInsOneDto, PASSWORD_ERROR } from './dto';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { final } from '../../../../util/base';
import { timeUtils } from '@dcts/common';

@Injectable()
export class LogUserLoginFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async selAllLogUserLogin(userId: string, loginIp: string, loginRole: string) {
    return this.mysqlPrisma.findAll<LogUserLoginDto>('log_user_login', {
      data: {
        userId: userId,
        ifSuccess: final.N,
        failType: PASSWORD_ERROR,
        loginIp: loginIp,
        loginRole: loginRole,
      },
      orderBy: { createTime: 'desc' },
      range: {
        createTime: {
          gte: new Date(timeUtils.timestamp() - 1000 * 60 * 60 * 24),
          lte: new Date(timeUtils.timestamp()),
        },
      },
    });
  }

  async insLogUserLogin(
    obj: Omit<LogUserLoginInsOneDto, 'failType' | 'remark' | 'ifSuccess'> & { ifSuccess: boolean },
    failType: string = '',
    errorRemark: string = '密码错误',
  ) {
    const dto: LogUserLoginInsOneDto = {
      userId: obj.userId,
      loginRole: obj.loginRole,
      loginType: obj.loginType,
      loginIp: obj.loginIp,
      loginPosition: obj.loginPosition,
      loginBrowser: obj.loginBrowser,
      loginOs: obj.loginOs,
      ifSuccess: obj.ifSuccess ? final.Y : final.N,
      failType: failType,
      remark: obj.ifSuccess ? '登录成功' : errorRemark,
    };
    return this.mysqlPrisma.create<LogUserLoginDto>('log_user_login', dto);
  }
}
