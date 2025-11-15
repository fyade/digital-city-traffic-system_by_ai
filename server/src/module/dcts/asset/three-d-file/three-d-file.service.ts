import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { ThreeDFileDto, ThreeDFileSelListDto, ThreeDFileSelAllDto, ThreeDFileInsOneDto, ThreeDFileUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class ThreeDFileService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('three_d_file', {
      notNullKeys: ['unitId', 'fileName', 'orderNum'],
      numberKeys: ['unitId', 'orderNum'],
    });
  }

  async selThreeDFile(dto: ThreeDFileSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<ThreeDFileDto>('three_d_file', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllThreeDFile(dto: ThreeDFileSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<ThreeDFileDto>('three_d_file', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesThreeDFile(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<ThreeDFileDto>('three_d_file', ids);
    return R.ok(res);
  }

  async selOneThreeDFile(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<ThreeDFileDto>('three_d_file', id);
    return R.ok(res);
  }

  async insThreeDFile(dto: ThreeDFileInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<ThreeDFileDto>('three_d_file', dto);
    return R.ok(res);
  }

  async insThreeDFiles(dtos: ThreeDFileInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<ThreeDFileDto>('three_d_file', dtos);
    return R.ok(res);
  }

  async updThreeDFile(dto: ThreeDFileUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<ThreeDFileDto>('three_d_file', dto);
    return R.ok(res);
  }

  async updThreeDFiles(dtos: ThreeDFileUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<ThreeDFileDto>('three_d_file', dtos);
    return R.ok(res);
  }

  async delThreeDFile(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<ThreeDFileDto>('three_d_file', ids);
    return R.ok(res);
  }
}
