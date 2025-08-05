import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { JunctionPositionDto, JunctionPositionSelListDto, JunctionPositionSelAllDto, JunctionPositionInsOneDto, JunctionPositionUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { CommonPostgresqlPrismaoService } from "../../../../infra/prisma/common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { CountSqlReturnDto } from "../../../../util/base";
import { PageVo } from "../../../../common/vo/PageVo";

@Injectable()
export class JunctionPositionService {
  constructor(
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
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
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'selList',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selParam: dto,
      pageNum: pageNum,
      pageSize: pageSize,
    });
    const datas: JunctionPositionDto[] = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const sqls2 = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'selCount',
      tblName: 'manual_junctions',
      selParam: dto,
    });
    const total: CountSqlReturnDto = await this.pgsqlPrismao.$queryRawUnsafe(sqls2[0]);
    const pageVo = new PageVo<JunctionPositionDto>(pageNum, pageSize, total[0].count, datas);
    return R.ok(pageVo);
  }

  async selAllJunctionPosition(dto: JunctionPositionSelAllDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'selAll',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selParam: dto,
    });
    const datas = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(datas);
  }

  async selOnesJunctionPosition(ids: number[]): Promise<R> {
    ids = Object.values(ids).map(Number);
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'selByIds',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selIds: ids,
    });
    const res = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(res);
  }

  async selOneJunctionPosition(id: number): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'selById',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selIds: [id],
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insJunctionPosition(dto: JunctionPositionInsOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'ins',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      datas: [dto],
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selfDefineInsUpdKey: {
        geom: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async insJunctionPositions(dtos: JunctionPositionInsOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'ins',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      datas: dtos,
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selfDefineInsUpdKey: {
        geom: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async updJunctionPosition(dto: JunctionPositionUpdOneDto): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'upd',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      datas: [dto],
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selfDefineInsUpdKey: {
        geom: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const ress = await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    const res = ress[0];
    return R.ok(res);
  }

  async updJunctionPositions(dtos: JunctionPositionUpdOneDto[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'upd',
      tblName: 'manual_junctions',
      clas: new JunctionPositionDto(),
      datas: dtos,
      selfDefineSelKey: {
        geom: 'concat(st_x(geom)::text, \',\', st_y(geom)::text)'
      },
      selfDefineInsUpdKey: {
        geom: value => `st_setsrid(st_makepoint(${value.split(',')[0]}, ${value.split(',')[1]}), 4326)`
      }
    });
    const res = [];
    for (const sql of sqls) {
      const newVar = await this.pgsqlPrismao.$queryRawUnsafe(sql);
      res.push(newVar[0]);
    }
    return R.ok(res);
  }

  async delJunctionPosition(ids: number[]): Promise<R> {
    const sqls = this.cPgsqlPrismao.genSql<JunctionPositionDto>({
      type: 'del',
      tblName: 'manual_junctions',
      delIds: ids,
    });
    await this.pgsqlPrismao.$queryRawUnsafe(sqls[0]);
    return R.ok(true);
  }
}
