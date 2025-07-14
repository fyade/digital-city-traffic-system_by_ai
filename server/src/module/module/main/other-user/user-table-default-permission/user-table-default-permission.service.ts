import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../../prisma/mysql.prisma.service';
import { R } from '../../../../../common/R';
import { UserTableDefaultPermissionDto, UserTableDefaultPermissionSelListDto, UserTableDefaultPermissionSelAllDto, UserTableDefaultPermissionInsOneDto, UserTableDefaultPermissionUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';

@Injectable()
export class UserTableDefaultPermissionService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_user_table_default_permission', {
      notNullKeys: ['tableName', 'permType', 'permId'],
      numberKeys: ['permId'],
      completeMatchingKeys: ['tableName', 'permType', 'permId'],
    })
  }

  async selUserTableDefaultPermission(dto: UserTableDefaultPermissionSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<UserTableDefaultPermissionDto, UserTableDefaultPermissionSelListDto>('sys_user_table_default_permission', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllUserTableDefaultPermission(dto: UserTableDefaultPermissionSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<UserTableDefaultPermissionDto>('sys_user_table_default_permission', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesUserTableDefaultPermission(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<UserTableDefaultPermissionDto>('sys_user_table_default_permission', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneUserTableDefaultPermission(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<UserTableDefaultPermissionDto>('sys_user_table_default_permission', Number(id));
    return R.ok(res);
  }

  async insUserTableDefaultPermission(dto: UserTableDefaultPermissionInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<UserTableDefaultPermissionDto>('sys_user_table_default_permission', dto);
    return R.ok(res);
  }

  async insUserTableDefaultPermissions(dtos: UserTableDefaultPermissionInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<UserTableDefaultPermissionDto>('sys_user_table_default_permission', dtos);
    return R.ok(res);
  }

  async updUserTableDefaultPermission(dto: UserTableDefaultPermissionUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<UserTableDefaultPermissionDto>('sys_user_table_default_permission', dto);
    return R.ok(res);
  }

  async updUserTableDefaultPermissions(dtos: UserTableDefaultPermissionUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<UserTableDefaultPermissionDto>('sys_user_table_default_permission', dtos);
    return R.ok(res);
  }

  async delUserTableDefaultPermission(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<UserTableDefaultPermissionDto>('sys_user_table_default_permission', ids);
    return R.ok(res);
  }
}
