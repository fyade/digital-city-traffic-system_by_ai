import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightChildStyleMappingDto, SignalLightChildStyleMappingSelListDto, SignalLightChildStyleMappingSelAllDto, SignalLightChildStyleMappingInsOneDto, SignalLightChildStyleMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { PrismaoService } from "../../../../infra/prisma/prismao.service";

@Injectable()
export class SignalLightChildStyleMappingService {
  constructor(
      private readonly prismao: PrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_child_style_mapping', {
      notNullKeys: ['childId', 'styleId'],
      numberKeys: ['childId', 'styleId'],
    });
  }

  async selSignalLightChildStyleMapping(dto: SignalLightChildStyleMappingSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightChildStyleMapping(dto: SignalLightChildStyleMappingSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightChildStyleMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', ids);
    return R.ok(res);
  }

  async selOneSignalLightChildStyleMapping(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', id);
    return R.ok(res);
  }

  async insSignalLightChildStyleMapping(dto: SignalLightChildStyleMappingInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightChildStyleMappings(dtos: SignalLightChildStyleMappingInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightChildStyleMapping(dto: SignalLightChildStyleMappingUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightChildStyleMappings(dtos: SignalLightChildStyleMappingUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightChildStyleMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', ids);
    return R.ok(res);
  }

  async insSignalLightChildStyleMappingV2(dto: SignalLightChildStyleMappingInsOneDto): Promise<R> {
    const datas = await this.pgsqlPrismao.signal_light_child_style_mapping.findMany({
      where: {
        child_id: dto.childId,
        ...this.prismao.defaultSelArg().where
      }
    });
    if (datas.length > 0) {
      const defaultDelArg = this.prismao.defaultDelArg();
      await this.pgsqlPrismao.signal_light_child_style_mapping.updateMany({
        data: {
          ...defaultDelArg.data
        },
        where: {
          id: {
            in: datas.map(item => item.id)
          },
          ...defaultDelArg.where
        }
      })
    }
    await this.pgsqlPrisma.create<SignalLightChildStyleMappingDto>('signal_light_child_style_mapping', dto);
    return R.ok(true);
  }
}
