import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { base } from '@dcts/common';
import { UserDeptDto } from './dto';

@Injectable()
export class UserDeptFacadeService {
  constructor(private readonly mysqlPrisma: MysqlPrismaService) {}

  async getByUserInfo(userIds: string[], loginRole: base.LoginRoleEnum) {
    return this.mysqlPrisma.findAll<UserDeptDto>('sys_user_dept', {
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
