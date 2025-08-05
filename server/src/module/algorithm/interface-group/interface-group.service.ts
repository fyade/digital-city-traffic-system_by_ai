import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../common/R';
import { InterfaceGroupDto, InterfaceGroupSelListDto, InterfaceGroupSelAllDto, InterfaceGroupInsOneDto, InterfaceGroupUpdOneDto } from './dto';
import { BaseContextService } from '../../../infra/base-context/base-context.service';

@Injectable()
export class InterfaceGroupService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_interface_group', {
      notNullKeys: ['label', 'parentId', 'perms', 'baseURL', 'orderNum'],
      numberKeys: ['parentId', 'orderNum'],
    });
  }

  async selInterfaceGroup(dto: InterfaceGroupSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<InterfaceGroupDto, InterfaceGroupSelListDto>('sys_interface_group', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllInterfaceGroup(dto: InterfaceGroupSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<InterfaceGroupDto>('sys_interface_group', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesInterfaceGroup(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<InterfaceGroupDto>('sys_interface_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneInterfaceGroup(id: number): Promise<R<InterfaceGroupDto>> {
    const res = await this.mysqlPrisma.findById<InterfaceGroupDto>('sys_interface_group', Number(id));
    return R.ok(res);
  }

  async insInterfaceGroup(dto: InterfaceGroupInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<InterfaceGroupDto>('sys_interface_group', dto);
    return R.ok(res);
  }

  async insInterfaceGroups(dtos: InterfaceGroupInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<InterfaceGroupDto>('sys_interface_group', dtos);
    return R.ok(res);
  }

  async updInterfaceGroup(dto: InterfaceGroupUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<InterfaceGroupDto>('sys_interface_group', dto);
    return R.ok(res);
  }

  async updInterfaceGroups(dtos: InterfaceGroupUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<InterfaceGroupDto>('sys_interface_group', dtos);
    return R.ok(res);
  }

  async delInterfaceGroup(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<InterfaceGroupDto>('sys_interface_group', ids);
    return R.ok(res);
  }
}
