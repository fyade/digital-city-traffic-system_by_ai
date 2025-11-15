import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { LogUserLoginWsDto, LogUserLoginWsSelListDto, LogUserLoginWsSelAllDto, LogUserLoginWsInsOneDto, LogUserLoginWsUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class LogUserLoginWsService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('log_user_login_ws', {
      notNullKeys: ['userId', 'loginRole', 'loginIp', 'loginPosition', 'loginBrowser', 'loginOs', 'ifSuccess', 'failType'],
      ifCreateRole: false,
      ifUpdateRole: false,
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
  }

  async selLogUserLoginWs(dto: LogUserLoginWsSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<LogUserLoginWsDto>('log_user_login_ws', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllLogUserLoginWs(dto: LogUserLoginWsSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<LogUserLoginWsDto>('log_user_login_ws', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesLogUserLoginWs(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<LogUserLoginWsDto>('log_user_login_ws', ids);
    return R.ok(res);
  }

  async selOneLogUserLoginWs(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<LogUserLoginWsDto>('log_user_login_ws', id);
    return R.ok(res);
  }

  async insLogUserLoginWs(dto: LogUserLoginWsInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<LogUserLoginWsDto>('log_user_login_ws', dto);
    return R.ok(res);
  }

  async insLogUserLoginWss(dtos: LogUserLoginWsInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<LogUserLoginWsDto>('log_user_login_ws', dtos);
    return R.ok(res);
  }

  async updLogUserLoginWs(dto: LogUserLoginWsUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<LogUserLoginWsDto>('log_user_login_ws', dto);
    return R.ok(res);
  }

  async updLogUserLoginWss(dtos: LogUserLoginWsUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<LogUserLoginWsDto>('log_user_login_ws', dtos);
    return R.ok(res);
  }

  async delLogUserLoginWs(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<LogUserLoginWsDto>('log_user_login_ws', ids);
    return R.ok(res);
  }
}
