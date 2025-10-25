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
      notNullKeys: ['aircraftName', 'serialNumber', 'registrationNumber'],
      numberKeys: ['id'],
      completeMatchingKeys: ['id', 'createRole', 'createBy'],
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
    const userData = this.bcs.getUserData();
    const res = await this.pgsqlPrisma.findByIds<UserLowAltitudeAircraftDto>('low_altitude_aircraft', ids);
    const res0 = res.filter(re => re.createBy === userData.userId && re.createRole === userData.loginRole);
    return R.ok(res0);
  }

  async selOneUserLowAltitudeAircraft(id: number): Promise<R> {
    const userData = this.bcs.getUserData();
    const res = await this.pgsqlPrisma.findById<UserLowAltitudeAircraftDto>('low_altitude_aircraft', Number(id));
    if (res.createBy === userData.userId && res.createRole === userData.loginRole) {
      return R.ok(res);
    }
    return R.ok(null);
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
    const userData = this.bcs.getUserData();
    const _res = await this.pgsqlPrisma.findAll<UserLowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: {
        id: dto.id,
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
    });
    if (_res[0]) {
      const res = await this.pgsqlPrisma.updateById<UserLowAltitudeAircraftDto>('low_altitude_aircraft', dto);
      return R.ok(res);
    }
    return R.ok(null);
  }

  async updUserLowAltitudeAircrafts(dtos: UserLowAltitudeAircraftUpdOneDto[]): Promise<R> {
    const userData = this.bcs.getUserData();
    const _res = await this.pgsqlPrisma.findAll<UserLowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: {
        id: {
          in: {
            value: dtos.map(d => d.id),
          },
        },
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
    });
    const _resIds = _res.map(re => re.id);
    const _dtos = dtos.filter(d => _resIds.includes(d.id));
    const res = await this.pgsqlPrisma.updateMany<UserLowAltitudeAircraftDto>('low_altitude_aircraft', _dtos);
    return R.ok(res);
  }

  async delUserLowAltitudeAircraft(ids: number[]): Promise<R> {
    const userData = this.bcs.getUserData();
    const _res = await this.pgsqlPrisma.findAll<UserLowAltitudeAircraftDto>('low_altitude_aircraft', {
      data: {
        id: {
          in: {
            value: ids,
          },
        },
        createRole: userData.loginRole,
        createBy: userData.userId,
      },
    });
    const _resIds = _res.map(re => re.id);
    const _ids = ids.filter(d => _resIds.includes(d));
    const res = await this.pgsqlPrisma.deleteById<UserLowAltitudeAircraftDto>('low_altitude_aircraft', _ids);
    return R.ok(res);
  }
}
