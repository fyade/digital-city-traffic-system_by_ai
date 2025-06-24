import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaoService } from './prismao.service';
import { CommonPostgresqlPrismaoService } from "./common.postgresql.prismao.service";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaoService,
    CommonPostgresqlPrismaoService,
    PostgresqlPrismaoService,
  ],
  exports: [
    PrismaService,
    PrismaoService,
    CommonPostgresqlPrismaoService,
    PostgresqlPrismaoService,
  ],
})
export class PrismaModule {
}
