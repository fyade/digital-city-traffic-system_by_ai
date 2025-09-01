import { Injectable, OnModuleInit } from '@nestjs/common';
import { AddRouteInformationModule } from "./module/addRouteInformation";
import { AddVehicleInfoModule } from "./module/addVehicleInfo";
import { AddVehicleTrackPointModule } from "./module/addVehicleTrackPoint";

@Injectable()
export class ScriptService implements OnModuleInit {
  constructor(
      private readonly ariModule: AddRouteInformationModule,
      private readonly aviModule: AddVehicleInfoModule,
      private readonly avtpModule: AddVehicleTrackPointModule,
  ) {
  }

  /**
   * 仅供框架调用，禁止外部调用
   */
  async onModuleInit() {
    // await this.ariModule.main()
    // await this.aviModule.main()
    await this.avtpModule.main()
  }
}
