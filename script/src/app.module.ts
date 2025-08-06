import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScriptModule } from './script/script.module';
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ScriptModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
