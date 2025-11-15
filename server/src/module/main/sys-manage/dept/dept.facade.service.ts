import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { DeptDto } from './dto';

@Injectable()
export class DeptFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByIds(ids: number[]) {
    return this.mysqlPrisma.findAll<DeptDto>('sys_dept', {
      data: {
        id: {
          in: {
            value: ids,
          },
        },
      },
    });
  }
}
