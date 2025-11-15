import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { SysDto } from './dto';

@Injectable()
export class SysFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getById(id: number) {
    return this.mysqlPrisma.findById<SysDto>('sys_sys', id);
  }
}
