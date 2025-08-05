import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './infra/auth/auth.module';
import { BaseContextModule } from './infra/base-context/base-context.module';
import { CacheModule } from './infra/cache/cache.module';
import { CommonModule } from "./infra/common/common.module";
import { PrismaModule } from './infra/prisma/prisma.module';
import { QueueModule } from "./infra/queue/queue.module";
import { RedisModule } from './infra/redis/redis.module';
import { ScheduleModule } from "./infra/schedule/schedule.module";
import { StaticModule } from './infra/static/static.module';
import { WinstonModule } from "./infra/winston/winston.module";
import { WsModule } from './infra/ws/ws.module';
import { AlgorithmModule } from './module/algorithm/algorithm.module';
import { DctsModule } from "./module/dcts/dcts.module";
import { MainModule } from './module/main/main.module';

@Module({
  imports: [
    AuthModule,
    BaseContextModule,
    CacheModule,
    CommonModule,
    PrismaModule,
    QueueModule,
    RedisModule,
    ScheduleModule,
    StaticModule,
    WinstonModule,
    WsModule,
    AlgorithmModule,
    DctsModule,
    MainModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {
}
