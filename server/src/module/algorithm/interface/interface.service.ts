import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../common/R';
import { InterfaceDto, InterfaceSelListDto, InterfaceSelAllDto, InterfaceInsOneDto, InterfaceUpdOneDto } from './dto';
import { BaseContextService } from '../../../infra/base-context/base-context.service';

@Injectable()
export class InterfaceService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_interface', {
      notNullKeys: ['label', 'icon', 'orderNum', 'ifDisabled', 'ifPublic', 'perms', 'url'],
      numberKeys: ['orderNum'],
      completeMatchingKeys: ['perms'],
    });
  }

  async selInterface(dto: InterfaceSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<InterfaceDto>('sys_interface', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllInterface(dto: InterfaceSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<InterfaceDto>('sys_interface', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesInterface(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<InterfaceDto>('sys_interface', ids);
    return R.ok(res);
  }

  async selOneInterface(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<InterfaceDto>('sys_interface', id);
    return R.ok(res);
  }

  async insInterface(dto: InterfaceInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<InterfaceDto>('sys_interface', dto);
    return R.ok(res);
  }

  async insInterfaces(dtos: InterfaceInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<InterfaceDto>('sys_interface', dtos);
    return R.ok(res);
  }

  async updInterface(dto: InterfaceUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<InterfaceDto>('sys_interface', dto);
    return R.ok(res);
  }

  async updInterfaces(dtos: InterfaceUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<InterfaceDto>('sys_interface', dtos);
    return R.ok(res);
  }

  async delInterface(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<InterfaceDto>('sys_interface', ids);
    return R.ok(res);
  }
}
