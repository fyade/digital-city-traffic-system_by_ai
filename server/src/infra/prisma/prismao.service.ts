import { Injectable } from "@nestjs/common";
import { BaseContextService } from "../base-context/base-context.service";
import { baseInterfaceColumns2 } from "../../module/main/sys-util/code-generation/codeGeneration";
import { baseUtils } from "@dcts/common";
import { final } from "../../util/base";

@Injectable()
export class PrismaoService {
  constructor(
      protected readonly bcs: BaseContextService,
  ) {
  }

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
                            ifUseSelfData = false,
                          }: {
                            model?: string,
                            selKeys?: string[],
                            ifDeleted?: boolean,
                            ifUseSelfData?: boolean,
                          } = {},
  ) => {
    const retObj = {
      ...(selKeys.length > 0 ? {
        select: [...selKeys, ...baseInterfaceColumns2].reduce((o, a) => ({
          ...o,
          [baseUtils.toSnakeCase(a)]: true,
        }), {}),
      } : {}),
      where: {},
    };
    if (model && selKeys.length > 0 && retObj.select) {
      const fieldSelectParam = this.bcs.getFieldSelectParam(model);
      if (fieldSelectParam) {
        if (!fieldSelectParam.ifCreateRole) delete retObj.select['create_role']
        if (!fieldSelectParam.ifUpdateRole) delete retObj.select['update_role']
        if (!fieldSelectParam.ifCreateBy) delete retObj.select['create_by']
        if (!fieldSelectParam.ifUpdateBy) delete retObj.select['update_by']
        if (!fieldSelectParam.ifCreateTime) delete retObj.select['create_time']
        if (!fieldSelectParam.ifUpdateTime) delete retObj.select['update_time']
        if (!fieldSelectParam.ifDeleted) delete retObj.select['deleted']
      }
    }
    if (ifUseSelfData) {
      retObj.where['create_role'] = this.getLoginRole();
      retObj.where['create_by'] = this.getUserId();
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
                            ifCreateRole?: boolean,
                            ifUpdateRole?: boolean,
                            ifCreateBy?: boolean,
                            ifUpdateBy?: boolean,
                            ifCreateTime?: boolean,
                            ifUpdateTime?: boolean,
                            ifDeleted?: boolean,
                          } = {},
  ) => {
    const userid = this.getUserId();
    const time1 = new Date();
    const retObj = {
      data: {
        create_role: this.getLoginRole(),
        update_role: this.getLoginRole(),
        create_by: userid,
        update_by: userid,
        create_time: time1,
        update_time: time1,
        deleted: final.N,
      },
    };
    if (!ifCreateRole) delete retObj.data.create_role;
    if (!ifUpdateRole) delete retObj.data.update_role;
    if (!ifCreateBy) delete retObj.data.create_by;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifCreateTime) delete retObj.data.create_time;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.data.deleted;
    return retObj;
  };

  public defaultUpdArg = ({
                            ifUpdateRole = true,
                            ifUpdateBy = true,
                            ifUpdateTime = true,
                            ifDeleted = true,
                            ifUseSelfData = false,
                          }: {
                            ifUpdateRole?: boolean,
                            ifUpdateBy?: boolean,
                            ifUpdateTime?: boolean,
                            ifDeleted?: boolean,
                            ifUseSelfData?: boolean,
                          } = {},
  ) => {
    const retObj = {
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: final.N,
      },
      data: {
        update_role: this.getLoginRole(),
        update_by: this.getUserId(),
        update_time: new Date(),
      },
    };
    if (!ifUpdateRole) delete retObj.data.update_role;
    if (!ifUpdateBy) delete retObj.data.update_by;
    if (!ifUpdateTime) delete retObj.data.update_time;
    if (!ifDeleted) delete retObj.where.deleted;
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };

  public defaultDelArg = ({
                            ifUseSelfData = false,
                          }: {
                            ifUseSelfData?: boolean
                          } = {},
  ) => {
    const retObj = {
      where: {
        create_role: this.getLoginRole(),
        create_by: this.getUserId(),
        deleted: final.N,
      },
      data: {
        update_role: this.getLoginRole(),
        update_by: this.getUserId(),
        update_time: new Date(),
        deleted: final.Y,
      },
    };
    if (!ifUseSelfData) {
      delete retObj.where.create_role;
      delete retObj.where.create_by;
    }
    return retObj;
  };
}
