import { Injectable } from '@nestjs/common';
import { MysqlPrismaService } from '../../../../infra/prisma/mysql.prisma.service';
import { R } from '../../../../common/R';
import { DeptSysDto, DeptSysSelListDto, DeptSysSelAllDto, DeptSysInsOneDto, DeptSysUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';

@Injectable()
export class DeptSysService {
  constructor(
    private readonly mysqlPrisma: MysqlPrismaService,
    private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('sys_dept_sys', {
      notNullKeys: ['deptId', 'sysId'],
      numberKeys: ['deptId', 'sysId'],
    })
  }

  async selDeptSys(dto: DeptSysSelListDto): Promise<R> {
    const res = await this.mysqlPrisma.findPage<DeptSysDto, DeptSysSelListDto>('sys_dept_sys', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllDeptSys(dto: DeptSysSelAllDto): Promise<R> {
    const res = await this.mysqlPrisma.findAll<DeptSysDto>('sys_dept_sys', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesDeptSys(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.findByIds<DeptSysDto>('sys_dept_sys', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneDeptSys(id: number): Promise<R> {
    const res = await this.mysqlPrisma.findById<DeptSysDto>('sys_dept_sys', Number(id));
    return R.ok(res);
  }

  async insDeptSys(dto: DeptSysInsOneDto): Promise<R> {
    const res = await this.mysqlPrisma.create<DeptSysDto>('sys_dept_sys', dto);
    return R.ok(res);
  }

  async insDeptSyss(dtos: DeptSysInsOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.createMany<DeptSysDto>('sys_dept_sys', dtos);
    return R.ok(res);
  }

  async updDeptSys(dto: DeptSysUpdOneDto): Promise<R> {
    const res = await this.mysqlPrisma.updateById<DeptSysDto>('sys_dept_sys', dto);
    return R.ok(res);
  }

  async updDeptSyss(dtos: DeptSysUpdOneDto[]): Promise<R> {
    const res = await this.mysqlPrisma.updateMany<DeptSysDto>('sys_dept_sys', dtos);
    return R.ok(res);
  }

  async delDeptSys(ids: number[]): Promise<R> {
    const res = await this.mysqlPrisma.deleteById<DeptSysDto>('sys_dept_sys', ids);
    return R.ok(res);
  }
}
