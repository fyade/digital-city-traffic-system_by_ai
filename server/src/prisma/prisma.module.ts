import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaoService } from './prismao.service';
import { PostgresqlPrismaService } from "./postgresql.prisma";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaoService,
    PostgresqlPrismaService,
    PostgresqlPrismaoService
  ],
  exports: [
    PrismaService,
    PrismaoService,
    PostgresqlPrismaService,
    PostgresqlPrismaoService
  ],
})
export class PrismaModule {
}
