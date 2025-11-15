import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';
import { base } from '@dcts/common';
import { UserUserGroupDto } from './dto';

@Injectable()
export class UserUserGroupFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByUserInfo(userIds: string[], loginRole: base.LoginRoleEnum) {
    return this.mysqlPrisma.findAll<UserUserGroupDto>('sys_user_user_group', {
      data: {
        userId: {
          in: {
            value: userIds,
          },
        },
        loginRole: loginRole,
      },
    });
  }
}
