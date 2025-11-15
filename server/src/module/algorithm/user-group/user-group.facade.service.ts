import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';
import { UserGroupDto } from './dto';

@Injectable()
export class UserGroupFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByIds(ids: number[]) {
    return this.mysqlPrisma.findAll<UserGroupDto>('sys_user_group', {
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
