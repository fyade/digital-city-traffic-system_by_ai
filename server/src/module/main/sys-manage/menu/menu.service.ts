import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { MenuDto, MenuSelListDto, MenuSelAllDto, MenuInsOneDto, MenuUpdOneDto } from './dto';
import { CachePermissionService } from '../../../../infra/cache/cache.permission.service';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { Exception } from "../../../../exception/exception";

@Injectable()
export class MenuService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
    this.bcs.setFieldSelectParam('sys_menu', {
      notNullKeys: ['label', 'type', 'path', 'parentId', 'component', 'icon', 'orderNum', 'ifLink', 'ifVisible', 'ifDisabled', 'ifPublic', 'ifFixed', 'perms', 'sysId'],
      numberKeys: ['parentId', 'orderNum', 'sysId'],
    });
  }

  async selMenu(dto: MenuSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<MenuDto>('sys_menu', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllMenu(dto: MenuSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<MenuDto>('sys_menu', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesMenu(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<MenuDto>('sys_menu', ids);
    return R.ok(res);
  }

  async selOneMenu(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<MenuDto>('sys_menu', id);
    return R.ok(res);
  }

  async insMenu(dto: MenuInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<MenuDto>('sys_menu', dto);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }

  async insMenus(dtos: MenuInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<MenuDto>('sys_menu', dtos);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }

  async updMenu(dto: MenuUpdOneDto): Promise<R> {
    if (dto.id === dto.parentId) {
      throw new Exception('父级菜单不可选自己！');
    }
    const res = await this.mysqlPrisma.updateById<MenuDto>('sys_menu', dto);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }

  async updMenus(dtos: MenuUpdOneDto[]): Promise<R> {
    if (dtos.some(item => item.id === item.parentId)) {
      throw new Exception('父级菜单不可选自己！');
    }
    const res = await this.mysqlPrisma.updateMany<MenuDto>('sys_menu', dtos);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }

  async delMenu(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<MenuDto>('sys_menu', ids);
    await this.cachePermissionService.clearPermissionsInCache();
    return R.ok(res);
  }
}
