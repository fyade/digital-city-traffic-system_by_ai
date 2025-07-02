import { Global, Module } from '@nestjs/common';
import { CommonPostgresqlPrismaoService } from "./common.postgresql.prismao.service";
import { PostgresqlPrismaService } from "./postgresql.prisma.service";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";
import { PrismaService } from './prisma.service';
import { PrismaoService } from './prismao.service';

@Global()
@Module({
  providers: [
    CommonPostgresqlPrismaoService,
    PostgresqlPrismaService,
    PostgresqlPrismaoService,
    PrismaService,
    PrismaoService,
  ],
  exports: [
    CommonPostgresqlPrismaoService,
    PostgresqlPrismaService,
    PostgresqlPrismaoService,
    PrismaService,
    PrismaoService,
  ],
})
export class PrismaModule {
}
