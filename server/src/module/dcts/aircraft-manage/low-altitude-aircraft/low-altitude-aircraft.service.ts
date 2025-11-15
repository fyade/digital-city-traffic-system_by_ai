import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { LowAltitudeAircraftDto, LowAltitudeAircraftSelListDto, LowAltitudeAircraftSelAllDto, LowAltitudeAircraftInsOneDto, LowAltitudeAircraftUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class LowAltitudeAircraftService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('low_altitude_aircraft', {
      notNullKeys: ['aircraftName', 'serialNumber', 'registrationNumber', 'type'],
      completeMatchingKeys: ['type'],
    });
  }

  async selLowAltitudeAircraft(dto: LowAltitudeAircraftSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<LowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllLowAltitudeAircraft(dto: LowAltitudeAircraftSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<LowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesLowAltitudeAircraft(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<LowAltitudeAircraftDto>('low_altitude_aircraft', ids);
    return R.ok(res);
  }

  async selOneLowAltitudeAircraft(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<LowAltitudeAircraftDto>('low_altitude_aircraft', id);
    return R.ok(res);
  }

  async insLowAltitudeAircraft(dto: LowAltitudeAircraftInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<LowAltitudeAircraftDto>('low_altitude_aircraft', dto);
    return R.ok(res);
  }

  async insLowAltitudeAircrafts(dtos: LowAltitudeAircraftInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<LowAltitudeAircraftDto>('low_altitude_aircraft', dtos);
    return R.ok(res);
  }

  async updLowAltitudeAircraft(dto: LowAltitudeAircraftUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<LowAltitudeAircraftDto>('low_altitude_aircraft', dto);
    return R.ok(res);
  }

  async updLowAltitudeAircrafts(dtos: LowAltitudeAircraftUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<LowAltitudeAircraftDto>('low_altitude_aircraft', dtos);
    return R.ok(res);
  }

  async delLowAltitudeAircraft(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<LowAltitudeAircraftDto>('low_altitude_aircraft', ids);
    return R.ok(res);
  }
}
