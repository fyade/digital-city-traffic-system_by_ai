import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { ScheduledTaskDto } from './dto';

@Injectable()
export class ScheduledTaskFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByIds(ids: number[]) {
    return this.mysqlPrisma.findByIds<ScheduledTaskDto>('sys_scheduled_task', ids);
  }
}
