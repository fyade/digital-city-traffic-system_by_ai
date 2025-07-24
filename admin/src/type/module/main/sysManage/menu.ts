import { BaseClass, PageDto } from "@/type/tablePage.ts";
import { base } from "@dcts/common";

export class MenuDto<T = base.MenuTypeEnum> extends BaseClass {
  id!: number;
  label!: string;
  type!: T;
  path!: string;
  parentId!: number;
  component!: string;
  icon!: string;
  orderNum!: number;
  ifLink!: string;
  ifVisible!: string;
  ifDisabled!: string;
  ifPublic!: string;
  ifFixed!: string;
  perms!: string;
  sysId!: number;
  remark!: string;
}

export class MenuSelDto extends PageDto {
}

export class MenuSelAllDto {
}

export class MenuInsDto<T = base.MenuTypeEnum> {
  label!: string;
  type!: T;
  path!: string;
  parentId!: number;
  component!: string;
  icon!: string;
  orderNum!: number;
  ifLink!: string;
  ifVisible!: string;
  ifDisabled!: string;
  ifPublic!: string;
  ifFixed!: string;
  perms!: string;
  sysId!: number;
  remark!: string;
}

export class MenuUpdDto<T = base.MenuTypeEnum> extends MenuInsDto<T> {
  id!: number;
}
