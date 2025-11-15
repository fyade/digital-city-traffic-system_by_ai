import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { base } from '@dcts/common';
import { UserRoleDto } from './dto';

@Injectable()
export class UserRoleFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByUserInfo(userIds: string[], loginRole: base.LoginRoleEnum) {
    return this.mysqlPrisma.findAll<UserRoleDto>('sys_user_role', {
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
