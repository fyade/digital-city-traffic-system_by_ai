import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { ThreeDFileGroupDto, ThreeDFileGroupSelListDto, ThreeDFileGroupSelAllDto, ThreeDFileGroupInsOneDto, ThreeDFileGroupUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class ThreeDFileGroupService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('three_d_file_group', {
      notNullKeys: ['name', 'description', 'orderNum'],
      numberKeys: ['orderNum'],
    });
  }

  async selThreeDFileGroup(dto: ThreeDFileGroupSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<ThreeDFileGroupDto, ThreeDFileGroupSelListDto>('three_d_file_group', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selAllThreeDFileGroup(dto: ThreeDFileGroupSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<ThreeDFileGroupDto>('three_d_file_group', {
      data: dto,
      orderBy: true,
    });
    return R.ok(res);
  }

  async selOnesThreeDFileGroup(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<ThreeDFileGroupDto>('three_d_file_group', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneThreeDFileGroup(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<ThreeDFileGroupDto>('three_d_file_group', Number(id));
    return R.ok(res);
  }

  async insThreeDFileGroup(dto: ThreeDFileGroupInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<ThreeDFileGroupDto>('three_d_file_group', dto);
    return R.ok(res);
  }

  async insThreeDFileGroups(dtos: ThreeDFileGroupInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<ThreeDFileGroupDto>('three_d_file_group', dtos);
    return R.ok(res);
  }

  async updThreeDFileGroup(dto: ThreeDFileGroupUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<ThreeDFileGroupDto>('three_d_file_group', dto);
    return R.ok(res);
  }

  async updThreeDFileGroups(dtos: ThreeDFileGroupUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<ThreeDFileGroupDto>('three_d_file_group', dtos);
    return R.ok(res);
  }

  async delThreeDFileGroup(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<ThreeDFileGroupDto>('three_d_file_group', ids);
    return R.ok(res);
  }
}
