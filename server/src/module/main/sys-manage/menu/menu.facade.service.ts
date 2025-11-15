import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { MenuDto } from './dto';

@Injectable()
export class MenuFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getAll() {
    return this.mysqlPrisma.findAll<MenuDto>('sys_menu', {});
  }
}
