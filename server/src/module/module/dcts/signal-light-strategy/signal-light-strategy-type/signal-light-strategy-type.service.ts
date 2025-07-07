import { Injectable } from '@nestjs/common';
import { R } from '../../../../../common/R';
import { SignalLightStrategyTypeDto, SignalLightStrategyTypeSelListDto, SignalLightStrategyTypeSelAllDto, SignalLightStrategyTypeInsOneDto, SignalLightStrategyTypeUpdOneDto } from './dto';
import { BaseContextService } from '../../../../base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../../prisma/postgresql.prisma.service";

@Injectable()
export class SignalLightStrategyTypeService {
  constructor(
      private readonly pgprisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_strategy_type', {
      notNullKeys: ['name', 'description', 'strategyType'],
    });
  }

  async selSignalLightStrategyType(dto: SignalLightStrategyTypeSelListDto): Promise<R> {
    const res = await this.pgprisma.findPage<SignalLightStrategyTypeDto, SignalLightStrategyTypeSelListDto>('signal_light_strategy_type', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightStrategyType(dto: SignalLightStrategyTypeSelAllDto): Promise<R> {
    const res = await this.pgprisma.findAll<SignalLightStrategyTypeDto>('signal_light_strategy_type', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStrategyType(ids: number[]): Promise<R> {
    const res = await this.pgprisma.findByIds<SignalLightStrategyTypeDto>('signal_light_strategy_type', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneSignalLightStrategyType(id: number): Promise<R> {
    const res = await this.pgprisma.findById<SignalLightStrategyTypeDto>('signal_light_strategy_type', Number(id));
    return R.ok(res);
  }

  async insSignalLightStrategyType(dto: SignalLightStrategyTypeInsOneDto): Promise<R> {
    const res = await this.pgprisma.create<SignalLightStrategyTypeDto>('signal_light_strategy_type', dto);
    return R.ok(res);
  }

  async insSignalLightStrategyTypes(dtos: SignalLightStrategyTypeInsOneDto[]): Promise<R> {
    const res = await this.pgprisma.createMany<SignalLightStrategyTypeDto>('signal_light_strategy_type', dtos);
    return R.ok(res);
  }

  async updSignalLightStrategyType(dto: SignalLightStrategyTypeUpdOneDto): Promise<R> {
    const res = await this.pgprisma.updateById<SignalLightStrategyTypeDto>('signal_light_strategy_type', dto);
    return R.ok(res);
  }

  async updSignalLightStrategyTypes(dtos: SignalLightStrategyTypeUpdOneDto[]): Promise<R> {
    const res = await this.pgprisma.updateMany<SignalLightStrategyTypeDto>('signal_light_strategy_type', dtos);
    return R.ok(res);
  }

  async delSignalLightStrategyType(ids: number[]): Promise<R> {
    const res = await this.pgprisma.deleteById<SignalLightStrategyTypeDto>('signal_light_strategy_type', ids);
    return R.ok(res);
  }
}
