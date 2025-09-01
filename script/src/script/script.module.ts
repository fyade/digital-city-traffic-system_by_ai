import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { AddRouteInformationModule } from "./module/addRouteInformation";
import { AddVehicleInfoModule } from "./module/addVehicleInfo";
import { AddVehicleTrackPointModule } from "./module/addVehicleTrackPoint";

@Module({
  providers: [
    ScriptService,
    AddRouteInformationModule,
    AddVehicleInfoModule,
    AddVehicleTrackPointModule,
  ]
})
export class ScriptModule {
}
