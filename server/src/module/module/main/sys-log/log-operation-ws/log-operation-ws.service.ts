import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { R } from '../../../../../common/R';
import { LogOperationWsDto, LogOperationWsSelListDto, LogOperationWsSelAllDto, LogOperationWsInsOneDto, LogOperationWsUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';

@Injectable()
export class LogOperationWsService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('log_operation_ws', {
      notNullKeys: ['socketId', 'callIp', 'hostName', 'wsPerms', 'userId', 'loginRole', 'ifSuccess'],
      ifCreateRole: false,
      ifUpdateRole: false,
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
  }

  async selLogOperationWs(dto: LogOperationWsSelListDto): Promise<R> {
    const res = await this.prisma.findPage<LogOperationWsDto, LogOperationWsSelListDto>('log_operation_ws', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllLogOperationWs(dto: LogOperationWsSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<LogOperationWsDto>('log_operation_ws', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesLogOperationWs(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<LogOperationWsDto>('log_operation_ws', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneLogOperationWs(id: number): Promise<R> {
    const res = await this.prisma.findById<LogOperationWsDto>('log_operation_ws', Number(id));
    return R.ok(res);
  }

  async insLogOperationWs(dto: LogOperationWsInsOneDto): Promise<R> {
    const res = await this.prisma.create<LogOperationWsDto>('log_operation_ws', dto);
    return R.ok(res);
  }

  async insLogOperationWss(dtos: LogOperationWsInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<LogOperationWsDto>('log_operation_ws', dtos);
    return R.ok(res);
  }

  async updLogOperationWs(dto: LogOperationWsUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<LogOperationWsDto>('log_operation_ws', dto);
    return R.ok(res);
  }

  async updLogOperationWss(dtos: LogOperationWsUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<LogOperationWsDto>('log_operation_ws', dtos);
    return R.ok(res);
  }

  async delLogOperationWs(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<LogOperationWsDto>('log_operation_ws', ids);
    return R.ok(res);
  }
}
