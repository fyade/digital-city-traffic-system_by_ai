import { Injectable } from '@nestjs/common';
import { R } from '../../../../common/R';
import { VehicleInfoDto, VehicleInfoSelListDto, VehicleInfoSelAllDto, VehicleInfoInsOneDto, VehicleInfoUpdOneDto } from './dto';
import { BaseContextService } from '../../../../infra/base-context/base-context.service';
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";

@Injectable()
export class VehicleInfoService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
      private readonly bcs: BaseContextService,
  ) {
    this.bcs.setFieldSelectParam('vehicle_info', {
      notNullKeys: ['plateNumber', 'vehicleType', 'brand', 'color'],
    });
  }

  async selVehicleInfo(dto: VehicleInfoSelListDto): Promise<R> {
    const res = await this.pgsqlPrisma.findPage<VehicleInfoDto, VehicleInfoSelListDto>('vehicle_info', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selAllVehicleInfo(dto: VehicleInfoSelAllDto): Promise<R> {
    const res = await this.pgsqlPrisma.findAll<VehicleInfoDto>('vehicle_info', {
      data: dto,
      orderBy: false,
    });
    return R.ok(res);
  }

  async selOnesVehicleInfo(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.findByIds<VehicleInfoDto>('vehicle_info', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneVehicleInfo(id: number): Promise<R> {
    const res = await this.pgsqlPrisma.findById<VehicleInfoDto>('vehicle_info', Number(id));
    return R.ok(res);
  }

  async insVehicleInfo(dto: VehicleInfoInsOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.create<VehicleInfoDto>('vehicle_info', dto);
    return R.ok(res);
  }

  async insVehicleInfos(dtos: VehicleInfoInsOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.createMany<VehicleInfoDto>('vehicle_info', dtos);
    return R.ok(res);
  }

  async updVehicleInfo(dto: VehicleInfoUpdOneDto): Promise<R> {
    const res = await this.pgsqlPrisma.updateById<VehicleInfoDto>('vehicle_info', dto);
    return R.ok(res);
  }

  async updVehicleInfos(dtos: VehicleInfoUpdOneDto[]): Promise<R> {
    const res = await this.pgsqlPrisma.updateMany<VehicleInfoDto>('vehicle_info', dtos);
    return R.ok(res);
  }

  async delVehicleInfo(ids: number[]): Promise<R> {
    const res = await this.pgsqlPrisma.deleteById<VehicleInfoDto>('vehicle_info', ids);
    return R.ok(res);
  }
}
