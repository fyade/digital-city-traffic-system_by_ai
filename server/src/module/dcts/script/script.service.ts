import { Injectable } from '@nestjs/common';
import { ScheduleService } from "../../../infra/schedule/schedule.service";
import { AddRouteInformationModule } from "./module/addRouteInformation";
import { AddVehicleInfoModule } from "./module/addVehicleInfo";
import { AddVehicleTrackPointModule } from "./module/addVehicleTrackPoint";

@Injectable()
export class ScriptService {
  constructor(
      private readonly scheduleService: ScheduleService,
      private readonly ariModule: AddRouteInformationModule,
      private readonly aviModule: AddVehicleInfoModule,
      private readonly avtpModule: AddVehicleTrackPointModule,
  ) {
    this.scheduleService.addScheduleFunc('sys:dcts:script:ari', this.ariModule.main.bind(this.ariModule))
    this.scheduleService.addScheduleFunc('sys:dcts:script:avi', this.aviModule.main.bind(this.aviModule))
    this.scheduleService.addScheduleFunc('sys:dcts:script:avtp', this.avtpModule.main.bind(this.avtpModule))
  }
}
