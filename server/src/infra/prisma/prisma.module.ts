import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaoService } from "./prismao.service";
import { MysqlPrismaService } from './mysql.prisma.service';
import { MysqlPrismaoService } from "./mysql.prismao.service";
import { CommonPostgresqlPrismaoService } from "./common.postgresql.prismao.service";
import { PostgresqlPrismaService } from "./postgresql.prisma.service";
import { PostgresqlPrismaoService } from "./postgresql.prismao.service";

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaoService,
    MysqlPrismaService,
    MysqlPrismaoService,
    CommonPostgresqlPrismaoService,
    PostgresqlPrismaService,
    PostgresqlPrismaoService,
  ],
  exports: [
    PrismaService,
    PrismaoService,
    MysqlPrismaService,
    MysqlPrismaoService,
    CommonPostgresqlPrismaoService,
    PostgresqlPrismaService,
    PostgresqlPrismaoService,
  ],
})
export class PrismaModule {
}
