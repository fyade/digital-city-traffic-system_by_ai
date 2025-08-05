import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { MenuIpWhiteListDto, MenuIpWhiteListSelListDto, MenuIpWhiteListSelAllDto, MenuIpWhiteListInsOneDto, MenuIpWhiteListUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CachePermissionService } from '../../../../infra/cache/cache.permission.service';

@Injectable()
export class MenuIpWhiteListService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
    private readonly cachePermissionService: CachePermissionService,
  ) {
    this.bcs.setFieldSelectParam('sys_menu_ip_white_list', {
      notNullKeys: ['menuId', 'whiteList', 'fromType', 'type'],
      numberKeys: ['menuId'],
    })
  }

  async selMenuIpWhiteList(dto: MenuIpWhiteListSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<MenuIpWhiteListDto, MenuIpWhiteListSelListDto>('sys_menu_ip_white_list', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllMenuIpWhiteList(dto: MenuIpWhiteListSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<MenuIpWhiteListDto>('sys_menu_ip_white_list', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesMenuIpWhiteList(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<MenuIpWhiteListDto>('sys_menu_ip_white_list', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneMenuIpWhiteList(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<MenuIpWhiteListDto>('sys_menu_ip_white_list', Number(id));
    return R.ok(res);
  }

  async insMenuIpWhiteList(dto: MenuIpWhiteListInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<MenuIpWhiteListDto>('sys_menu_ip_white_list', dto);
    await this.cachePermissionService.clearIpWhiteListOfPermissionInCache();
    return R.ok(res);
  }

  async insMenuIpWhiteLists(dtos: MenuIpWhiteListInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<MenuIpWhiteListDto>('sys_menu_ip_white_list', dtos);
    await this.cachePermissionService.clearIpWhiteListOfPermissionInCache();
    return R.ok(res);
  }

  async updMenuIpWhiteList(dto: MenuIpWhiteListUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<MenuIpWhiteListDto>('sys_menu_ip_white_list', dto);
    await this.cachePermissionService.clearIpWhiteListOfPermissionInCache();
    return R.ok(res);
  }

  async updMenuIpWhiteLists(dtos: MenuIpWhiteListUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<MenuIpWhiteListDto>('sys_menu_ip_white_list', dtos);
    await this.cachePermissionService.clearIpWhiteListOfPermissionInCache();
    return R.ok(res);
  }

  async delMenuIpWhiteList(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<MenuIpWhiteListDto>('sys_menu_ip_white_list', ids);
    await this.cachePermissionService.clearIpWhiteListOfPermissionInCache();
    return R.ok(res);
  }
}
