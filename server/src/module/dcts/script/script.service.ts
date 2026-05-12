import { Injectable } from '@nestjs/common';
import { ScheduleService } from "../../../infra/schedule/schedule.service";
import { AddRouteInformationModule } from "./module/addRouteInformation";
import { AddVehicleInfoModule } from "./module/addVehicleInfo";
import { AddVehicleTrackPointModule } from "./module/addVehicleTrackPoint";
import { AddAircraftTrackPointModule } from "./module/addAircraftTrackPoint";
import { GenerateMockStrategyDataModule } from "./module/generateMockStrategyData";

@Injectable()
export class ScriptService {
  constructor(
      private readonly scheduleService: ScheduleService,
      private readonly aatpModule: AddAircraftTrackPointModule,
      private readonly ariModule: AddRouteInformationModule,
      private readonly aviModule: AddVehicleInfoModule,
      private readonly avtpModule: AddVehicleTrackPointModule,
      private readonly gmsdModule: GenerateMockStrategyDataModule,
  ) {
    this.scheduleService.addScheduleFunc('sys:dcts:script:aatp', this.aatpModule.main.bind(this.aatpModule))
    this.scheduleService.addScheduleFunc('sys:dcts:script:ari', this.ariModule.main.bind(this.ariModule))
    this.scheduleService.addScheduleFunc('sys:dcts:script:avi', this.aviModule.main.bind(this.aviModule))
    this.scheduleService.addScheduleFunc('sys:dcts:script:avtp', this.avtpModule.main.bind(this.avtpModule))
    this.scheduleService.addScheduleFunc('sys:dcts:script:gmsd', this.gmsdModule.main.bind(this.gmsdModule))
  }
}
