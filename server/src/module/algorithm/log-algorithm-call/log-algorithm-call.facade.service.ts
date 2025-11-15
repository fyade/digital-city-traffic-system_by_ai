import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';
import { LogAlgorithmCallDto } from './dto';

@Injectable()
export class LogAlgorithmCallFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getCountByUserGroupPermissionId(id: number) {
    return this.mysqlPrisma.count<LogAlgorithmCallDto>('log_algorithm_call', {
      data: { userGroupPermissionId: id },
    });
  }
}
