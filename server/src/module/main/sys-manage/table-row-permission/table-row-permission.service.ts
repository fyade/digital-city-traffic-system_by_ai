import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { TableRowPermissionDto, TableRowPermissionSelListDto, TableRowPermissionSelAllDto, TableRowPermissionInsOneDto, TableRowPermissionUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class TableRowPermissionService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_table_row_permission', {
      notNullKeys: ['permissionId', 'actionType', 'actionId', 'dataType'],
      numberKeys: ['permissionId'],
    })
  }

  async selTableRowPermission(dto: TableRowPermissionSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<TableRowPermissionDto>('sys_table_row_permission', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllTableRowPermission(dto: TableRowPermissionSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<TableRowPermissionDto>('sys_table_row_permission', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesTableRowPermission(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<TableRowPermissionDto>('sys_table_row_permission', ids);
    return R.ok(res);
  }

  async selOneTableRowPermission(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<TableRowPermissionDto>('sys_table_row_permission', Number(id));
    return R.ok(res);
  }

  async insTableRowPermission(dto: TableRowPermissionInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<TableRowPermissionDto>('sys_table_row_permission', dto);
    return R.ok(res);
  }

  async insTableRowPermissions(dtos: TableRowPermissionInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<TableRowPermissionDto>('sys_table_row_permission', dtos);
    return R.ok(res);
  }

  async updTableRowPermission(dto: TableRowPermissionUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<TableRowPermissionDto>('sys_table_row_permission', dto);
    return R.ok(res);
  }

  async updTableRowPermissions(dtos: TableRowPermissionUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<TableRowPermissionDto>('sys_table_row_permission', dtos);
    return R.ok(res);
  }

  async delTableRowPermission(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<TableRowPermissionDto>('sys_table_row_permission', ids);
    return R.ok(res);
  }
}
