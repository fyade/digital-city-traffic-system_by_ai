import { Injectable } from '@nestjs/common';
import { PostgresqlPrismaService } from '../../../../infra/prisma/postgresql.prisma.service';
import { R } from '../../../../common/R';
import { SignalLightGroupChildMappingDto, SignalLightGroupChildMappingSelListDto, SignalLightGroupChildMappingSelAllDto, SignalLightGroupChildMappingInsOneDto, SignalLightGroupChildMappingUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { DctsCoreService } from "../../core/dcts-core.service";

@Injectable()
export class SignalLightGroupChildMappingService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
      private readonly dctsCoreService: DctsCoreService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_group_child_mapping', {
      notNullKeys: ['groupId', 'childLightId'],
      numberKeys: ['groupId', 'childLightId'],
    });
  }

  async selSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightGroupChildMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', ids);
    return R.ok(res);
  }

  async selOneSignalLightGroupChildMapping(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', id);
    return R.ok(res);
  }

  async insSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dto);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async insSignalLightGroupChildMappings(dtos: SignalLightGroupChildMappingInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dtos);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async updSignalLightGroupChildMapping(dto: SignalLightGroupChildMappingUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dto);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async updSignalLightGroupChildMappings(dtos: SignalLightGroupChildMappingUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', dtos);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }

  async delSignalLightGroupChildMapping(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightGroupChildMappingDto>('signal_light_group_child_mapping', ids);
    this.dctsCoreService.refreshLightWhenDatabaseChange();
    return R.ok(res);
  }
}
