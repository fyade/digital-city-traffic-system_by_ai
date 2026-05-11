import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filter/global-exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuFacadeService } from './module/main/sys-manage/menu/menu.facade.service';
import { IdentityModule } from './identity/identity.module';
import { InfraModule } from './infra/infra.module';
import { AlgorithmModule } from './module/algorithm/algorithm.module';
import { DctsModule } from "./module/dcts/dcts.module";
import { MainModule } from './module/main/main.module';

@Module({
  imports: [
    IdentityModule,
    InfraModule,
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
    MenuFacadeService,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {
}
