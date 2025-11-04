import { Injectable } from "@nestjs/common";
import { MysqlPrismaService } from '../prisma/mysql.prisma.service';
import { DicTypeDto } from "../../module/main/sys-manage/dic-type/dto";
import { final } from "../../util/base";
import { DicDataDto } from "../../module/main/sys-manage/dic-data/dto";
import { DiscoveryService, Reflector } from "@nestjs/core";
import { PRE_AUTHORIZE_KEY, PreAuthorizeParams } from "../../decorator/authorize.decorator";

@Injectable()
export class CommonService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {
    this.init()
  }

  private allPermissions: PreAuthorizeParams[] = []

  private async init() {
    const providers = this.discoveryService.getControllers();
    providers.forEach(provider => {
      if (!provider.metatype) {
        return;
      }
      const instance = provider.instance;
      if (!instance) {
        return;
      }
      const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
      methodNames.forEach(methodName => {
        const method = instance[methodName];
        if (typeof method !== 'function') {
          return;
        }
        const permissionData = this.reflector.get<PreAuthorizeParams>(PRE_AUTHORIZE_KEY, method);
        if (permissionData && permissionData.permission !== '-') {
          this.allPermissions.push(permissionData);
        }
      })
    })
  }

  getAllPermissions() {
    return this.allPermissions;
  }

  async selDicDataOfType(perm: string, label: string = '') {
    const dicTypeDto = await this.mysqlPrisma.findFirst<DicTypeDto>('sys_dic_type', {
      type: perm,
      ifDisabled: final.N,
    });
    const ret: DicDataDto[] = [];
    if (dicTypeDto) {
      const dicDataDtos = await this.mysqlPrisma.findAll<DicDataDto>('sys_dic_data', {
        data: { label: label, dicTypeId: dicTypeDto.id, ifDisabled: final.N },
        orderBy: true,
      });
      ret.push(...dicDataDtos);
    }
    return ret;
  }
}
