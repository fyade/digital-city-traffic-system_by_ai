import { Injectable } from "@nestjs/common";
import { PostgresqlPrismaoService } from "../../../../infra/prisma/postgresql.prismao.service";
import { LowAltitudeAircraftDto } from "./dto";

@Injectable()
export class LowAltitudeAircraftFacadeService {
  constructor(
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
  ) {
  }

  async randomOne() {
    const lowAltitudeAircraftDtos = await this.pgsqlPrismao.$queryRawUnsafe<LowAltitudeAircraftDto[]>(`
        select *
        from low_altitude_aircraft
        where deleted = 'N'
        order by random() limit 1;
    `);
    return lowAltitudeAircraftDtos[0]
  }
}