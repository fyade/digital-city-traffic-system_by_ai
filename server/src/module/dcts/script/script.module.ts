import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { AddRouteInformationModule } from "./module/addRouteInformation";
import { AddVehicleInfoModule } from "./module/addVehicleInfo";
import { AddVehicleTrackPointModule } from "./module/addVehicleTrackPoint";
import { AddAircraftTrackPointModule } from "./module/addAircraftTrackPoint";

@Module({
  providers: [
    ScriptService,
    AddAircraftTrackPointModule,
    AddRouteInformationModule,
    AddVehicleInfoModule,
    AddVehicleTrackPointModule,
  ]
})
export class ScriptModule {
}
