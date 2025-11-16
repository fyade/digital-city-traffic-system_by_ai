import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaService } from "../../../../infra/prisma/postgresql.prisma.service";
import { VehicleInfoDto, VehicleInfoInsOneDto } from "./dto";

@Injectable()
export class VehicleInfoFacadeService {
  constructor(
      private readonly pgsqlPrisma: PostgresqlPrismaService,
  ) {
  }

  async selAll() {
    return this.pgsqlPrisma.findAll<VehicleInfoDto>('vehicle_info', {});
  }

  async selByPlateNumber(plateNumber: string) {
    return this.pgsqlPrisma.findAll<VehicleInfoDto>('vehicle_info', {
      data: {
        plateNumber: plateNumber
      }
    });
  }

  async insMore(dtos: VehicleInfoInsOneDto[]) {
    return this.pgsqlPrisma.createMany<VehicleInfoDto>('vehicle_info', dtos);
  }
}