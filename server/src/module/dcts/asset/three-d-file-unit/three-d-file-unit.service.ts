import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { ThreeDFileUnitDto, ThreeDFileUnitSelListDto, ThreeDFileUnitSelAllDto, ThreeDFileUnitInsOneDto, ThreeDFileUnitUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class ThreeDFileUnitService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('three_d_file_unit', {
      notNullKeys: ['groupId', 'name', 'description', 'orderNum'],
      numberKeys: ['groupId', 'orderNum'],
    });
  }

  async selThreeDFileUnit(dto: ThreeDFileUnitSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<ThreeDFileUnitDto>('three_d_file_unit', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllThreeDFileUnit(dto: ThreeDFileUnitSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<ThreeDFileUnitDto>('three_d_file_unit', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesThreeDFileUnit(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<ThreeDFileUnitDto>('three_d_file_unit', ids);
    return R.ok(res);
  }

  async selOneThreeDFileUnit(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<ThreeDFileUnitDto>('three_d_file_unit', id);
    return R.ok(res);
  }

  async insThreeDFileUnit(dto: ThreeDFileUnitInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<ThreeDFileUnitDto>('three_d_file_unit', dto);
    return R.ok(res);
  }

  async insThreeDFileUnits(dtos: ThreeDFileUnitInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<ThreeDFileUnitDto>('three_d_file_unit', dtos);
    return R.ok(res);
  }

  async updThreeDFileUnit(dto: ThreeDFileUnitUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<ThreeDFileUnitDto>('three_d_file_unit', dto);
    return R.ok(res);
  }

  async updThreeDFileUnits(dtos: ThreeDFileUnitUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<ThreeDFileUnitDto>('three_d_file_unit', dtos);
    return R.ok(res);
  }

  async delThreeDFileUnit(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<ThreeDFileUnitDto>('three_d_file_unit', ids);
    return R.ok(res);
  }
}
