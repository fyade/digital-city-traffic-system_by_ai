import { Injectable } from '@nestjs/common';
import { BaseContextService } from '../base-context/base-context.service';
import { baseInterfaceColumns2 } from '../../module/main/sys-util/code-generation/codeGeneration';
import { baseUtils } from '@dcts/common';
import { final } from '../../util/base';

@Injectable()
export class PrismaoService {
  constructor(protected readonly bcs: BaseContextService) {}

  private getUserId() {
    return this.bcs.getUserData().userId || '???';
  }

  private getLoginRole() {
    return this.bcs.getUserData().loginRole || '???';
  }

  public defaultSelArg = ({
    model = '',
    selKeys = [],
    ifDeleted = true,
  }: {
    model?: string;
    selKeys?: string[];
    ifDeleted?: boolean;
  } = {}) => {
    const retObj = {
      ...(selKeys.length > 0
        ? {
            select: [...selKeys, ...baseInterfaceColumns2].reduce(
              (o, a) => ({
                ...o,
                [baseUtils.toSnakeCase(a)]: true,
              }),
              {},
            ),
          }
        : {}),
      where: {},
    };
    if (model && selKeys.length > 0 && retObj.select) {
      const fieldSelectParam = this.bcs.getFieldSelectParam(model);
      if (fieldSelectParam) {
        if (!fieldSelectParam.ifCreateRole) delete retObj.select['create_role'];
        if (!fieldSelectParam.ifUpdateRole) delete retObj.select['update_role'];
        if (!fieldSelectParam.ifCreateBy) delete retObj.select['create_by'];
        if (!fieldSelectParam.ifUpdateBy) delete retObj.select['update_by'];
        if (!fieldSelectParam.ifCreateTime) delete retObj.select['create_time'];
        if (!fieldSelectParam.ifUpdateTime) delete retObj.select['update_time'];
        if (!fieldSelectParam.ifDeleted) delete retObj.select['deleted'];
      }
    }
    if (ifDeleted) retObj.where['deleted'] = final.N;
    return retObj;
  };

  public defaultInsArg = ({
    ifCreateRole = true,
    ifUpdateRole = true,
    ifCreateBy = true,
    ifUpdateBy = true,
    ifCreateTime = true,
    ifUpdateTime = true,
    ifDeleted = true,
  }: {
    ifCreateRole?: boolean;
    ifUpdateRole?: boolean;
    ifCreateBy?: boolean;
    ifUpdateBy?: boolean;
    ifCreateTime?: boolean;
    ifUpdateTime?: boolean;
    ifDeleted?: boolean;
  } = {}) => {
    const time1 = new Date();
    const retObj = {
      data: {
        create_role: '',
        update_role: '',
        create_by: '',
        update_by: '',
        create_time: time1,
        update_time: time1,
        deleted: final.N,
      },
    };
    if (ifCreateRole) {
      retObj.data.create_role = this.getLoginRole();
    } else {
      delete retObj.data.create_role;
    }
    if (ifUpdateRole) {
      retObj.data.update_role = this.getLoginRole();
    } else {
      delete retObj.data.update_role;
    }
    if (ifCreateBy) {
      retObj.data.create_by = this.getUserId();
    } else {
      delete retObj.data.create_by;
    }
    if (ifUpdateBy) {
      retObj.data.update_by = this.getUserId();
    } else {
      delete retObj.data.update_by;
    }
    if (!ifCreateTime) {
      delete retObj.data.create_time;
    }
    if (!ifUpdateTime) {
      delete retObj.data.update_time;
    }
    if (!ifDeleted) {
      delete retObj.data.deleted;
    }
    return retObj;
  };

  public defaultUpdArg = ({
    ifUpdateRole = true,
    ifUpdateBy = true,
    ifUpdateTime = true,
    ifDeleted = true,
  }: {
    ifUpdateRole?: boolean;
    ifUpdateBy?: boolean;
    ifUpdateTime?: boolean;
    ifDeleted?: boolean;
  } = {}) => {
    const retObj = {
      where: {
        deleted: final.N,
      },
      data: {
        update_role: '',
        update_by: '',
        update_time: new Date(),
      },
    };
    if (ifUpdateRole) {
      retObj.data.update_role = this.getLoginRole();
    } else {
      delete retObj.data.update_role;
    }
    if (ifUpdateBy) {
      retObj.data.update_by = this.getUserId();
    } else {
      delete retObj.data.update_by;
    }
    if (!ifUpdateTime) {
      delete retObj.data.update_time;
    }
    if (!ifDeleted) {
      delete retObj.where.deleted;
    }
    return retObj;
  };

  public defaultDelArg = ({
    ifUpdateRole = true,
    ifUpdateBy = true,
    ifUpdateTime = true,
    ifDeleted = true,
  }: {
    ifUpdateRole?: boolean;
    ifUpdateBy?: boolean;
    ifUpdateTime?: boolean;
    ifDeleted?: boolean;
  } = {}) => {
    const retObj = {
      where: {
        deleted: final.N,
      },
      data: {
        update_role: '',
        update_by: '',
        update_time: new Date(),
        deleted: final.Y,
      },
    };
    if (ifUpdateRole) {
      retObj.data.update_role = this.getLoginRole();
    } else {
      delete retObj.data.update_role;
    }
    if (ifUpdateBy) {
      retObj.data.update_by = this.getUserId();
    } else {
      delete retObj.data.update_by;
    }
    if (!ifUpdateTime) {
      delete retObj.data.update_time;
    }
    if (!ifDeleted) {
      delete retObj.where.deleted;
    }
    return retObj;
  };
}
