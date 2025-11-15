import { Injectable } from '@nestjs/common';
import { R } from '../../../common/R';
import { AlgorithmDto } from './dto';
import { InterfaceFacadeService } from '../interface/interface.facade.service';
import { InterfaceGroupFacadeService } from '../interface-group/interface-group.facade.service';
import { AuthService } from '../../../infra/auth/auth.service';
import { requestSF } from '../../../api/request';
import { final } from '../../../util/base';
import { BaseContextService } from '../../../infra/base-context/base-context.service';
import { Exception } from '../../../exception/exception';

@Injectable()
export class AlgorithmService {
  constructor(
    private readonly authService: AuthService,
    private readonly interfaceFacadeService: InterfaceFacadeService,
    private readonly interfaceGroupFacadeService: InterfaceGroupFacadeService,
    private readonly bcs: BaseContextService,
  ) {
  }

  async algorithm(dto: AlgorithmDto): Promise<R> {
    const permission = dto.perms;
    const sfPermissionsOfUserid = await this.authService.getSFPermissionsOfUserid(this.bcs.getUserData().userId, dto.pperms, permission, this.bcs.getUserData().loginRole, final.Y);
    if (sfPermissionsOfUserid.length > 0) {
      const permissionId = sfPermissionsOfUserid.every(item => item.ifUseUp === final.Y)
        ? sfPermissionsOfUserid[sfPermissionsOfUserid.length - 1].permissionId
        : sfPermissionsOfUserid[sfPermissionsOfUserid.findIndex(item => item.ifUseUp === final.N)].permissionId;
      const interfaceGroup = await this.interfaceGroupFacadeService.selOneInterfaceGroup(permissionId);
      const inter = await this.interfaceFacadeService.selAllInterface({ perms: dto.perms });
      if (interfaceGroup && inter.length > 0) {
        const response = await requestSF({
          baseURL: interfaceGroup.baseURL,
          url: inter[0].url,
          data: dto.data,
        });
        return R.ok(response);
      }
    }
    throw new Exception('');
  }
}
