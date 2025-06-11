import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import {
  JunctionPositionDto,
  JunctionPositionSelListDto,
  JunctionPositionSelAllDto,
  JunctionPositionInsOneDto,
  JunctionPositionUpdOneDto
} from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaoService } from "../../../../../prisma/postgresql.prismao.service";
import { PageVo } from "../../../../../common/vo/PageVo";
import { UnknownException } from "../../../../../exception/unknown.exception";
import { base } from "../../../../../util/base";

@Injectable()
export class JunctionPositionService {
  constructor(
      private readonly pgprismao: PostgresqlPrismaoService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('manual_junctions', {
      notNullKeys: ['geom', 'name', 'junctionType'],
    });
  }

  async selJunctionPosition(dto: JunctionPositionSelListDto): Promise<R> {
    const pageNum = dto.pageNum;
    const pageSize = dto.pageSize;
    delete dto.pageNum;
    delete dto.pageSize;
    const datas: JunctionPositionDto[] = await this.pgprismao.$queryRawUnsafe(`
        select id                                              as id,
               concat(st_x(geom)::text, ',', st_y(geom)::text) as geom,
               feature_id                                      as featureId,
               name                                            as name,
               junction_type                                   as junctionType,
               create_role                                     as createRole,
               update_role                                     as updateRole,
               create_by                                       as createBy,
               update_by                                       as updateBy,
               create_time                                     as createTime,
               update_time                                     as updateTime,
               deleted                                         as deleted
        from manual_junctions
        where deleted = '${base.N}' ${this.pgprismao.genSelParam(dto)}
            limit ${pageSize}
        offset ${(pageNum - 1) * pageSize};
    `);
    const total = await this.pgprismao.$queryRawUnsafe(`
        select count(*) as count
        from manual_junctions
        where deleted = '${base.N}' ${this.pgprismao.genSelParam(dto)};
    `)
    const pageVo = new PageVo<JunctionPositionDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllJunctionPosition(dto: JunctionPositionSelAllDto): Promise<R> {
    const datas = await this.pgprismao.$queryRawUnsafe(`
        select id                                              as id,
               concat(st_x(geom)::text, ',', st_y(geom)::text) as geom,
               feature_id                                      as featureId,
               name                                            as name,
               junction_type                                   as junctionType,
               create_role                                     as createRole,
               update_role                                     as updateRole,
               create_by                                       as createBy,
               update_by                                       as updateBy,
               create_time                                     as createTime,
               update_time                                     as updateTime,
               deleted                                         as deleted
        from manual_junctions
        where deleted = '${base.N}' ${this.pgprismao.genSelParam(dto)};
    `);
    return R.ok(datas);
  }

  async selOnesJunctionPosition(ids: number[]): Promise<R> {
    ids = Object.values(ids).map(n => Number(n));
    const res = await this.pgprismao.$queryRawUnsafe(`
        select id                                              as id,
               concat(st_x(geom)::text, ',', st_y(geom)::text) as geom,
               feature_id                                      as featureId,
               name                                            as name,
               junction_type                                   as junctionType,
               create_role                                     as createRole,
               update_role                                     as updateRole,
               create_by                                       as createBy,
               update_by                                       as updateBy,
               create_time                                     as createTime,
               update_time                                     as updateTime,
               deleted                                         as deleted
        from manual_junctions
        where deleted = '${base.N}'
          and id in (${ids.join(', ')});
    `)
    return R.ok(res);
  }

  async selOneJunctionPosition(id: number): Promise<R> {
    const ress = await this.pgprismao.$queryRawUnsafe(`
        select id                                              as id,
               concat(st_x(geom)::text, ',', st_y(geom)::text) as geom,
               feature_id                                      as featureId,
               name                                            as name,
               junction_type                                   as junctionType,
               create_role                                     as createRole,
               update_role                                     as updateRole,
               create_by                                       as createBy,
               update_by                                       as updateBy,
               create_time                                     as createTime,
               update_time                                     as updateTime,
               deleted                                         as deleted
        from manual_junctions
        where deleted = '${base.N}'
          and id = ${id};
    `)
    const res = ress[0];
    return R.ok(res);
  }

  async insJunctionPosition(dto: JunctionPositionInsOneDto): Promise<R> {
    throw new UnknownException(this.bcs.getUserData().reqId);
    // const res = await this.prisma.create<JunctionPositionDto>('manual_junctions', dto);
    // return R.ok(res);
  }

  async insJunctionPositions(dtos: JunctionPositionInsOneDto[]): Promise<R> {
    throw new UnknownException(this.bcs.getUserData().reqId);
    // const res = await this.prisma.createMany<JunctionPositionDto>('manual_junctions', dtos);
    // return R.ok(res);
  }

  async updJunctionPosition(dto: JunctionPositionUpdOneDto): Promise<R> {
    throw new UnknownException(this.bcs.getUserData().reqId);
    // const res = await this.prisma.updateById<JunctionPositionDto>('manual_junctions', dto);
    // return R.ok(res);
  }

  async updJunctionPositions(dtos: JunctionPositionUpdOneDto[]): Promise<R> {
    throw new UnknownException(this.bcs.getUserData().reqId);
    // const res = await this.prisma.updateMany<JunctionPositionDto>('manual_junctions', dtos);
    // return R.ok(res);
  }

  async delJunctionPosition(ids: number[]): Promise<R> {
    await this.pgprismao.$queryRawUnsafe(`
        update manual_junctions
        set deleted = '${base.Y}'
        where deleted = '${base.N}'
          and id in (${ids.join(', ')});
    `)
    return R.ok(true);
  }
}
