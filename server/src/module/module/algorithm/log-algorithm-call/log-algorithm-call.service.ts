import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { LogAlgorithmCallDto, LogAlgorithmCallSelListDto, LogAlgorithmCallSelAllDto, LogAlgorithmCallInsOneDto, LogAlgorithmCallUpdOneDto } from './dto';
import { BaseContextService } from '../../../base-context/base-context.service';

@Injectable()
export class LogAlgorithmCallService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('log_algorithm_call', {
      notNullKeys: ['userGroupPermissionId', 'pperms', 'perms', 'userId', 'loginRole', 'authType', 'callIp', 'ifSuccess'],
      numberKeys: ['userGroupPermissionId'],
      completeMatchingKeys: ['userGroupPermissionId', 'pperms', 'perms', 'userId', 'loginRole'],
      ifCreateRole: false,
      ifUpdateRole: false,
      ifCreateBy: false,
      ifUpdateBy: false,
      ifUpdateTime: false,
      ifDeleted: false,
    });
  }

  async selLogAlgorithmCall(dto: LogAlgorithmCallSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<LogAlgorithmCallDto, LogAlgorithmCallSelListDto>('log_algorithm_call', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllLogAlgorithmCall(dto: LogAlgorithmCallSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<LogAlgorithmCallDto>('log_algorithm_call', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesLogAlgorithmCall(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<LogAlgorithmCallDto>('log_algorithm_call', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneLogAlgorithmCall(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<LogAlgorithmCallDto>('log_algorithm_call', Number(id));
    return R.ok(res);
  }

  async insLogAlgorithmCall(dto: LogAlgorithmCallInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<LogAlgorithmCallDto>('log_algorithm_call', dto);
    return R.ok(res);
  }

  async insLogAlgorithmCalls(dtos: LogAlgorithmCallInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<LogAlgorithmCallDto>('log_algorithm_call', dtos);
    return R.ok(res);
  }

  async updLogAlgorithmCall(dto: LogAlgorithmCallUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<LogAlgorithmCallDto>('log_algorithm_call', dto);
    return R.ok(res);
  }

  async updLogAlgorithmCalls(dtos: LogAlgorithmCallUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<LogAlgorithmCallDto>('log_algorithm_call', dtos);
    return R.ok(res);
  }

  async delLogAlgorithmCall(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<LogAlgorithmCallDto>('log_algorithm_call', ids);
    return R.ok(res);
  }
}
