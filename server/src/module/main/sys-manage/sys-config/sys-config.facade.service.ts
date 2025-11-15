import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { SysConfigDto } from './dto';

@Injectable()
export class SysConfigFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getAllConfigs() {
    return this.mysqlPrisma.findAll<SysConfigDto>('sys_config');
  }
}
