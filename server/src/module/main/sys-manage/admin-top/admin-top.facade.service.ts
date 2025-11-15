import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { AdminTopDto } from './dto';

@Injectable()
export class AdminTopFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getAdminUsersByUserId(userIds: string[]) {
    return this.mysqlPrisma.findAll<AdminTopDto>('sys_admin_top', {
      data: {
        userId: {
          in: {
            value: userIds,
          },
        },
      },
    });
  }
}
