import { Injectable } from '@nestjs/common';
import { R } from './common/R';
import { AuthService } from './infra/auth/auth.service';
import { BaseContextService } from './infra/base-context/base-context.service';
import { serverConfig } from "@dcts/config";
import { WinstonService } from "./infra/winston/winston.service";
import { MysqlPrismaoService } from "./infra/prisma/mysql.prismao.service";
import { PrismaoService } from './infra/prisma/prismao.service';
import { base } from '@dcts/common';
import { CommonService } from "./infra/common/common.service";
import { PreAuthorizeParams } from "./decorator/authorize.decorator";

const si = require("systeminformation");

@Injectable()
export class AppService {
  private cpuUsageMSDefault: number;

  constructor(
      private readonly authService: AuthService,
      private readonly bcs: BaseContextService,
      private readonly prismao: PrismaoService,
      private readonly mysqlPrismao: MysqlPrismaoService,
      private readonly winston: WinstonService,
      private readonly commonService: CommonService,
  ) {
    this.cpuUsageMSDefault = 100; // CPU 利用率默认时间段
  }

  async getHello(): Promise<R> {
    return R.ok('Hello World!');
  }

  async getVersion(): Promise<R> {
    return R.ok(serverConfig.currentVersion);
  }

  async getTime(): Promise<R> {
    return R.ok(new Date());
  }

  async getSystemUsingInfo(): Promise<R> {
    const ress = await Promise.allSettled([
      this.getCPUUsage(),
      this.getMemoryInfo(),
      this.getDiskInfo()
    ])
    return R.ok({
      cpu: ress[0].status === 'fulfilled' ? ress[0].value : null,
      memory: ress[1].status === 'fulfilled' ? ress[1].value : null,
      disk: ress[2].status === 'fulfilled' ? ress[2].value : null,
    })
  }

  async getAllAuthApis(): Promise<R<PreAuthorizeParams[]>> {
    const allPermissions = this.commonService.getAllPermissions();
    return R.ok(allPermissions);
  }

  async getAllAuthApis2(): Promise<R> {
    const hdData = await this.getAllAuthApis();
    const dbData = await this.mysqlPrismao.sys_menu.findMany({
      where: {
        ...this.prismao.defaultSelArg().where,
      }
    })
    const dbPerms = dbData.filter(item => item.type === 'mb').map(item => [item.label, item.perms]);
    const hdPerms = hdData.data.map(d => [d.label, d.permission]);
    const dbPerms1 = dbPerms.map(_ => _[1]);
    const hdPerms1 = hdPerms.map(_ => _[1]);
    // 后端有数据库没有的
    const permsNotInDb = hdPerms1.filter(item => !dbPerms1.includes(item))
    // 数据库有后端没有的
    const permsNotInHd = dbPerms1.filter(item => !hdPerms1.includes(item))
    // label不一样的
    const labelDiffs = [
      ...dbPerms.filter(item => {
        const find1 = dbPerms.find(itm => itm[1] === item[1])
        const find2 = hdPerms.find(itm => itm[1] === item[1])
        return find1 && find2 && find1[0] !== find2[0]
      }),
      ...hdPerms.filter(item => {
        const find1 = dbPerms.find(itm => itm[1] === item[1])
        const find2 = hdPerms.find(itm => itm[1] === item[1])
        return find1 && find2 && find1[0] !== find2[0]
      })
    ]
    return R.ok({
      permsNotInDb,
      permsNotInHd,
      labelDiffs,
      label: {
        permsNotInDb: '后端有数据库没有的',
        permsNotInHd: '数据库有后端没有的',
        labelDiffs: 'label不一样的',
      }
    });
  }

  async getSystems(): Promise<R> {
    const systemsOfUser = await this.authService.systemsOfUser(
        this.bcs.getUserData().userId,
        this.bcs.getUserData().loginRole,
    );
    return R.ok(systemsOfUser);
  }

  async getPages(sysId: number): Promise<R> {
    const permissionsOfUser = await this.authService.permissionsOfUser({
      userId: this.bcs.getUserData().userId,
      loginRole: this.bcs.getUserData().loginRole,
      sysId,
      menuType: [base.MenuTypeEnum.T_MENU, base.MenuTypeEnum.T_COMP],
    });
    return R.ok(permissionsOfUser);
  }

  async getButtons(sysId: number): Promise<R> {
    const buttonsOfUser = await this.authService.permissionsOfUser({
      userId: this.bcs.getUserData().userId,
      loginRole: this.bcs.getUserData().loginRole,
      sysId,
      menuType: [base.MenuTypeEnum.T_IS, base.MenuTypeEnum.T_Inter],
    });
    return R.ok(buttonsOfUser);
  }

  /**
   * 获取CPU信息
   */
  private async getCPUUsage() {
    return new Promise(resolve => {
      // si.cpu().then(data => resolve(data));
      resolve(null)
    })
  }

  /**
   * 获取内存信息
   */
  private async getMemoryInfo() {
    return new Promise(resolve => {
      si.mem().then(res => resolve({
        total: res.total,
        free: res.free,
        used: res.used,
      }))
    })
  }

  /**
   * 获取磁盘信息
   */
  private getDiskInfo() {
    return new Promise((resolve) => {
      si.fsSize().then(res => {
        resolve(res.map(item => ({
          mount: item.mount,
          size: item.size,
          used: item.used,
          available: item.available,
        })))
      })
    });
  }
}
