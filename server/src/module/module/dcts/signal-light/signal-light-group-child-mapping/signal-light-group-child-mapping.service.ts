import { Injectable } from '@nestjs/common';
import { PostgresqlPrismaService } from '../../../../../prisma/postgresql.prisma.service';
import { R } from '../../../../../common/R';
import { SignalLightGroupChildMappingDto, SignalLightGroupChildMappingSelListDto, SignalLightGroupChildMappingSelAllDto, SignalLightGroupChildMappingInsOneDto, SignalLightGroupChildMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';

@Injectable()
export class SignalLightGroupChildMappingService {
  constructor(
      private readonly pgprisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_group_child_mapping', {
      notNullKeys: ['groupId', 'childLightId'],
      numberKeys: ['groupId', 'childLightId'],
    });
  }

  async selSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingSelListDto): Promise<R> {
    const res = await this.pgprisma.findPage<SignalLightGroupChildMappingDto, SignalLightGroupChildMappingSelListDto>('signal_light_group_child_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingSelAllDto): Promise<R> {
    const res = await this.pgprisma.findAll<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightGroupChildMapping(ids: number[]): Promise<R> {
    const res = await this.pgprisma.findByIds<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightGroupChildMapping(id: number): Promise<R> {
    const res = await this.pgprisma.findById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', Number(id));
    return R.ok(res);
  }

  async insSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingInsOneDto): Promise<R> {
    const res = await this.pgprisma.create<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dto);
    return R.ok(res);
  }

  async insSignalLightGroupChildMappings(dtos: SignalLightGroupChildMappingInsOneDto[]): Promise<R> {
    const res = await this.pgprisma.createMany<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dtos);
    return R.ok(res);
  }

  async updSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingUpdOneDto): Promise<R> {
    const res = await this.pgprisma.updateById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dto);
    return R.ok(res);
  }

  async updSignalLightGroupChildMappings(dtos: SignalLightGroupChildMappingUpdOneDto[]): Promise<R> {
    const res = await this.pgprisma.updateMany<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dtos);
    return R.ok(res);
  }

  async delSignalLightGroupChildMapping(ids: number[]): Promise<R> {
    const res = await this.pgprisma.deleteById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', ids);
    return R.ok(res);
  }
}
