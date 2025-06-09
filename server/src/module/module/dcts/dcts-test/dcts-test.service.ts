import { Injectable, OnModuleInit } from '@nestjs/common';
import { PostgresqlPrismaService } from "../../../../prisma/postgresql.prisma";
import { PostgresqlPrismaoService } from "../../../../prisma/postgresql.prismao.service";

@Injectable()
export class DctsTestService implements OnModuleInit {
  constructor(
      private readonly pgprismao: PostgresqlPrismaoService
  ) {
  }

  async onModuleInit() {
    await this.init()
  }

  async init() {
    const newVar = await this.pgprismao.$queryRaw`
        select count(*)
        from "digital-city-traffic-system".public.planet_osm_roads;
    `;
    console.log(`========== ========== ========== ========== ========== ${newVar} ========== ========== ========== ========== ==========`)
  }
}
