import { Injectable } from '@nestjs/common';
import { InterfaceDto, InterfaceSelAllDto } from './dto';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';

@Injectable()
export class InterfaceFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async selAllInterface(dto: Partial<InterfaceSelAllDto>) {
    return this.mysqlPrisma.findAll<InterfaceDto>('sys_interface', {
      data: dto,
      orderBy: true,
    });
  }
}
