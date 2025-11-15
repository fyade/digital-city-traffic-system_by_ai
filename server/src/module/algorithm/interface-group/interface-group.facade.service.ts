import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';
import { InterfaceGroupDto } from './dto';

@Injectable()
export class InterfaceGroupFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async selOneInterfaceGroup(id: number) {
    return this.mysqlPrisma.findById<InterfaceGroupDto>('sys_interface_group', id);
  }
}
