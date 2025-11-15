import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { RoleDto } from './dto';

@Injectable()
export class RoleFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByIds(ids: number[]) {
    return this.mysqlPrisma.findAll<RoleDto>('sys_role', {
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
