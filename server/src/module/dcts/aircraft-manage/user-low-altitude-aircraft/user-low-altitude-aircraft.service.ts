import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { UserLowAltitudeAircraftDto, UserLowAltitudeAircraftSelListDto, UserLowAltitudeAircraftSelAllDto, UserLowAltitudeAircraftInsOneDto, UserLowAltitudeAircraftUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class UserLowAltitudeAircraftService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('low_altitude_aircraft', {
      notNullKeys: ['aircraftName', 'serialNumber', 'registrationNumber', 'type'],
      numberKeys: ['id'],
      completeMatchingKeys: ['id', 'type', 'createRole', 'createBy'],
    });
  }

  async selUserLowAltitudeAircraft(dto: UserLowAltitudeAircraftSelListDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const res = await this.pgsqlPrisma.findPage<UserLowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: {
        ...dto,
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllUserLowAltitudeAircraft(dto: UserLowAltitudeAircraftSelAllDto): Promise<R> {
    const userData = this.bcs.getUserData();
    const res = await this.pgsqlPrisma.findAll<UserLowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: {
        ...dto,
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesUserLowAltitudeAircraft(ids: number[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(ids, 'low_altitude_aircraft');
    if (_ids.length === 0) {
      return R.ok([]);
    }
    const res = await this.pgsqlPrisma.findByIds<UserLowAltitudeAircraftDto>('low_altitude_aircraft', _ids);
    return R.ok(res);
  }

  async selOneUserLowAltitudeAircraft(id: number): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData([id], 'low_altitude_aircraft');
    if (_ids.length === 0) {
      return R.ok(null);
    }
    const res = await this.pgsqlPrisma.findById<UserLowAltitudeAircraftDto>('low_altitude_aircraft', Number(id));
    return R.ok(res);
  }

  async insUserLowAltitudeAircraft(dto: UserLowAltitudeAircraftInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<UserLowAltitudeAircraftDto>('low_altitude_aircraft', dto);
    return R.ok(res);
  }

  async insUserLowAltitudeAircrafts(dtos: UserLowAltitudeAircraftInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<UserLowAltitudeAircraftDto>('low_altitude_aircraft', dtos);
    return R.ok(res);
  }

  async updUserLowAltitudeAircraft(dto: UserLowAltitudeAircraftUpdOneDto): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData([dto.id], 'low_altitude_aircraft');
    if (_ids.length === 0) {
      return R.ok(null);
    }
    const res = await this.pgsqlPrisma.updateById<UserLowAltitudeAircraftDto>('low_altitude_aircraft', dto);
    return R.ok(res);
  }

  async updUserLowAltitudeAircrafts(dtos: UserLowAltitudeAircraftUpdOneDto[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(dtos.map(d => d.id), 'low_altitude_aircraft');
    const _dtos = dtos.filter(d => _ids.includes(d.id));
    const res = await this.pgsqlPrisma.updateMany<UserLowAltitudeAircraftDto>('low_altitude_aircraft', _dtos);
    return R.ok(res);
  }

  async delUserLowAltitudeAircraft(ids: number[]): Promise<R> {
    const _ids = await this.pgsqlPrisma.getUserAccessibleData(ids, 'low_altitude_aircraft');
    if (_ids.length === 0) {
      return R.ok(true);
    }
    const res = await this.pgsqlPrisma.deleteById<UserLowAltitudeAircraftDto>('low_altitude_aircraft', _ids);
    return R.ok(res);
  }
}
