import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { SignalLightStyleDto, SignalLightStyleSelListDto, SignalLightStyleSelAllDto, SignalLightStyleInsOneDto, SignalLightStyleUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class SignalLightStyleService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('signal_light_style', {
      notNullKeys: ['name', 'style'],
    });
  }

  async selSignalLightStyle(dto: SignalLightStyleSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<SignalLightStyleDto>('signal_light_style', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllSignalLightStyle(dto: SignalLightStyleSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<SignalLightStyleDto>('signal_light_style', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesSignalLightStyle(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<SignalLightStyleDto>('signal_light_style', ids);
    return R.ok(res);
  }

  async selOneSignalLightStyle(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<SignalLightStyleDto>('signal_light_style', Number(id));
    return R.ok(res);
  }

  async insSignalLightStyle(dto: SignalLightStyleInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<SignalLightStyleDto>('signal_light_style', dto);
    return R.ok(res);
  }

  async insSignalLightStyles(dtos: SignalLightStyleInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<SignalLightStyleDto>('signal_light_style', dtos);
    return R.ok(res);
  }

  async updSignalLightStyle(dto: SignalLightStyleUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<SignalLightStyleDto>('signal_light_style', dto);
    return R.ok(res);
  }

  async updSignalLightStyles(dtos: SignalLightStyleUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<SignalLightStyleDto>('signal_light_style', dtos);
    return R.ok(res);
  }

  async delSignalLightStyle(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<SignalLightStyleDto>('signal_light_style', ids);
    return R.ok(res);
  }
}
