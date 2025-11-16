import { Injectable } from '@nestjs/common';
import { R } from "../../../common/R";
import { AddAircraftTrackPointDto, AddRouteInformationDto, AddVehicleInfoDto, AddVehicleTrackPointDto } from "./dto";
import { SpatialDataService } from "../spatial-data/spatial-data.service";
import { arrayUtils, geoUtils, numberUtils } from "@dcts/common";
import { CommonService } from "../../../infra/common/common.service";
import { VehicleInfoDto } from "../vehicle/vehicle-info/dto";
import { PostgresqlPrismaoService } from "../../../infra/prisma/postgresql.prismao.service";
import { PrismaoService } from "../../../infra/prisma/prismao.service";
import { VehicleTrackPointDto, VehicleTrackPointInsOneDto } from "../vehicle/vehicle-track-point/dto";
import { CommonPostgresqlPrismaoService } from "../../../infra/prisma/common.postgresql.prismao.service";
import { VehicleInfoFacadeService } from "../vehicle/vehicle-info/vehicle-info.facade.service";
import { VehicleTrackPointFacadeService } from "../vehicle/vehicle-track-point/vehicle-track-point.facade.service";
import { LowAltitudeAircraftFacadeService } from "../aircraft-manage/low-altitude-aircraft/low-altitude-aircraft.facade.service";

@Injectable()
export class ExternalService {
  constructor(
      private readonly spatialDataService: SpatialDataService,
      private readonly cPgsqlPrismao: CommonPostgresqlPrismaoService,
      private readonly pgsqlPrismao: PostgresqlPrismaoService,
      private readonly prismao: PrismaoService,
      private readonly commonService: CommonService,
      private readonly vehicleInfoFacadeService: VehicleInfoFacadeService,
      private readonly vehicleTrackPointFacadeService: VehicleTrackPointFacadeService,
      private readonly lowAltitudeAircraftFacadeService: LowAltitudeAircraftFacadeService,
  ) {
  }

  async addRouteInformation(dto: AddRouteInformationDto): Promise<R> {
    const bounds = geoUtils.expandBounds([Math.max(dto.startPoint.lat, dto.endPoint.lat), Math.max(dto.startPoint.lon, dto.endPoint.lon), Math.min(dto.startPoint.lat, dto.endPoint.lat), Math.min(dto.startPoint.lon, dto.endPoint.lon)]);
    const points = [
      {lon: bounds[1], lat: bounds[0]},
      {lon: bounds[1], lat: bounds[2]},
      {lon: bounds[3], lat: bounds[2]},
      {lon: bounds[3], lat: bounds[0]},
    ]
    points.push(points[0])
    const allRoads = await this.spatialDataService.nodesWithWaysInPolygon({
      points: points
    });
    return R.ok(allRoads.data)
  }

  async addVehicleInfo(dto: AddVehicleInfoDto): Promise<R> {
    const _carTypes = await this.commonService.selDicDataOfType('dcts:car:type')
    const _carBoards = await this.commonService.selDicDataOfType('dcts:car:board')
    const carTypes = _carTypes.map(item => item.value);
    const carBoards = _carBoards.map(item => item.value);
    const vs = dto.plateNumbers.map((item, index) => {
      const vehicle = new VehicleInfoDto();
      vehicle.vehicleType = carTypes[index % carTypes.length];
      vehicle.brand = carBoards[index % carBoards.length];
      const strings = item.split('$$$');
      vehicle.plateNumber = strings[0];
      vehicle.color = strings[1];
      return vehicle
    });
    await this.vehicleInfoFacadeService.insMore(vs.map(item => ({
      plateNumber: item.plateNumber,
      vehicleType: item.vehicleType,
      brand: item.brand,
      color: item.color,
    })));
    return R.ok(true)
  }

  async addVehicleTrackPoint(dto: AddVehicleTrackPointDto): Promise<R> {
    const vehicleInfos = await this.vehicleInfoFacadeService.selAll();
    const data1 = this.prismao.defaultInsArg().data;
    const datas: VehicleTrackPointDto[] = []
    for (const data of dto.datas) {
      const vehicleInfo = vehicleInfos[numberUtils.randomNumber(0, vehicleInfos.length - 1)];
      for (const datum of data) {
        datas.push({
          id: null,
          vehicleId: vehicleInfo.id,
          point: datum.position.join(','),
          heading: datum.heading,
          createBy: data1.create_by,
          createRole: data1.create_role,
          createTime: new Date(datum.time).toISOString(),
          updateBy: data1.update_by,
          updateRole: data1.update_role,
          updateTime: new Date(datum.time).toISOString(),
          deleted: data1.deleted,
        })
      }
    }
    await this.vehicleTrackPointFacadeService.insMore(datas);
    return R.ok(true);
  }

  private addAircraftTrackPointMap = new Map<number, number>()

  async addAircraftTrackPoint(dto: AddAircraftTrackPointDto): Promise<R> {
    const lowAltitudeAircraft = await this.lowAltitudeAircraftFacadeService.randomOne();
    const indexs = arrayUtils.arrNoRepeat(dto.datas.map(item => item.index));
    for (const index of indexs) {
      if (!this.addAircraftTrackPointMap.has(index)) {
        this.addAircraftTrackPointMap.set(index, lowAltitudeAircraft.id)
      }
    }

    if (dto.end) {
      this.addAircraftTrackPointMap.clear()
    }
    return R.ok(true)
  }
}
