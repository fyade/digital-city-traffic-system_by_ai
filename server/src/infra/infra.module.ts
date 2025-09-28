import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BaseContextModule } from './base-context/base-context.module';
import { CacheModule } from './cache/cache.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';
import { ScheduleModule } from './schedule/schedule.module';
import { StaticModule } from './static/static.module';
import { WinstonModule } from './winston/winston.module';
import { WsModule } from './ws/ws.module';
import { MailModule } from './sender/mail/mail.module';
import { SmsModule } from './sender/sms/sms.module';

@Module({
  imports:[
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
    MailModule,
    SmsModule,
  ]
})
export class InfraModule {}
