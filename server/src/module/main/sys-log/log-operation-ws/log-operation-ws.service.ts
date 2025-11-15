import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { LogOperationWsDto, LogOperationWsSelListDto, LogOperationWsSelAllDto, LogOperationWsInsOneDto, LogOperationWsUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class LogOperationWsService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('log_operation_ws', {
      notNullKeys: ['socketId', 'callIp', 'hostName', 'wsPerms', 'userId', 'loginRole', 'reqParam', 'from', 'ifSuccess'],
      ifCreateRole: false,
      ifUpdateRole: false,
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
  }

  async selLogOperationWs(dto: LogOperationWsSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<LogOperationWsDto>('log_operation_ws', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllLogOperationWs(dto: LogOperationWsSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<LogOperationWsDto>('log_operation_ws', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesLogOperationWs(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<LogOperationWsDto>('log_operation_ws', ids);
    return R.ok(res);
  }

  async selOneLogOperationWs(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<LogOperationWsDto>('log_operation_ws', id);
    return R.ok(res);
  }

  async insLogOperationWs(dto: LogOperationWsInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<LogOperationWsDto>('log_operation_ws', dto);
    return R.ok(res);
  }

  async insLogOperationWss(dtos: LogOperationWsInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<LogOperationWsDto>('log_operation_ws', dtos);
    return R.ok(res);
  }

  async updLogOperationWs(dto: LogOperationWsUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<LogOperationWsDto>('log_operation_ws', dto);
    return R.ok(res);
  }

  async updLogOperationWss(dtos: LogOperationWsUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<LogOperationWsDto>('log_operation_ws', dtos);
    return R.ok(res);
  }

  async delLogOperationWs(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<LogOperationWsDto>('log_operation_ws', ids);
    return R.ok(res);
  }
}
